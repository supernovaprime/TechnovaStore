import jwt from 'jsonwebtoken';
import { User } from '../models';
import { UserRole, ROLE_PERMISSIONS, TokenPayload } from '../types/auth.types';
import { config } from '../config';
import {
  generateEmailVerificationToken,
  generatePasswordResetToken
} from '../utils/helpers';
import { logger } from '../utils/logger';
import { AuditService } from './audit.service';
import { Request } from 'express';

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }, req?: Request): Promise<{ user: any; token: string }> {
    try {
      const existingUser = await User.findOne({ email: data.email.toLowerCase() });
      if (existingUser) {
        logger.warn(`Registration attempt with existing email: ${data.email}`);
        throw new Error('Email already registered');
      }

      const role = data.role || UserRole.CUSTOMER;
      const permissions = ROLE_PERMISSIONS[role] || [];

      const emailVerificationToken = generateEmailVerificationToken();

      const user = await User.create({
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        role,
        permissions,
        emailVerificationToken
      });

      const token = this.generateToken(user);

      AuditService.logAuthEvent({
        action: 'register',
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        status: 'success',
        ip: req ? AuditService.extractIp(req) : undefined,
        userAgent: req ? AuditService.extractUserAgent(req) : undefined,
        metadata: { name: user.name }
      });

      logger.info(`User registered successfully: ${user.email}, role: ${user.role}`);
      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      AuditService.logAuthEvent({
        action: 'register',
        email: data.email.toLowerCase(),
        status: 'failed',
        failureReason: error instanceof Error ? error.message : 'Unknown error',
        ip: req ? AuditService.extractIp(req) : undefined,
        userAgent: req ? AuditService.extractUserAgent(req) : undefined
      });

      logger.error(`Registration error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async login(data: {
    email: string;
    password: string;
  }, req?: Request): Promise<{ user: any; token: string }> {
    try {
      const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password');

      if (!user) {
        logger.warn(`Login attempt with non-existent email: ${data.email}`);
        AuditService.logAuthEvent({
          action: 'login',
          email: data.email.toLowerCase(),
          status: 'failed',
          failureReason: 'Invalid email or password',
          ip: req ? AuditService.extractIp(req) : undefined,
          userAgent: req ? AuditService.extractUserAgent(req) : undefined
        });
        const err = new Error('Invalid email or password');
        (err as any).statusCode = 401;
        throw err;
      }

      const isPasswordValid = await user.comparePassword(data.password);
      if (!isPasswordValid) {
        logger.warn(`Login attempt with invalid password for user: ${data.email}`);
        AuditService.logAuthEvent({
          action: 'login',
          userId: user._id.toString(),
          email: user.email,
          role: user.role,
          status: 'failed',
          failureReason: 'Invalid email or password',
          ip: req ? AuditService.extractIp(req) : undefined,
          userAgent: req ? AuditService.extractUserAgent(req) : undefined
        });
        const err = new Error('Invalid email or password');
        (err as any).statusCode = 401;
        throw err;
      }

      if (!user.isActive) {
        logger.warn(`Login attempt for deactivated user: ${data.email}`);
        AuditService.logAuthEvent({
          action: 'login',
          userId: user._id.toString(),
          email: user.email,
          role: user.role,
          status: 'failed',
          failureReason: 'Account is deactivated',
          ip: req ? AuditService.extractIp(req) : undefined,
          userAgent: req ? AuditService.extractUserAgent(req) : undefined
        });
        const err = new Error('Account is deactivated');
        (err as any).statusCode = 401;
        throw err;
      }

      user.lastLogin = new Date();
      await user.save();

      const token = this.generateToken(user);

      AuditService.logAuthEvent({
        action: 'login',
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        status: 'success',
        ip: req ? AuditService.extractIp(req) : undefined,
        userAgent: req ? AuditService.extractUserAgent(req) : undefined
      });

      logger.info(`User logged in successfully: ${user.email}`);
      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      logger.error(`Login error: ${(error as Error).message}`);
      throw error;
    }
  }

  static generateToken(user: any): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, config.jwt.secret as jwt.Secret, {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn']
    });
  }

  static generateRefreshToken(user: any): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, config.jwt.refreshSecret as jwt.Secret, {
      expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn']
    });
  }

  static async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as TokenPayload;
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        logger.warn(`Refresh token attempt for invalid/inactive user: ${decoded.userId}`);
        throw new Error('Invalid refresh token');
      }

      const token = this.generateToken(user);
      logger.info(`Token refreshed for user: ${user.email}`);
      return { token };
    } catch (error) {
      logger.error(`Refresh token error: ${(error as Error).message}`);
      throw new Error('Invalid or expired refresh token');
    }
  }

  static async verifyEmail(token: string): Promise<void> {
    try {
      const user = await User.findOne({ emailVerificationToken: token });

      if (!user) {
        logger.warn(`Email verification attempt with invalid token: ${token}`);
        throw new Error('Invalid verification token');
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      await user.save();

      logger.info(`Email verified for user: ${user.email}`);
    } catch (error) {
      logger.error(`Email verification error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async forgotPassword(email: string): Promise<void> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        logger.warn(`Password reset request for non-existent email: ${email}`);
        return;
      }

      const resetToken = generatePasswordResetToken();
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 3600000);
      await user.save();

      logger.info(`Password reset token generated for user: ${user.email}`);
    } catch (error) {
      logger.error(`Forgot password error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
      });

      if (!user) {
        logger.warn(`Password reset attempt with invalid/expired token`);
        throw new Error('Invalid or expired reset token');
      }

      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      logger.info(`Password reset successful for user: ${user.email}`);
    } catch (error) {
      logger.error(`Reset password error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getProfile(userId: string): Promise<any> {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        logger.warn(`Profile request for non-existent user: ${userId}`);
        throw new Error('User not found');
      }
      logger.debug(`Profile fetched for user: ${user.email}`);
      return user.toJSON();
    } catch (error) {
      logger.error(`Get profile error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async updateProfile(userId: string, data: {
    name?: string;
    phone?: string;
    address?: any;
    preferences?: any;
  }): Promise<any> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        logger.warn(`Profile update for non-existent user: ${userId}`);
        throw new Error('User not found');
      }

      if (data.name) user.name = data.name;
      if (data.phone) user.phone = data.phone;
      if (data.address) user.address = { ...user.address, ...data.address };
      if (data.preferences) user.preferences = { ...user.preferences, ...data.preferences };

      await user.save();

      logger.info(`Profile updated for user: ${user.email}`);
      return user.toJSON();
    } catch (error) {
      logger.error(`Update profile error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await User.findById(userId).select('+password');

      if (!user) {
        logger.warn(`Password change for non-existent user: ${userId}`);
        throw new Error('User not found');
      }

      logger.debug(`Password change: user ${user.email}, password field exists: ${!!(user as any).password}, isModified on fetch: ${user.isModified('password')}`);

      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        logger.warn(`Password change with invalid current password for user: ${user.email}`);
        const err = new Error('Current password is incorrect');
        (err as any).statusCode = 400;
        throw err;
      }

      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);
    } catch (error) {
      logger.error(`Change password error: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default AuthService;
