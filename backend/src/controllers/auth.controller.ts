import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

const authController = {
  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;

      const result = await AuthService.register({
        name,
        email,
        password,
        role
      }, req);

      ApiResponse.success(res, result, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login({
        email,
        password
      }, req);

      ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        ApiResponse.error(res, 'Refresh token is required', 400);
        return;
      }

      const result = await AuthService.refreshToken(refreshToken);
      ApiResponse.success(res, result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  },

  logout: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      ApiResponse.success(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  },

  verifyEmail: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params;

      await AuthService.verifyEmail(token);
      ApiResponse.success(res, null, 'Email verified successfully');
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      await AuthService.forgotPassword(email);
      ApiResponse.success(res, null, 'Password reset email sent if account exists');
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, password } = req.body;

      await AuthService.resetPassword(token, password);
      ApiResponse.success(res, null, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await AuthService.getProfile(req.user!._id);
      ApiResponse.success(res, user, 'Profile fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, phone, address, preferences } = req.body;

      const user = await AuthService.updateProfile(req.user!._id, {
        name,
        phone,
        address,
        preferences
      });

      ApiResponse.success(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;

      await AuthService.changePassword(req.user!._id, currentPassword, newPassword);
      ApiResponse.success(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }
};

export const authValidators = {
  register: [body('name').notEmpty().withMessage('Name is required'), body('email').isEmail().withMessage('Valid email is required'), body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')],
  login: [body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty().withMessage('Password is required')],
  forgotPassword: [body('email').isEmail().withMessage('Valid email is required')],
  resetPassword: [body('token').notEmpty().withMessage('Token is required'), body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')],
  changePassword: [body('currentPassword').notEmpty().withMessage('Current password is required'), body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')]
};

export default authController;
