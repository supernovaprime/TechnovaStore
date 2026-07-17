import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { CartService } from '../services/cart.service';
import { ApiResponse } from '../utils/apiResponse';

const cartController = {
  getCart: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await CartService.getCart(req.user!._id);
      ApiResponse.success(res, cart, 'Cart fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  addToCart: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { product, quantity } = req.body;
      const cart = await CartService.addToCart(req.user!._id, product, quantity);
      ApiResponse.success(res, cart, 'Item added to cart successfully');
    } catch (error) {
      next(error);
    }
  },

  updateCartItem: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id: productId } = req.params;
      const { quantity } = req.body;
      const cart = await CartService.updateCartItem(req.user!._id, productId, quantity);
      ApiResponse.success(res, cart, 'Cart updated successfully');
    } catch (error) {
      next(error);
    }
  },

  removeFromCart: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id: productId } = req.params;
      const cart = await CartService.removeFromCart(req.user!._id, productId);
      ApiResponse.success(res, cart, 'Item removed from cart successfully');
    } catch (error) {
      next(error);
    }
  },

  clearCart: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await CartService.clearCart(req.user!._id);
      ApiResponse.success(res, cart, 'Cart cleared successfully');
    } catch (error) {
      next(error);
    }
  }
};

export const cartValidators = {
  addToCart: [body('product').notEmpty().withMessage('Product is required'), body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')],
  updateCartItem: [body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')]
};

export default cartController;
