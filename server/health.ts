import { Request, Response } from 'express';
import { db } from './db';
import { metrics } from './logger';

// Health check interfaces
interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version?: string;
}

interface ReadinessCheck {
  status: 'ready' | 'not_ready';
  timestamp: string;
  checks: {
    database: 'ok' | 'error';
    environment: 'ok' | 'error';
  };
  errors?: string[];
}

interface MetricsResponse {
  timestamp: string;
  uptime: number;
  requests: {
    total: number;
    errors: number;
    errorRate: number;
  };
  performance: {
    latencyP95: number;
    averageLatency: number;
  };
  memory: {
    used: number;
    total: number;
    usage: number;
  };
  environment: string;
}

// Quick health check - should be fast (<100ms)
export const healthzHandler = (req: Request, res: Response) => {
  const health: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  };
  
  res.status(200).json(health);
};

// Readiness check - validates dependencies
export const readyzHandler = async (req: Request, res: Response) => {
  const errors: string[] = [];
  let dbStatus: 'ok' | 'error' = 'ok';
  let envStatus: 'ok' | 'error' = 'ok';
  
  // Check database connection
  try {
    await db.execute('SELECT 1');
  } catch (error) {
    dbStatus = 'error';
    errors.push(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  // Check critical environment variables
  const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      envStatus = 'error';
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }
  
  const readiness: ReadinessCheck = {
    status: errors.length === 0 ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
    checks: {
      database: dbStatus,
      environment: envStatus
    }
  };
  
  if (errors.length > 0) {
    readiness.errors = errors;
  }
  
  const statusCode = readiness.status === 'ready' ? 200 : 503;
  res.status(statusCode).json(readiness);
};

// Metrics endpoint - performance and operational metrics
export const metricsHandler = (req: Request, res: Response) => {
  const memUsage = process.memoryUsage();
  
  const metricsData: MetricsResponse = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    requests: {
      total: metrics.requests.total,
      errors: metrics.requests.errors,
      errorRate: metrics.getErrorRate()
    },
    performance: {
      latencyP95: metrics.getP95Latency(),
      averageLatency: metrics.requests.latencies.length > 0 
        ? metrics.requests.latencies.reduce((a, b) => a + b, 0) / metrics.requests.latencies.length 
        : 0
    },
    memory: {
      used: memUsage.heapUsed,
      total: memUsage.heapTotal,
      usage: (memUsage.heapUsed / memUsage.heapTotal) * 100
    },
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.status(200).json(metricsData);
};