import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/apiResponse';

const userController = {
  getAllUsers: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { users, total, page, limit } = await UserService.getUsers(req.query);
      ApiResponse.paginated(res, users, { page: Number(page), limit: Number(limit), total }, 'Users fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await UserService.getUserById(req.params.id);
      ApiResponse.success(res, user, 'User fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  updateUserRole: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { role } = req.body;
      const user = await UserService.updateUserRole(req.params.id, role);
      ApiResponse.success(res, user, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  },

  updateUserStatus: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { isActive } = req.body;
      const user = await UserService.updateUserStatus(req.params.id, isActive);
      ApiResponse.success(res, user, 'User status updated successfully');
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await UserService.deleteUser(req.params.id);
      ApiResponse.success(res, user, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

export const userValidators = {
  updateRole: [body('role').isIn(['customer', 'admin']).withMessage('Invalid role')],
  updateStatus: [body('isActive').isBoolean().withMessage('isActive must be a boolean')]
};

export default userController;
