import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { Brand, Product } from '../models';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

const brandController = {
  getAllBrands: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const brands = await Brand.find({ isActive: true }).sort({ order: 1 }).lean();
      logger.debug(`Fetched ${brands.length} brands`);
      ApiResponse.success(res, brands, 'Brands fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getBrandById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const brand = await Brand.findById(req.params.id).lean();
      if (!brand) {
        ApiResponse.error(res, 'Brand not found', 404);
        return;
      }
      logger.debug(`Brand fetched: ${brand.name}`);
      ApiResponse.success(res, brand, 'Brand fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  createBrand: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const brand = await Brand.create(req.body);
      logger.info(`Brand created: ${brand.name}`);
      ApiResponse.success(res, brand, 'Brand created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  updateBrand: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!brand) {
        ApiResponse.error(res, 'Brand not found', 404);
        return;
      }
      logger.info(`Brand updated: ${brand.name}`);
      ApiResponse.success(res, brand, 'Brand updated successfully');
    } catch (error) {
      next(error);
    }
  },

  deleteBrand: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) {
        ApiResponse.error(res, 'Brand not found', 404);
        return;
      }

      const productsCount = await Product.countDocuments({ brand: brand._id });
      if (productsCount > 0) {
        ApiResponse.error(res, 'Cannot delete brand with associated products', 400);
        return;
      }

      await brand.deleteOne();
      logger.info(`Brand deleted: ${brand.name}`);
      ApiResponse.success(res, null, 'Brand deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

export const brandValidators = {
  create: [body('name').notEmpty().withMessage('Name is required')],
  update: [body('name').optional().notEmpty().withMessage('Name cannot be empty')]
};

export default brandController;
