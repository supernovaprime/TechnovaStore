import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { UserRole, Permission, TokenPayload } from '../types/auth.types';
import { config } from '../config';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      logger.warn('Authentication failed: No token provided');
      ApiResponse.error(res, 'Authentication required', 401);
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      logger.warn(`Authentication failed: User not found for userId ${decoded.userId}`);
      ApiResponse.error(res, 'Invalid token - user not found', 401);
      return;
    }

    if (!user.isActive) {
      logger.warn(`Authentication failed: User account deactivated for userId ${decoded.userId}`);
      ApiResponse.error(res, 'Account is deactivated', 401);
      return;
    }

    req.user = user;
    logger.debug(`User authenticated: ${user.email}, role: ${user.role}`);
    next();
  } catch (error) {
    logger.error(`Authentication error: ${(error as Error).message}`);
    ApiResponse.error(res, 'Invalid or expired token', 401);
  }
};

export const authorize = (...permissions: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        logger.warn('Authorization failed: No user in request');
        ApiResponse.error(res, 'Authentication required', 401);
        return;
      }

      const userPermissions = req.user.permissions || [];
      const hasPermission = permissions.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        logger.warn(
          `Authorization failed: User ${req.user.email} missing permissions: ${permissions.join(', ')}`
        );
        ApiResponse.error(res, 'Insufficient permissions', 403);
        return;
      }

      logger.debug(`User ${req.user.email} authorized for permissions: ${permissions.join(', ')}`);
      next();
    } catch (error) {
      logger.error(`Authorization error: ${(error as Error).message}`);
      ApiResponse.error(res, 'Authorization failed', 403);
    }
  };
};

export const authorizeRole = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        logger.warn('Role authorization failed: No user in request');
        ApiResponse.error(res, 'Authentication required', 401);
        return;
      }

      if (!roles.includes(req.user.role)) {
        logger.warn(
          `Role authorization failed: User ${req.user.email} with role ${req.user.role} attempted to access resource requiring roles: ${roles.join(', ')}`
        );
        ApiResponse.error(res, 'Access denied for your role', 403);
        return;
      }

      logger.debug(`User ${req.user.email} authorized for roles: ${roles.join(', ')}`);
      next();
    } catch (error) {
      logger.error(`Role authorization error: ${(error as Error).message}`);
      ApiResponse.error(res, 'Authorization failed', 403);
    }
  };
};

export const adminOnly = authorizeRole(UserRole.ADMIN);
export const managerOrAdmin = authorizeRole(UserRole.MANAGER, UserRole.ADMIN);
export const customerOnly = authorizeRole(UserRole.CUSTOMER, UserRole.ADMIN);
