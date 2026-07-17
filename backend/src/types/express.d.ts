import 'express';
import { UserRole, Permission } from './auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: any;
        email?: string;
        role: UserRole;
        permissions?: Permission[];
        isActive?: boolean;
      };
    }
  }
}
