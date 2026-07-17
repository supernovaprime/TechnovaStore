import { UserRole, Permission } from '../types/auth.types';

export const ROLES = {
  GUEST: UserRole.GUEST,
  CUSTOMER: UserRole.CUSTOMER,
  ADMIN: UserRole.ADMIN
};

export const PERMISSIONS = {
  VIEW_PRODUCTS: Permission.VIEW_PRODUCTS,
  CREATE_ORDER: Permission.CREATE_ORDER,
  VIEW_OWN_ORDERS: Permission.VIEW_OWN_ORDERS,
  WRITE_REVIEW: Permission.WRITE_REVIEW,
  MANAGE_PROFILE: Permission.MANAGE_PROFILE,
  MANAGE_CART: Permission.MANAGE_CART,
  MANAGE_PRODUCTS: Permission.MANAGE_PRODUCTS,
  MANAGE_ORDERS: Permission.MANAGE_ORDERS,
  MANAGE_USERS: Permission.MANAGE_USERS,
  MANAGE_CATEGORIES: Permission.MANAGE_CATEGORIES,
  MANAGE_BRANDS: Permission.MANAGE_BRANDS,
  MANAGE_REVIEWS: Permission.MANAGE_REVIEWS,
  MANAGE_MESSAGES: Permission.MANAGE_MESSAGES,
  VIEW_ANALYTICS: Permission.VIEW_ANALYTICS,
  MANAGE_SETTINGS: Permission.MANAGE_SETTINGS
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  CASH_ON_DELIVERY: 'cash_on_delivery'
};

export const MESSAGE_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  REPLIED: 'replied',
  CLOSED: 'closed'
};

export const MESSAGE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const MESSAGE_CATEGORY = {
  GENERAL: 'general',
  ORDER: 'order',
  PRODUCT: 'product',
  TECHNICAL: 'technical',
  BILLING: 'billing'
};

export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PROMOTION: 'promotion',
  SYSTEM: 'system',
  REVIEW: 'review'
};

export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
  FREE_SHIPPING: 'free_shipping'
};

export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  OUT_OF_STOCK: 'Out of Stock',
  LOW_STOCK: 'Low Stock'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

export const SORT_ORDER = {
  ASC: 1,
  DESC: -1
};

export const CACHE_TTL = {
  SHORT: 300,
  MEDIUM: 1800,
  LONG: 3600,
  DAY: 86400
};
