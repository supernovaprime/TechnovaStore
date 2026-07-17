import { Types } from 'mongoose';

export enum UserRole {
  GUEST = 'guest',
  CUSTOMER = 'customer',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

export enum Permission {
  VIEW_PRODUCTS = 'view:products',
  CREATE_ORDER = 'create:order',
  VIEW_OWN_ORDERS = 'view:own:orders',
  WRITE_REVIEW = 'write:review',
  MANAGE_PROFILE = 'manage:profile',
  MANAGE_CART = 'manage:cart',
  MANAGE_PRODUCTS = 'manage:products',
  MANAGE_ORDERS = 'manage:orders',
  MANAGE_USERS = 'manage:users',
  MANAGE_CATEGORIES = 'manage:categories',
  MANAGE_BRANDS = 'manage:brands',
  MANAGE_REVIEWS = 'manage:reviews',
  MANAGE_MESSAGES = 'manage:messages',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_SETTINGS = 'manage:settings'
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [Permission.VIEW_PRODUCTS],
  [UserRole.CUSTOMER]: [
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_ORDER,
    Permission.VIEW_OWN_ORDERS,
    Permission.WRITE_REVIEW,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_CART
  ],
  [UserRole.MANAGER]: [
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_PRODUCTS,
    Permission.MANAGE_ORDERS,
    Permission.MANAGE_CATEGORIES,
    Permission.MANAGE_BRANDS,
    Permission.MANAGE_REVIEWS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_OWN_ORDERS,
    Permission.MANAGE_PROFILE
  ],
  [UserRole.ADMIN]: [
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_ORDER,
    Permission.VIEW_OWN_ORDERS,
    Permission.WRITE_REVIEW,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_CART,
    Permission.MANAGE_PRODUCTS,
    Permission.MANAGE_ORDERS,
    Permission.MANAGE_USERS,
    Permission.MANAGE_CATEGORIES,
    Permission.MANAGE_BRANDS,
    Permission.MANAGE_REVIEWS,
    Permission.MANAGE_MESSAGES,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SETTINGS
  ]
};

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  loginHistory?: Array<{
    ip: string;
    userAgent: string;
    timestamp: Date;
    location: string;
  }>;
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
    currency: string;
  };
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  name: string;
  slug: string;
  icon: string;
  description?: string;
  image?: string;
  parent?: Types.ObjectId;
  order: number;
  isActive: boolean;
  metadata?: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IBrand {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  country?: string;
  isActive: boolean;
  featured: boolean;
  order: number;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  price: number;
  oldPrice?: number;
  discountBadge?: string;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  stockStatus: 'In Stock' | 'Out of Stock' | 'Low Stock';
  stockQuantity: number;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  specifications: {
    display?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    camera?: string;
    battery?: string;
    os?: string;
    dimensions?: string;
    weight?: string;
    color?: string[];
    connectivity?: string[];
  };
  features: string[];
  isFeatured: boolean;
  isActive: boolean;
  views: number;
  sales: number;
  tags: string[];
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  orderNumber: string;
  user: Types.ObjectId;
  guestEmail?: string;
  items: Array<{
    product: Types.ObjectId;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image: string;
    specifications?: {
      color?: string;
      storage?: string;
    };
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    fullName: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDetails?: {
    transactionId?: string;
    paymentGateway?: string;
    paidAt?: Date;
    amount?: number;
    currency?: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  discountCode?: string;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    note?: string;
    updatedBy?: Types.ObjectId;
  }>;
  tracking?: {
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
  };
  notes?: string;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  user: Types.ObjectId;
  product: Types.ObjectId;
  order?: Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpful: number;
  helpfulUsers?: Types.ObjectId[];
  response?: {
    content: string;
    respondedBy: Types.ObjectId;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  user?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'order' | 'product' | 'technical' | 'billing';
  reply?: {
    content: string;
    repliedBy: Types.ObjectId;
    repliedAt: Date;
  };
  attachments?: string[];
  metadata?: {
    ip: string;
    userAgent: string;
    referrer: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICart {
  user: Types.ObjectId;
  session?: string;
  items: Array<{
    product: Types.ObjectId;
    quantity: number;
    price: number;
    addedAt: Date;
  }>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWishlist {
  user: Types.ObjectId;
  products: Array<{
    product: Types.ObjectId;
    addedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDiscount {
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minimumPurchase: number;
  maximumDiscount?: number;
  usageLimit: number;
  usedCount: number;
  userLimit: number;
  applicableProducts?: Types.ObjectId[];
  applicableCategories?: Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  user: Types.ObjectId;
  type: 'order' | 'promotion' | 'system' | 'review';
  title: string;
  message: string;
  data?: {
    orderId?: Types.ObjectId;
    productId?: Types.ObjectId;
    discountCode?: string;
  };
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface IAuditLog {
  action: 'login' | 'register' | 'logout' | 'password_change' | 'profile_update';
  user?: Types.ObjectId;
  email?: string;
  role?: UserRole;
  ip?: string;
  userAgent?: string;
  status: 'success' | 'failed';
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}
