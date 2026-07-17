import { Discount } from '../models';
import { logger } from '../utils/logger';

export class DiscountService {
  static async getAllDiscounts() {
    try {
      const discounts = await Discount.find().sort({ createdAt: -1 }).lean();
      logger.debug(`Fetched ${discounts.length} discounts`);
      return discounts;
    } catch (error) {
      logger.error(`Get discounts error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getDiscountByCode(code: string) {
    try {
      const discount = await Discount.findOne({ code: code.toUpperCase() }).lean();
      if (!discount) {
        logger.warn(`Discount not found: ${code}`);
        throw new Error('Discount not found');
      }
      return discount;
    } catch (error) {
      logger.error(`Get discount error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async createDiscount(data: any) {
    try {
      const discount = await Discount.create(data);
      logger.info(`Discount created: ${discount.code}`);
      return discount;
    } catch (error) {
      logger.error(`Create discount error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async updateDiscount(id: string, data: any) {
    try {
      const discount = await Discount.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!discount) {
        logger.warn(`Update failed - discount not found: ${id}`);
        throw new Error('Discount not found');
      }
      logger.info(`Discount updated: ${discount.code}`);
      return discount;
    } catch (error) {
      logger.error(`Update discount error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async deleteDiscount(id: string) {
    try {
      const discount = await Discount.findById(id);
      if (!discount) {
        logger.warn(`Delete failed - discount not found: ${id}`);
        throw new Error('Discount not found');
      }
      await discount.deleteOne();
      logger.info(`Discount deleted: ${discount.code}`);
      return discount;
    } catch (error) {
      logger.error(`Delete discount error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async validateDiscount(code: string, subtotal: number) {
    try {
      const discount = await Discount.findOne({
        code: code.toUpperCase(),
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      });

      if (!discount) {
        logger.warn(`Invalid discount code: ${code}`);
        throw new Error('Invalid or expired discount code');
      }

      if (discount.usedCount >= discount.usageLimit) {
        logger.warn(`Discount code usage limit exceeded: ${code}`);
        throw new Error('Discount code usage limit exceeded');
      }

      if (subtotal < discount.minimumPurchase) {
        logger.warn(`Minimum purchase not met for discount: ${code}`);
        throw new Error(`Minimum purchase of $${discount.minimumPurchase} required`);
      }

      let discountAmount = 0;
      if (discount.type === 'percentage') {
        discountAmount = (subtotal * discount.value) / 100;
        if (discount.maximumDiscount) {
          discountAmount = Math.min(discountAmount, discount.maximumDiscount);
        }
      } else if (discount.type === 'fixed') {
        discountAmount = discount.value;
      }

      logger.info(`Discount validated: ${code}, amount: ${discountAmount}`);
      return {
        valid: true,
        discount,
        discountAmount,
        finalTotal: subtotal - discountAmount
      };
    } catch (error) {
      logger.error(`Validate discount error: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default DiscountService;
