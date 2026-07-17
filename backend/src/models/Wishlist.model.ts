import mongoose, { Schema, Document, Model } from 'mongoose';
import { IWishlist } from '../types/auth.types';

export interface IWishlistDocument extends IWishlist, Document {}

const wishlistProductSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const wishlistSchema = new Schema<IWishlistDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    products: {
      type: [wishlistProductSchema],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

wishlistSchema.index({ 'products.product': 1 });

export const Wishlist: Model<IWishlistDocument> = mongoose.model<IWishlistDocument>('Wishlist', wishlistSchema);
export default Wishlist;
