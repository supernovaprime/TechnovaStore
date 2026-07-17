import { Types } from 'mongoose';
import { Cart, Product } from '../models';
import { logger } from '../utils/logger';

export class CartService {
  static async getCart(userId: string) {
    try {
      const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price images brand slug stockQuantity stockStatus').lean();
      if (!cart) {
        const newCart = await Cart.create({ user: userId, items: [] });
        return newCart.toObject();
      }
      return cart;
    } catch (error) {
      logger.error(`Get cart error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async addToCart(userId: string, productId: string, quantity: number) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        logger.warn(`Add to cart failed - product not found: ${productId}`);
        throw new Error('Product not found');
      }

      if (product.stockQuantity < quantity) {
        logger.warn(`Add to cart failed - insufficient stock for product: ${product.name}`);
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
      }

      const existingItem = cart.items.find((item) => item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = product.price;
      } else {
        cart.items.push({
          product: new Types.ObjectId(productId),
          quantity,
          price: product.price,
          addedAt: new Date()
        });
      }

      await cart.save();
      logger.info(`Item added to cart for user: ${userId}, product: ${productId}`);
      return cart;
    } catch (error) {
      logger.error(`Add to cart error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async updateCartItem(userId: string, productId: string, quantity: number) {
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        logger.warn(`Update cart failed - cart not found for user: ${userId}`);
        throw new Error('Cart not found');
      }

      const item = cart.items.find((item) => item.product.toString() === productId);
      if (!item) {
        logger.warn(`Update cart failed - item not found: ${productId}`);
        throw new Error('Item not found in cart');
      }

      const product = await Product.findById(productId);
      if (!product || product.stockQuantity < quantity) {
        logger.warn(`Update cart failed - insufficient stock for product: ${productId}`);
        throw new Error('Insufficient stock');
      }

      item.quantity = quantity;
      item.price = product.price;
      await cart.save();

      logger.info(`Cart item updated for user: ${userId}, product: ${productId}`);
      return cart;
    } catch (error) {
      logger.error(`Update cart item error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async removeFromCart(userId: string, productId: string) {
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        logger.warn(`Remove from cart failed - cart not found for user: ${userId}`);
        throw new Error('Cart not found');
      }

      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
      await cart.save();

      logger.info(`Item removed from cart for user: ${userId}, product: ${productId}`);
      return cart;
    } catch (error) {
      logger.error(`Remove from cart error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async clearCart(userId: string) {
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        logger.warn(`Clear cart failed - cart not found for user: ${userId}`);
        throw new Error('Cart not found');
      }

      cart.items = [];
      await cart.save();

      logger.info(`Cart cleared for user: ${userId}`);
      return cart;
    } catch (error) {
      logger.error(`Clear cart error: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default CartService;
