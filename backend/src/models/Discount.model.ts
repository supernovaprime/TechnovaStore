import mongoose, { Schema, Document } from 'mongoose';
import { IDiscount } from '../types/auth.types';

export interface IDiscountDocument extends IDiscount, Document {}

const discountSchema = new Schema<IDiscountDocument>(
  {
    code: {
      type: String,
      required: [true, 'Code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'free_shipping'],
      required: true
    },
    value: {
      type: Number,
      required: [true, 'Value is required'],
      min: [0, 'Value cannot be negative']
    },
    minimumPurchase: {
      type: Number,
      default: 0,
      min: [0, 'Minimum purchase cannot be negative']
    },
    maximumDiscount: {
      type: Number,
      min: [0, 'Maximum discount cannot be negative']
    },
    usageLimit: {
      type: Number,
      required: true,
      min: [1, 'Usage limit must be at least 1']
    },
    usedCount: {
      type: Number,
      default: 0
    },
    userLimit: {
      type: Number,
      default: 1,
      min: [1, 'User limit must be at least 1']
    },
    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    applicableCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

discountSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

discountSchema.pre('save', function (next) {
  if (this.isModified('code')) {
    this.code = this.code.toUpperCase();
  }
  next();
});

export const Discount = mongoose.model<IDiscountDocument>('Discount', discountSchema);
export default Discount;
