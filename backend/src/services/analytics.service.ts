import { Product, Order, User, AuditLog } from '../models';
import { logger } from '../utils/logger';

const safeRecentActivities = async (limit: number = 10) => {
  try {
    return await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  } catch (error) {
    logger.warn(`Failed to fetch recent activities: ${(error as Error).message}`);
    return [];
  }
};

export class AnalyticsService {
  static async getDashboardStats() {
    try {
      const [
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        recentOrders,
        lowStockProducts,
        pendingOrders,
        inventoryValue,
        recentActivities
      ] = await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments({ role: 'customer' }),
        Order.aggregate([
          { $match: { paymentStatus: 'completed' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('user', 'name email')
          .lean(),
        Product.find({ stockQuantity: { $lt: 10 }, isActive: true }).limit(5).lean(),
        Order.countDocuments({ status: 'pending' }),
        Product.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$stockQuantity'] } } } }
        ]),
        safeRecentActivities(10)
      ]);

      const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
      const inventory = inventoryValue.length > 0 ? inventoryValue[0].total : 0;

      const stats = {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: Math.round(revenue * 100) / 100,
        inventoryValue: Math.round(inventory * 100) / 100,
        recentOrders,
        lowStockProducts,
        pendingOrders,
        recentActivities
      };

      logger.debug('Dashboard stats fetched successfully');
      return stats;
    } catch (error) {
      logger.error(`Get dashboard stats error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getSalesAnalytics(startDate?: string, endDate?: string) {
    try {
      const matchStage: any = { paymentStatus: 'completed' };

      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) matchStage.createdAt.$lte = new Date(endDate);
      }

      const salesData = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            sales: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      logger.debug(`Sales analytics fetched: ${salesData.length} data points`);
      return salesData;
    } catch (error) {
      logger.error(`Get sales analytics error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getProductAnalytics() {
    try {
      const topProducts = await Product.find({ isActive: true })
        .sort({ sales: -1 })
        .limit(10)
        .select('name sales views rating')
        .lean();

      const categoryStats = await Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalSales: { $sum: '$sales' },
            avgRating: { $avg: '$rating' }
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: '$category' },
        { $sort: { totalSales: -1 } }
      ]);

      logger.debug('Product analytics fetched successfully');
      return { topProducts, categoryStats };
    } catch (error) {
      logger.error(`Get product analytics error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getCustomerAnalytics() {
    try {
      const customerStats = await User.aggregate([
        { $match: { role: 'customer' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            newCustomers: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const topCustomers = await Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        {
          $group: {
            _id: '$user',
            totalSpent: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            name: '$user.name',
            email: '$user.email',
            totalSpent: 1,
            orderCount: 1
          }
        }
      ]);

      logger.debug('Customer analytics fetched successfully');
      return { customerStats, topCustomers };
    } catch (error) {
      logger.error(`Get customer analytics error: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default AnalyticsService;
