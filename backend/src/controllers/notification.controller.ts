import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { ApiResponse } from '../utils/apiResponse';

const notificationController = {
  getNotifications: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { notifications, total, page, limit } = await NotificationService.getNotifications(req.user!._id, req.query);
      ApiResponse.paginated(res, notifications, { page: Number(page), limit: Number(limit), total }, 'Notifications fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  markAsRead: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notification = await NotificationService.markAsRead(req.params.id, req.user!._id);
      ApiResponse.success(res, notification, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  },

  markAllAsRead: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await NotificationService.markAllAsRead(req.user!._id);
      ApiResponse.success(res, null, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  },

  deleteNotification: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notification = await NotificationService.deleteNotification(req.params.id, req.user!._id);
      ApiResponse.success(res, notification, 'Notification deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

export default notificationController;
