import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { WishlistService } from '../services/wishlist.service';
import { ApiResponse } from '../utils/apiResponse';

const wishlistController = {
  getWishlist: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const wishlist = await WishlistService.getWishlist(req.user!._id);
      ApiResponse.success(res, wishlist, 'Wishlist fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  addToWishlist: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId } = req.body;
      const wishlist = await WishlistService.addToWishlist(req.user!._id, productId);
      ApiResponse.success(res, wishlist, 'Item added to wishlist successfully');
    } catch (error) {
      next(error);
    }
  },

  removeFromWishlist: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId } = req.params;
      const wishlist = await WishlistService.removeFromWishlist(req.user!._id, productId);
      ApiResponse.success(res, wishlist, 'Item removed from wishlist successfully');
    } catch (error) {
      next(error);
    }
  },

  clearWishlist: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const wishlist = await WishlistService.clearWishlist(req.user!._id);
      ApiResponse.success(res, wishlist, 'Wishlist cleared successfully');
    } catch (error) {
      next(error);
    }
  }
};

export const wishlistValidators = {
  addToWishlist: [body('productId').notEmpty().withMessage('Product ID is required')]
};

export default wishlistController;
