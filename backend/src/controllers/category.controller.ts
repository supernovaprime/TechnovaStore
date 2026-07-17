import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { Category, Product } from '../models';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

const categoryController = {
  getAllCategories: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await Category.find({ isActive: true }).sort({ order: 1 }).lean();
      logger.debug(`Fetched ${categories.length} categories`);
      ApiResponse.success(res, categories, 'Categories fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getCategoryById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await Category.findById(req.params.id).lean();
      if (!category) {
        ApiResponse.error(res, 'Category not found', 404);
        return;
      }
      logger.debug(`Category fetched: ${category.name}`);
      ApiResponse.success(res, category, 'Category fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  createCategory: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await Category.create(req.body);
      logger.info(`Category created: ${category.name}`);
      ApiResponse.success(res, category, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  updateCategory: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!category) {
        ApiResponse.error(res, 'Category not found', 404);
        return;
      }
      logger.info(`Category updated: ${category.name}`);
      ApiResponse.success(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  },

  deleteCategory: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        ApiResponse.error(res, 'Category not found', 404);
        return;
      }

      const productsCount = await Product.countDocuments({ category: category._id });
      if (productsCount > 0) {
        ApiResponse.error(res, 'Cannot delete category with associated products', 400);
        return;
      }

      await category.deleteOne();
      logger.info(`Category deleted: ${category.name}`);
      ApiResponse.success(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

export const categoryValidators = {
  create: [body('name').notEmpty().withMessage('Name is required'), body('icon').notEmpty().withMessage('Icon is required')],
  update: [body('name').optional().notEmpty().withMessage('Name cannot be empty'), body('icon').optional().notEmpty().withMessage('Icon cannot be empty')]
};

export default categoryController;
