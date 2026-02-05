import winston from 'winston';
import * as rfs from 'rotating-file-stream';
import path from 'path';
import { Request, Response } from 'express';

const isDevelopment = process.env.NODE_ENV === 'development';

// Only create file streams in production to avoid triggering Vite's file watcher
const logsDir = path.join(process.cwd(), 'logs');

let accessLogStream: rfs.RotatingFileStream | null = null;
let errorLogStream: rfs.RotatingFileStream | null = null;

if (!isDevelopment) {
  accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logsDir,
    maxFiles: 30,
    compress: 'gzip'
  });

  errorLogStream = rfs.createStream('error.log', {
    interval: '1d',
    path: logsDir,
    maxFiles: 30,
    compress: 'gzip'
  });
}

// Custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    // Handle circular references safely
    const safeStringify = (obj: any) => {
      const seen = new Set();
      return JSON.stringify(obj, (key, val) => {
        if (typeof val === "object" && val !== null) {
          if (seen.has(val)) {
            return "[Circular]";
          }
          seen.add(val);
        }
        return val;
      });
    };
    
    try {
      return safeStringify({
        timestamp,
        level,
        message,
        ...meta
      });
    } catch (error) {
      // Fallback if even safe stringify fails
      return JSON.stringify({
        timestamp,
        level,
        message: typeof message === 'string' ? message : String(message),
        meta: '[Unable to serialize]'
      });
    }
  })
);

// Build transports array conditionally
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
];

// Add file transports only in production
if (accessLogStream) {
  transports.push(new winston.transports.Stream({
    stream: accessLogStream,
    level: 'info'
  }));
}
if (errorLogStream) {
  transports.push(new winston.transports.Stream({
    stream: errorLogStream,
    level: 'error'
  }));
}

// Build exception/rejection handlers conditionally
const exceptionHandlers: winston.transport[] = [new winston.transports.Console()];
const rejectionHandlers: winston.transport[] = [new winston.transports.Console()];

if (errorLogStream) {
  exceptionHandlers.push(new winston.transports.Stream({ stream: errorLogStream }));
  rejectionHandlers.push(new winston.transports.Stream({ stream: errorLogStream }));
}

// Create Winston logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'partner-connector',
    environment: process.env.NODE_ENV || 'development'
  },
  transports,
  exceptionHandlers,
  rejectionHandlers
});

// Request logger interface
export interface LogContext {
  requestId: string;
  userId?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  userAgent?: string;
  ip?: string;
  error?: Error;
  metadata?: Record<string, any>;
}

// Structured logging functions
export const logRequest = (context: LogContext) => {
  logger.info('HTTP Request', {
    requestId: context.requestId,
    userId: context.userId,
    route: context.route,
    method: context.method,
    statusCode: context.statusCode,
    duration: context.duration,
    userAgent: context.userAgent,
    ip: context.ip,
    metadata: context.metadata
  });
};

export const logError = (context: LogContext, error: Error) => {
  logger.error('HTTP Error', {
    requestId: context.requestId,
    userId: context.userId,
    route: context.route,
    method: context.method,
    statusCode: context.statusCode,
    duration: context.duration,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    metadata: context.metadata
  });
};

export const logAudit = (action: string, actorUserId: string, entityType: string, entityId?: string, metadata?: Record<string, any>) => {
  logger.info('Audit Event', {
    action,
    actorUserId,
    entityType,
    entityId,
    metadata,
    timestamp: new Date().toISOString()
  });
};

// Performance metrics storage
export const metrics = {
  requests: {
    total: 0,
    errors: 0,
    latencies: [] as number[]
  },
  
  reset: () => {
    metrics.requests.total = 0;
    metrics.requests.errors = 0;
    metrics.requests.latencies = [];
  },
  
  addRequest: (duration: number, isError: boolean = false) => {
    metrics.requests.total++;
    if (isError) metrics.requests.errors++;
    metrics.requests.latencies.push(duration);
    
    // Keep only last 1000 latencies for memory efficiency
    if (metrics.requests.latencies.length > 1000) {
      metrics.requests.latencies = metrics.requests.latencies.slice(-1000);
    }
  },
  
  getP95Latency: () => {
    if (metrics.requests.latencies.length === 0) return 0;
    const sorted = [...metrics.requests.latencies].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * 0.95) - 1;
    return sorted[index] || 0;
  },
  
  getErrorRate: () => {
    if (metrics.requests.total === 0) return 0;
    return (metrics.requests.errors / metrics.requests.total) * 100;
  }
};