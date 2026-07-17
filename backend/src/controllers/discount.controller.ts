import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { DiscountService } from '../services/discount.service';
import { ApiResponse } from '../utils/apiResponse';

const discountController = {
  getAllDiscounts: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const discounts = await DiscountService.getAllDiscounts();
      ApiResponse.success(res, discounts, 'Discounts fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getDiscountByCode: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { code } = req.params;
      const discount = await DiscountService.getDiscountByCode(code);
      ApiResponse.success(res, discount, 'Discount fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  createDiscount: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const discount = await DiscountService.createDiscount(req.body);
      ApiResponse.success(res, discount, 'Discount created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  updateDiscount: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const discount = await DiscountService.updateDiscount(id, req.body);
      ApiResponse.success(res, discount, 'Discount updated successfully');
    } catch (error) {
      next(error);
    }
  },

  deleteDiscount: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const discount = await DiscountService.deleteDiscount(id);
      ApiResponse.success(res, discount, 'Discount deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  validateDiscount: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { code, subtotal } = req.body;
      const result = await DiscountService.validateDiscount(code, subtotal);
      ApiResponse.success(res, result, 'Discount validated successfully');
    } catch (error) {
      next(error);
    }
  }
};

export const discountValidators = {
  create: [body('code').notEmpty().withMessage('Code is required'), body('type').isIn(['percentage', 'fixed', 'free_shipping']).withMessage('Invalid discount type'), body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'), body('usageLimit').isInt({ min: 1 }).withMessage('Usage limit must be at least 1')],
  update: [body('code').optional().notEmpty().withMessage('Code cannot be empty'), body('type').optional().isIn(['percentage', 'fixed', 'free_shipping']).withMessage('Invalid discount type'), body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number')],
  validate: [body('code').notEmpty().withMessage('Code is required'), body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be a positive number')]
};

export default discountController;
