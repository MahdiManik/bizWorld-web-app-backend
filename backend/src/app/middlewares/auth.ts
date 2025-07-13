import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../middleware/error/errorHandler';
import config from '../../config';

const prisma = new PrismaClient();

// Extend Request type to include user and admin properties
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
        email?: string;
      };
      admin?: {
        adminId: string;
        role: string;
        email?: string;
      };
    }
  }
}

// Auth middleware that verifies JWT token
const auth = (requiredRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError('Unauthorized: No token provided', httpStatus.UNAUTHORIZED);
      }
      
      // Extract token
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        throw new ApiError('Unauthorized: Invalid token format', httpStatus.UNAUTHORIZED);
      }
      
      try {
        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret) as any;
        
        // Debug token contents
        console.log('JWT token decoded:', decoded);
        
        // Ensure we have a userId - check different possible formats
        const userId = decoded.userId || decoded.id || decoded.sub;
        
        if (!userId) {
          console.error('No userId found in token:', decoded);
          throw new ApiError('Unauthorized: Invalid token format (missing userId)', httpStatus.UNAUTHORIZED);
        }
        
        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        
        console.log('Found user:', user ? 'Yes' : 'No');
        
        if (!user) {
          throw new ApiError('Unauthorized: User not found', httpStatus.UNAUTHORIZED);
        }
        
        // Check if user has required role (if specified)
        if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
          throw new ApiError('Forbidden: Insufficient privileges', httpStatus.FORBIDDEN);
        }
        
        // Set user info in request object
        req.user = {
          userId: decoded.userId,
          role: decoded.role,
          email: user.email,
        };
        
        next();
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          throw new ApiError('Unauthorized: Invalid token', httpStatus.UNAUTHORIZED);
        } else if (error instanceof jwt.TokenExpiredError) {
          throw new ApiError('Unauthorized: Token expired', httpStatus.UNAUTHORIZED);
        } else {
          throw error;
        }
      }
    } catch (error) {
      next(error);
    }
  };
};

// Admin auth middleware that verifies JWT token for admin operations
const adminAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError('Unauthorized: No token provided', httpStatus.UNAUTHORIZED);
      }

      // Extract token
      const token = authHeader.split(' ')[1];

      if (!token) {
        throw new ApiError('Unauthorized: Invalid token format', httpStatus.UNAUTHORIZED);
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret) as any;

        // Debug token contents
        console.log('Admin JWT token decoded:', decoded);

        // Ensure we have an adminId - check different possible formats
        const adminId = decoded.adminId || decoded.id || decoded.sub;

        if (!adminId) {
          console.error('No adminId found in token:', decoded);
          throw new ApiError('Unauthorized: Invalid admin token format (missing adminId)', httpStatus.UNAUTHORIZED);
        }

        // Check if admin exists
        const admin = await prisma.admin.findUnique({
          where: { id: adminId },
        });

        console.log('Found admin:', admin ? 'Yes' : 'No');

        if (!admin) {
          throw new ApiError('Unauthorized: Admin not found', httpStatus.UNAUTHORIZED);
        }

        // Check if the role is ADMIN
        if (admin.role !== 'ADMIN') {
          throw new ApiError('Forbidden: Admin privileges required', httpStatus.FORBIDDEN);
        }

        // Set admin info in request object
        req.admin = {
          adminId: admin.id,
          role: admin.role,
          email: admin.email,
        };

        next();
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          throw new ApiError('Unauthorized: Invalid admin token', httpStatus.UNAUTHORIZED);
        } else if (error instanceof jwt.TokenExpiredError) {
          throw new ApiError('Unauthorized: Admin token expired', httpStatus.UNAUTHORIZED);
        } else {
          throw error;
        }
      }
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
export { adminAuth };
