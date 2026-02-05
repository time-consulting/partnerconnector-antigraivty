import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();
const DEV_VERSION = nanoid();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // CRITICAL FIX: Explicitly get the internal port from the environment.
  // This tells Vite's HMR client where to connect, resolving the 'localhost:undefined' error.
  const internalPort = parseInt(process.env.PORT || '5000', 10); 

  const serverOptions = {
    middlewareMode: true,
    hmr: { 
      server,
      clientPort: internalPort, // Fixes wss://localhost:undefined issue
      protocol: 'wss' as const, // Uses secure protocol required by Replit for public connections
    },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // PERFORMANCE FIX: Read the template once at startup, instead of on every request.
  const clientTemplatePath = path.resolve(
    import.meta.dirname,
    "..",
    "client",
    "index.html",
  );
  let template = await fs.promises.readFile(clientTemplatePath, "utf-8");


  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Use the cached template content. This fixes the performance issue
      // caused by reading the file system on every incoming request.
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "client", "dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
