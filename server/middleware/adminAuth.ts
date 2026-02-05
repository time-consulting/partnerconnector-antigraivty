import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Admin authentication middleware
export const requireAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated first (req.user is set by requireAuth middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // User is already loaded by requireAuth, just check admin status
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    // Store admin user data for use in routes
    req.adminUser = req.user;
    next();
  } catch (error) {
    console.error('Error in requireAdmin middleware:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Audit logging middleware for admin actions
export const auditAdminAction = (action: string, entityType: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    // Store audit info for later use in routes
    req.auditInfo = {
      action,
      entityType,
      actorId: req.adminUser?.id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    };
    next();
  };
};