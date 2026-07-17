import mongoose, { Schema, Document } from 'mongoose';
import { IMessage } from '../types/auth.types';

export interface IMessageDocument extends IMessage, Document {}

const messageSchema = new Schema<IMessageDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters']
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'closed'],
      default: 'unread'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    category: {
      type: String,
      enum: ['general', 'order', 'product', 'technical', 'billing'],
      default: 'general'
    },
    reply: {
      content: { type: String },
      repliedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      repliedAt: { type: Date }
    },
    attachments: [
      {
        type: String
      }
    ],
    metadata: {
      ip: { type: String },
      userAgent: { type: String },
      referrer: { type: String }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

messageSchema.index({ status: 1 });
messageSchema.index({ priority: 1 });
messageSchema.index({ category: 1 });
messageSchema.index({ user: 1 });
messageSchema.index({ email: 1 });
messageSchema.index({ createdAt: -1 });

export const Message = mongoose.model<IMessageDocument>('Message', messageSchema);
export default Message;
