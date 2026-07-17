import { Request } from 'express';
import { AuditLog } from '../models/AuditLog.model';
import { UserRole } from '../types/auth.types';

export class AuditService {
  static async logAuthEvent(data: {
    action: 'login' | 'register' | 'logout' | 'password_change' | 'profile_update';
    userId?: string;
    email?: string;
    role?: UserRole;
    ip?: string;
    userAgent?: string;
    status: 'success' | 'failed';
    failureReason?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      await AuditLog.create({
        action: data.action,
        user: data.userId,
        email: data.email,
        role: data.role,
        ip: data.ip,
        userAgent: data.userAgent,
        status: data.status,
        failureReason: data.failureReason,
        metadata: data.metadata
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  static extractIp(req: Request): string | undefined {
    return req.ip || req.socket.remoteAddress || undefined;
  }

  static extractUserAgent(req: Request): string | undefined {
    return req.get('user-agent') || undefined;
  }
}

export default AuditService;
