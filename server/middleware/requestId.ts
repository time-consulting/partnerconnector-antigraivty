import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger, logRequest, logError, metrics, LogContext } from '../logger';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      startTime: number;
    }
  }
}

// RequestId middleware - adds unique ID to each request
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.requestId = uuidv4();
  req.startTime = Date.now();
  
  // Add requestId to response headers for debugging
  res.setHeader('X-Request-ID', req.requestId);
  
  next();
};

// Logging middleware - logs all requests with structured format
export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Track response completion
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // 401 on auth check endpoint is expected behavior, not an error
    const isAuthCheck = req.path === '/api/auth/user' && req.method === 'GET';
    const isExpected401 = res.statusCode === 401 && isAuthCheck;
    const isError = res.statusCode >= 400 && !isExpected401;
    
    // Add to metrics
    metrics.addRequest(duration, isError);
    
    // Extract user ID from request if available
    const userId = (req as any).user?.claims?.sub || (req as any).user?.id;
    
    const logContext: LogContext = {
      requestId: req.requestId,
      userId,
      route: req.route?.path || req.path,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      metadata: {
        query: req.query,
        params: req.params,
        body: req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' 
          ? sanitizeBody(req.body) 
          : undefined
      }
    };
    
    if (isError) {
      logError(logContext, new Error(`HTTP ${res.statusCode} ${res.statusMessage}`));
    } else {
      logRequest(logContext);
    }
  });
  
  next();
};

// Sanitize request body to remove sensitive data
function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') return body;
  
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
  const sanitized = { ...body };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

// Error handling middleware
export const errorHandlingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const duration = Date.now() - req.startTime;
  const userId = (req as any).user?.claims?.sub || (req as any).user?.id;
  
  const logContext: LogContext = {
    requestId: req.requestId,
    userId,
    route: req.route?.path || req.path,
    method: req.method,
    statusCode: res.statusCode || 500,
    duration,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress
  };
  
  logError(logContext, err);
  
  // Send error response
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal Server Error',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};