import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { OrderService } from '../services/order.service';
import { ApiResponse } from '../utils/apiResponse';

const orderController = {
  getOrders: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const canViewAll = ['admin', 'manager'].includes(req.user?.role || '');
      const { orders, total, page, limit } = await OrderService.getOrders(
        canViewAll ? undefined : req.user!._id,
        canViewAll,
        req.query
      );
      ApiResponse.paginated(res, orders, { page: Number(page), limit: Number(limit), total }, 'Orders fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getOrderById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const canViewAll = ['admin', 'manager'].includes(req.user?.role || '');
      const order = await OrderService.getOrderById(req.params.id, req.user!._id, canViewAll);
      ApiResponse.success(res, order, 'Order fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  createOrder: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await OrderService.createOrder(req.user!._id, req.body);
      ApiResponse.success(res, order, 'Order created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  updateOrderStatus: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, note } = req.body;
      const order = await OrderService.updateOrderStatus(req.params.id, status, note, req.user?.role);
      ApiResponse.success(res, order, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  },

  cancelOrder: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const canViewAll = ['admin', 'manager'].includes(req.user?.role || '');
      const order = await OrderService.cancelOrder(req.params.id, req.user!._id, canViewAll);
      ApiResponse.success(res, order, 'Order cancelled successfully');
    } catch (error) {
      next(error);
    }
  }
};

export const orderValidators = {
  create: [body('items').isArray({ min: 1 }).withMessage('At least one item is required'), body('shippingAddress').isObject().withMessage('Shipping address is required'), body('paymentMethod').isIn(['credit_card', 'debit_card', 'paypal', 'cash_on_delivery', 'mobile_money']).withMessage('Invalid payment method')],
  updateStatus: [body('status').isIn(['pending', 'processing', 'approved', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status')]
};

export default orderController;
