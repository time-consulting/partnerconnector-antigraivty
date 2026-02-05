import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { pool } from "./db";

declare module "express-session" {
  interface SessionData {
    referralCode?: string;
  }
}

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    const issuerUrl = process.env.ISSUER_URL || "https://replit.com/oidc";
    console.log("Using OIDC issuer:", issuerUrl);
    return await client.discovery(
      new URL(issuerUrl),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    pool: pool, // Reuse the same pool from db.ts
    createTableIfMissing: true, // Allow creating table if needed
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
  referralCode?: string,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  }, referralCode);
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const createVerifyFunction = (): any => {
    return async (
      req: any,
      tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
      verified: passport.AuthenticateCallback
    ) => {
      const user = {};
      updateUserSession(user, tokens);
      
      const referralCode = req?.session?.referralCode;
      const userEmail = tokens.claims()["email"];
      
      console.log('[AUTH] Verify callback - User:', userEmail);
      console.log('[AUTH] Verify callback - Referral code from session:', referralCode);
      console.log('[AUTH] Verify callback - Session ID:', req?.sessionID);
      
      await upsertUser(tokens.claims(), referralCode);
      
      if (referralCode && req?.session) {
        console.log('[AUTH] Clearing referral code from session after use');
        delete req.session.referralCode;
      }
      
      verified(null, user);
    };
  };

  // Get domains and add localhost/127.0.0.1 for development
  let domains = process.env.REPLIT_DOMAINS!.split(",").map(d => d.trim());
  
  // Add localhost domains for development
  if (process.env.NODE_ENV === 'development') {
    domains.push('localhost', '127.0.0.1');
  }
  
  // Remove duplicates
  domains = Array.from(new Set(domains));

  for (const domain of domains) {
    // Use http for localhost/127.0.0.1, https for others
    const isLocal = ['localhost', '127.0.0.1'].includes(domain);
    const protocol = isLocal ? 'http' : 'https';
    // Only include port for local development domains
    const callbackURL = isLocal 
      ? `${protocol}://${domain}:5000/api/callback`
      : `${protocol}://${domain}/api/callback`;
    
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL,
        passReqToCallback: true,
      },
      createVerifyFunction(),
    );
    passport.use(strategy);
  }

  // Strategy resolver to handle runtime hostnames
  function strategyForHost(host: string): string {
    const allowedDomains = domains.map(d => d.toLowerCase());
    const hostname = host.toLowerCase();
    const domain = allowedDomains.includes(hostname) ? hostname : allowedDomains[0];
    return `replitauth:${domain}`;
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    const referralCode = req.query.ref as string | undefined;
    if (referralCode) {
      req.session.referralCode = referralCode;
      console.log('[AUTH] Referral code captured in session:', referralCode);
      console.log('[AUTH] Session ID:', req.sessionID);
    } else {
      console.log('[AUTH] No referral code in query parameters');
    }
    
    passport.authenticate(strategyForHost(req.hostname), {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(strategyForHost(req.hostname), {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      // Destroy the session completely
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
        // Clear the cookie
        res.clearCookie('connect.sid', {
          path: '/',
          secure: true,
          httpOnly: true
        });
        // Redirect to login page after logout
        res.redirect('/login');
      });
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
