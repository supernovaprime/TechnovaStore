import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { ApiResponse } from '../utils/apiResponse';

const analyticsController = {
  getDashboardStats: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await AnalyticsService.getDashboardStats();
      ApiResponse.success(res, stats, 'Dashboard stats fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getSalesAnalytics: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      const salesData = await AnalyticsService.getSalesAnalytics(startDate as string, endDate as string);
      ApiResponse.success(res, salesData, 'Sales analytics fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getProductAnalytics: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const analytics = await AnalyticsService.getProductAnalytics();
      ApiResponse.success(res, analytics, 'Product analytics fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getCustomerAnalytics: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const analytics = await AnalyticsService.getCustomerAnalytics();
      ApiResponse.success(res, analytics, 'Customer analytics fetched successfully');
    } catch (error) {
      next(error);
    }
  }
};

export default analyticsController;
