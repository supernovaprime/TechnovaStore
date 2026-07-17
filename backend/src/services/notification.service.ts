import { Notification } from '../models';
import { logger } from '../utils/logger';
import { getPaginationParams } from '../utils/pagination';

export class NotificationService {
  static async getNotifications(userId: string, filters: any = {}) {
    try {
      const { page, limit, skip } = getPaginationParams(filters);
      const query: any = { user: userId };

      if (filters.isRead !== undefined) {
        query.isRead = filters.isRead;
      }

      if (filters.type) {
        query.type = filters.type;
      }

      const [notifications, total] = await Promise.all([
        Notification.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Notification.countDocuments(query)
      ]);

      logger.debug(`Fetched ${notifications.length} notifications for user: ${userId}`);
      return { notifications, total, page, limit };
    } catch (error) {
      logger.error(`Get notifications error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async createNotification(data: {
    user: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    try {
      const notification = await Notification.create(data);
      logger.info(`Notification created for user: ${data.user}, type: ${data.type}`);
      return notification;
    } catch (error) {
      logger.error(`Create notification error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async markAsRead(id: string, userId: string) {
    try {
      const notification = await Notification.findOne({ _id: id, user: userId });
      if (!notification) {
        logger.warn(`Notification not found: ${id}`);
        throw new Error('Notification not found');
      }

      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();

      logger.info(`Notification marked as read: ${id}`);
      return notification;
    } catch (error) {
      logger.error(`Mark notification as read error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async markAllAsRead(userId: string) {
    try {
      await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      logger.info(`All notifications marked as read for user: ${userId}`);
    } catch (error) {
      logger.error(`Mark all notifications as read error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async deleteNotification(id: string, userId: string) {
    try {
      const notification = await Notification.findOne({ _id: id, user: userId });
      if (!notification) {
        logger.warn(`Delete failed - notification not found: ${id}`);
        throw new Error('Notification not found');
      }

      await notification.deleteOne();
      logger.info(`Notification deleted: ${id}`);
      return notification;
    } catch (error) {
      logger.error(`Delete notification error: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default NotificationService;
