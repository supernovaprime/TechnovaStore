import { User } from '../models';
import { UserRole } from '../types/auth.types';
import { logger } from '../utils/logger';
import { getPaginationParams } from '../utils/pagination';

export class UserService {
  static async getUsers(filters: any = {}) {
    try {
      const { page, limit, skip } = getPaginationParams(filters);
      const query: any = {};

      if (filters.role) {
        query.role = filters.role;
      }

      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(query)
      ]);

      logger.debug(`Fetched ${users.length} users (total: ${total})`);
      return { users, total, page, limit };
    } catch (error) {
      logger.error(`Get users error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getUserById(id: string) {
    try {
      const user = await User.findById(id).select('-password').lean();
      if (!user) {
        logger.warn(`User not found: ${id}`);
        throw new Error('User not found');
      }
      logger.debug(`User fetched: ${user.email}`);
      return user;
    } catch (error) {
      logger.error(`Get user error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getUserWithPassword(id: string) {
    try {
      const user = await User.findById(id).select('+password').lean();
      if (!user) {
        logger.warn(`User not found: ${id}`);
        throw new Error('User not found');
      }
      logger.debug(`User with password fetched: ${user.email}`);
      return user;
    } catch (error) {
      logger.error(`Get user with password error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async updateUserRole(id: string, role: string) {
    try {
      const user = await User.findById(id);
      if (!user) {
        logger.warn(`Role update failed - user not found: ${id}`);
        throw new Error('User not found');
      }

      user.role = role as UserRole;
      await user.save();

      logger.info(`User role updated: ${user.email} -> ${role}`);
      return user.toJSON();
    } catch (error) {
      logger.error(`Update user role error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async updateUserStatus(id: string, isActive: boolean) {
    try {
      const user = await User.findById(id);
      if (!user) {
        logger.warn(`Status update failed - user not found: ${id}`);
        throw new Error('User not found');
      }

      user.isActive = isActive;
      await user.save();

      logger.info(`User status updated: ${user.email} -> ${isActive ? 'active' : 'inactive'}`);
      return user.toJSON();
    } catch (error) {
      logger.error(`Update user status error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async deleteUser(id: string) {
    try {
      const user = await User.findById(id);
      if (!user) {
        logger.warn(`Delete failed - user not found: ${id}`);
        throw new Error('User not found');
      }

      await user.deleteOne();
      logger.info(`User deleted: ${user.email}`);
      return user;
    } catch (error) {
      logger.error(`Delete user error: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default UserService;
