import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '../types/auth.types';

export interface INotificationDocument extends INotification, Document {}

const notificationSchema = new Schema<INotificationDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['order', 'promotion', 'system', 'review'],
      required: true
    },
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    message: {
      type: String,
      required: [true, 'Message is required']
    },
    data: {
      orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      discountCode: { type: String }
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });

export const Notification = mongoose.model<INotificationDocument>('Notification', notificationSchema);
export default Notification;
