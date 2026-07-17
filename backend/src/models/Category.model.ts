import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from 'slugify';
import { ICategory } from '../types/auth.types';

export interface ICategoryDocument extends ICategory, Document {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    icon: {
      type: String,
      required: [true, 'Icon is required']
    },
    description: {
      type: String
    },
    image: {
      type: String
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    metadata: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

categorySchema.index({ parent: 1 });
categorySchema.index({ order: 1 });
categorySchema.index({ isActive: 1 });

categorySchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

export const Category: Model<ICategoryDocument> = mongoose.model<ICategoryDocument>('Category', categorySchema);
export default Category;
