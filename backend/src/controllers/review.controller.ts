import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { Review, Product } from '../models';
import { ApiResponse } from '../utils/apiResponse';
import { getPaginationParams } from '../utils/pagination';
import { logger } from '../utils/logger';

const reviewController = {
  getAllReviews: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const query: any = {};

      if (req.query.isApproved !== undefined) {
        query.isApproved = req.query.isApproved === 'true';
      }

      if (req.query.product) {
        query.product = req.query.product;
      }

      if (req.query.user) {
        query.user = req.query.user;
      }

      const [reviews, total] = await Promise.all([
        Review.find(query)
          .populate('user', 'name email')
          .populate('product', 'name slug')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Review.countDocuments(query)
      ]);

      ApiResponse.paginated(res, reviews, { page: Number(page), limit: Number(limit), total }, 'Reviews fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getReviewsByProduct: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.productId;
      const reviews = await Review.find({ product: productId, isApproved: true })
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .lean();

      logger.debug(`Fetched ${reviews.length} reviews for product: ${productId}`);
      ApiResponse.success(res, reviews, 'Reviews fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  createReview: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { product, rating, title, comment, order } = req.body;

      const existingReview = await Review.findOne({
        user: req.user!._id,
        product
      });

      if (existingReview) {
        logger.warn(`Review creation failed - user already reviewed product: ${product}`);
        ApiResponse.error(res, 'You have already reviewed this product', 400);
        return;
      }

      const review = await Review.create({
        user: req.user!._id,
        product,
        rating,
        title,
        comment,
        order: order || null,
        isVerifiedPurchase: !!order
      });

      const productDoc = await Product.findById(product);
      if (productDoc) {
        const totalRating = (productDoc.rating * productDoc.reviewCount) + rating;
        const newCount = productDoc.reviewCount + 1;
        await Product.findByIdAndUpdate(product, {
          $set: {
            rating: totalRating / newCount,
            reviewCount: newCount
          }
        });
      }

      logger.info(`Review created for product: ${product} by user: ${req.user!.email}`);
      ApiResponse.success(res, review, 'Review created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  updateReview: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const review = await Review.findById(req.params.id);

      if (!review) {
        ApiResponse.error(res, 'Review not found', 404);
        return;
      }

      if (review.user.toString() !== req.user!._id) {
        ApiResponse.error(res, 'Unauthorized', 403);
        return;
      }

      const updatedReview = await Review.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      logger.info(`Review updated: ${req.params.id}`);
      ApiResponse.success(res, updatedReview, 'Review updated successfully');
    } catch (error) {
      next(error);
    }
  },

  deleteReview: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const review = await Review.findById(req.params.id);

      if (!review) {
        ApiResponse.error(res, 'Review not found', 404);
        return;
      }

      const isAdmin = req.user?.role === 'admin';
      const isOwner = review.user.toString() === req.user!._id;

      if (!isAdmin && !isOwner) {
        ApiResponse.error(res, 'Unauthorized', 403);
        return;
      }

      await review.deleteOne();

      if (review.isApproved) {
        await Product.findByIdAndUpdate(review.product, { $inc: { reviewCount: -1 } });
      }

      logger.info(`Review deleted: ${req.params.id}`);
      ApiResponse.success(res, null, 'Review deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  approveReview: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const review = await Review.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
      );

      if (!review) {
        ApiResponse.error(res, 'Review not found', 404);
        return;
      }

      await Product.findByIdAndUpdate(review.product, { $inc: { reviewCount: 1 } });

      logger.info(`Review approved: ${req.params.id}`);
      ApiResponse.success(res, review, 'Review approved successfully');
    } catch (error) {
      next(error);
    }
  }
};

export const reviewValidators = {
  create: [body('product').notEmpty().withMessage('Product is required'), body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'), body('title').notEmpty().withMessage('Title is required'), body('comment').notEmpty().withMessage('Comment is required')]
};

export default reviewController;
