import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { ProductService } from '../services/product.service';
import { UploadService } from '../services/upload.service';
import { ApiResponse } from '../utils/apiResponse';
import { uploadMultiple, handleUploadError } from '../middleware/upload.middleware';

const productController = {
  getAllProducts: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { products, total, page, limit } = await ProductService.getProducts(req.query);
      ApiResponse.paginated(res, products, { page: Number(page), limit: Number(limit), total }, 'Products fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getProductById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await ProductService.getProductById(req.params.id);
      ApiResponse.success(res, product, 'Product fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getProductBySlug: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await ProductService.getProductBySlug(req.params.slug);
      ApiResponse.success(res, product, 'Product fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getFeaturedProducts: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const products = await ProductService.getFeaturedProducts(limit);
      ApiResponse.success(res, products, 'Featured products fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  searchProducts: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { q, limit } = req.query;
      if (!q) {
        ApiResponse.error(res, 'Search query is required', 400);
        return;
      }

      const products = await ProductService.searchProducts(q as string, parseInt(limit as string) || 20);
      ApiResponse.success(res, products, 'Search results fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  createProduct: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await ProductService.createProduct(req.body);
      ApiResponse.success(res, product, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      ApiResponse.success(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await ProductService.deleteProduct(req.params.id);
      ApiResponse.success(res, product, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  updateStock: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { quantity } = req.body;
      const product = await ProductService.updateStock(req.params.id, quantity);
      ApiResponse.success(res, product, 'Stock updated successfully');
    } catch (error) {
      next(error);
    }
  },

  uploadImages: [
    uploadMultiple,
    handleUploadError,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.files || !Array.isArray(req.files)) {
          ApiResponse.error(res, 'No files uploaded', 400);
          return;
        }

        const uploadPromises = req.files.map((file: any) =>
          UploadService.uploadImage(file.path)
        );

        const results = await Promise.all(uploadPromises);
        ApiResponse.success(res, results, 'Images uploaded successfully', 201);
      } catch (error) {
        next(error);
      }
    }
  ]
};

export const productValidators = {
  create: [body('name').notEmpty().withMessage('Name is required'), body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'), body('brand').notEmpty().withMessage('Brand is required'), body('category').notEmpty().withMessage('Category is required')],
  update: [body('name').optional().notEmpty().withMessage('Name cannot be empty'), body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number')],
  updateStock: [body('quantity').isInt().withMessage('Quantity must be an integer')]
};

export default productController;
