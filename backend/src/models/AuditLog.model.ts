import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types/auth.types';

export interface IAuditLog extends Document {
  action: 'login' | 'register' | 'logout' | 'password_change' | 'profile_update' | 'admin_action';
  user?: mongoose.Types.ObjectId;
  email?: string;
  role?: UserRole;
  ip?: string;
  userAgent?: string;
  status: 'success' | 'failed';
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface IAuditLogDocument extends IAuditLog {}

const auditLogSchema = new Schema<IAuditLogDocument>({
  action: {
    type: String,
    required: true,
    enum: ['login', 'register', 'logout', 'password_change', 'profile_update', 'admin_action']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole)
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'failed']
  },
  failureReason: {
    type: String
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ email: 1 });
auditLogSchema.index({ role: 1 });
auditLogSchema.index({ status: 1 });

export const AuditLog = mongoose.model<IAuditLogDocument>('AuditLog', auditLogSchema);
export default AuditLog;
