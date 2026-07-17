import { Order, Cart, Product, Discount, User } from '../models';
import { generateOrderNumber, calculateOrderTotal } from '../utils/helpers';
import { ORDER_STATUS, PAYMENT_STATUS } from '../utils/constants';
import { getPaginationParams } from '../utils/pagination';
import { logger } from '../utils/logger';

export class OrderService {
  static async createOrder(userId: string, data: {
    items: any[];
    shippingAddress: any;
    paymentMethod: string;
    billingAddress?: any;
    discountCode?: string;
    guestEmail?: string;
    paymentDetails?: any;
  }) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        logger.warn(`Order creation failed - user not found: ${userId}`);
        throw new Error('User not found');
      }

      const cart = await Cart.findOne({ user: userId });
      if (!cart || cart.items.length === 0) {
        logger.warn(`Order creation failed - cart is empty for user: ${userId}`);
        throw new Error('Cart is empty');
      }

      let subtotal = 0;
      const orderItems = [];

      for (const cartItem of cart.items) {
        const product = await Product.findById(cartItem.product);
        if (!product) {
          logger.warn(`Order creation failed - product not found: ${cartItem.product}`);
          throw new Error(`Product not found: ${cartItem.product}`);
        }

        if (product.stockQuantity < cartItem.quantity) {
          logger.warn(`Order creation failed - insufficient stock for product: ${product.name}`);
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        subtotal += cartItem.price * cartItem.quantity;

        orderItems.push({
          product: product._id,
          name: product.name,
          slug: product.slug,
          price: cartItem.price,
          quantity: cartItem.quantity,
          image: product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url || '/placeholder.png'
        });

        product.stockQuantity -= cartItem.quantity;
        product.sales += cartItem.quantity;
        await product.save();
      }

      let discount = 0;
      let appliedDiscountCode = '';

      if (data.discountCode) {
        const discountDoc = await Discount.findOne({
          code: data.discountCode.toUpperCase(),
          isActive: true,
          startDate: { $lte: new Date() },
          endDate: { $gte: new Date() }
        });

        if (discountDoc) {
          if (discountDoc.usedCount >= discountDoc.usageLimit) {
            logger.warn(`Discount code ${data.discountCode} - usage limit exceeded`);
            throw new Error('Discount code usage limit exceeded');
          }

          if (subtotal < discountDoc.minimumPurchase) {
            logger.warn(`Discount code ${data.discountCode} - minimum purchase not met`);
            throw new Error(`Minimum purchase of $${discountDoc.minimumPurchase} required for this discount`);
          }

          if (discountDoc.type === 'percentage') {
            discount = (subtotal * discountDoc.value) / 100;
            if (discountDoc.maximumDiscount) {
              discount = Math.min(discount, discountDoc.maximumDiscount);
            }
          } else if (discountDoc.type === 'fixed') {
            discount = discountDoc.value;
          }

          discountDoc.usedCount += 1;
          await discountDoc.save();
          appliedDiscountCode = discountDoc.code;
        } else {
          logger.warn(`Invalid discount code: ${data.discountCode}`);
          throw new Error('Invalid or expired discount code');
        }
      }

      const shippingCost = subtotal > 100 ? 0 : 10;
      const tax = subtotal * 0.1;
      const totalAmount = calculateOrderTotal(subtotal, shippingCost, tax, discount);

      const orderNumber = generateOrderNumber();

      const order = await Order.create({
        orderNumber,
        user: userId,
        guestEmail: data.guestEmail,
        items: orderItems,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress || data.shippingAddress,
        paymentMethod: data.paymentMethod,
        paymentDetails: data.paymentDetails || {},
        subtotal,
        shippingCost,
        tax,
        discount,
        discountCode: appliedDiscountCode,
        totalAmount,
        currency: 'USD',
        status: ORDER_STATUS.PENDING,
        paymentStatus: PAYMENT_STATUS.PENDING,
        statusHistory: [
          {
            status: ORDER_STATUS.PENDING,
            timestamp: new Date(),
            note: 'Order created'
          }
        ]
      });

      await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } }
      );

      logger.info(`Order created: ${orderNumber} for user: ${user.email}, total: $${totalAmount}`);
      return order;
    } catch (error) {
      logger.error(`Create order error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getOrderById(id: string, userId?: string, isAdmin: boolean = false) {
    try {
      const order = await Order.findById(id)
        .populate('user', 'name email')
        .populate('items.product', 'name slug images')
        .lean();

      if (!order) {
        logger.warn(`Order not found: ${id}`);
        throw new Error('Order not found');
      }

      if (!isAdmin && order.user._id.toString() !== userId) {
        logger.warn(`Unauthorized order access attempt: ${id} by user: ${userId}`);
        throw new Error('Unauthorized');
      }

      logger.debug(`Order fetched: ${order.orderNumber}`);
      return order;
    } catch (error) {
      logger.error(`Get order error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getOrders(userId?: string, isAdmin: boolean = false, filters: any = {}) {
    try {
      const query: any = {};

      if (!isAdmin && userId) {
        query.user = userId;
      }

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.paymentStatus) {
        query.paymentStatus = filters.paymentStatus;
      }

      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
        if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
      }

      const { page, limit, skip } = getPaginationParams(filters);

      const [orders, total] = await Promise.all([
        Order.find(query)
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Order.countDocuments(query)
      ]);

      logger.debug(`Fetched ${orders.length} orders (total: ${total})`);
      return { orders, total, page, limit };
    } catch (error) {
      logger.error(`Get orders error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async updateOrderStatus(id: string, status: string, note?: string, role?: string) {
    try {
      const order = await Order.findById(id);
      if (!order) {
        logger.warn(`Status update failed - order not found: ${id}`);
        throw new Error('Order not found');
      }

      const allowedTransitions: Record<string, string[]> = {
        pending: ['processing', 'cancelled'],
        processing: ['approved', 'cancelled'],
        approved: ['shipped', 'cancelled'],
        shipped: ['delivered', 'cancelled'],
        delivered: [],
        cancelled: [],
        refunded: [],
      };

      const allowed = allowedTransitions[order.status] || [];
      if (!allowed.includes(status)) {
        throw new Error(`Cannot transition from "${order.status}" to "${status}"`);
      }

      if (status === 'approved' && role !== 'admin') {
        throw new Error('Only admins can approve orders');
      }

      order.status = status as any;
      if (status === 'delivered') {
        order.paymentStatus = 'completed';
      } else if (status === 'cancelled') {
        order.paymentStatus = order.paymentStatus === 'pending' ? 'failed' : 'refunded';
      }
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status updated to ${status}`
      });
      await order.save();

      logger.info(`Order status updated: ${order.orderNumber} -> ${status}`);
      return order;
    } catch (error) {
      logger.error(`Update order status error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async cancelOrder(id: string, userId?: string, isAdmin: boolean = false) {
    try {
      const order = await Order.findById(id);
      if (!order) {
        logger.warn(`Cancel failed - order not found: ${id}`);
        throw new Error('Order not found');
      }

      if (!isAdmin && order.user._id.toString() !== userId) {
        logger.warn(`Unauthorized cancel attempt: ${id} by user: ${userId}`);
        throw new Error('Unauthorized');
      }

      if ([ORDER_STATUS.CANCELLED, ORDER_STATUS.DELIVERED].includes(order.status as any)) {
        logger.warn(`Cannot cancel order with status: ${order.status}`);
        throw new Error('Cannot cancel order in current status');
      }

      order.status = ORDER_STATUS.CANCELLED;
      order.statusHistory.push({
        status: ORDER_STATUS.CANCELLED,
        timestamp: new Date(),
        note: 'Order cancelled'
      });
      await order.save();

      logger.info(`Order cancelled: ${order.orderNumber}`);
      return order;
    } catch (error) {
      logger.error(`Cancel order error: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default OrderService;
