import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from 'slugify';
import { IBrand } from '../types/auth.types';

export interface IBrandDocument extends IBrand, Document {}

const brandSchema = new Schema<IBrandDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    logo: {
      type: String
    },
    description: {
      type: String
    },
    website: {
      type: String
    },
    country: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

brandSchema.index({ isActive: 1 });
brandSchema.index({ featured: 1 });

brandSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Brand: Model<IBrandDocument> = mongoose.model<IBrandDocument>('Brand', brandSchema);
export default Brand;
