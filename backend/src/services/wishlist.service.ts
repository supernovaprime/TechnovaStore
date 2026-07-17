import { Types } from 'mongoose';
import { Wishlist } from '../models';
import { logger } from '../utils/logger';

export class WishlistService {
  static async getWishlist(userId: string) {
    try {
      const wishlist = await Wishlist.findOne({ user: userId })
        .populate('products.product', 'name slug price images')
        .lean();
      if (!wishlist) {
        const newWishlist = await Wishlist.create({ user: userId, products: [] });
        return newWishlist;
      }
      return wishlist;
    } catch (error) {
      logger.error(`Get wishlist error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async addToWishlist(userId: string, productId: string) {
    try {
      let wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, products: [] });
      }

      const exists = wishlist.products.some((p) => p.product.toString() === productId);
      if (exists) {
        logger.warn(`Product already in wishlist: ${productId}`);
        throw new Error('Product already in wishlist');
      }

      wishlist.products.push({
        product: new Types.ObjectId(productId),
        addedAt: new Date()
      });

      await wishlist.save();
      logger.info(`Item added to wishlist for user: ${userId}, product: ${productId}`);
      return wishlist;
    } catch (error) {
      logger.error(`Add to wishlist error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async removeFromWishlist(userId: string, productId: string) {
    try {
      const wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        logger.warn(`Remove from wishlist failed - wishlist not found for user: ${userId}`);
        throw new Error('Wishlist not found');
      }

      wishlist.products = wishlist.products.filter((p) => p.product.toString() !== productId);
      await wishlist.save();

      logger.info(`Item removed from wishlist for user: ${userId}, product: ${productId}`);
      return wishlist;
    } catch (error) {
      logger.error(`Remove from wishlist error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async clearWishlist(userId: string) {
    try {
      const wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        logger.warn(`Clear wishlist failed - wishlist not found for user: ${userId}`);
        throw new Error('Wishlist not found');
      }

      wishlist.products = [];
      await wishlist.save();

      logger.info(`Wishlist cleared for user: ${userId}`);
      return wishlist;
    } catch (error) {
      logger.error(`Clear wishlist error: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default WishlistService;
