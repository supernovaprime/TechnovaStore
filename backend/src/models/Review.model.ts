import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '../types/auth.types';

export interface IReviewDocument extends IReview, Document {}

const reviewSchema = new Schema<IReviewDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [5, 'Title must be at least 5 characters']
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: [20, 'Comment must be at least 20 characters']
    },
    images: [
      {
        type: String
      }
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0
    },
    helpfulUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    response: {
      content: { type: String },
      respondedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      respondedAt: { type: Date }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ createdAt: -1 });

export const Review = mongoose.model<IReviewDocument>('Review', reviewSchema);
export default Review;
