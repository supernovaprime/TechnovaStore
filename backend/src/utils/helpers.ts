import { logger } from './logger';

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TN-${timestamp}-${random}`;
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const generateEmailVerificationToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const generatePasswordResetToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const calculateOrderTotal = (
  subtotal: number,
  shippingCost: number,
  tax: number,
  discount: number
): number => {
  return Math.max(0, subtotal + shippingCost + tax - discount);
};

export const sanitizeObject = (obj: any, fieldsToRemove: string[] = ['password']): any => {
  const sanitized = { ...obj };
  fieldsToRemove.forEach((field) => {
    delete sanitized[field];
  });
  return sanitized;
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const buildSearchQuery = (searchQuery: string, fields: string[]) => {
  const searchRegex = new RegExp(searchQuery, 'i');
  return {
    $or: fields.map((field) => ({ [field]: searchRegex }))
  };
};

export const sendSuccessResponse = (message: string, data?: any) => {
  logger.info(`Success: ${message}`);
  return {
    success: true,
    message,
    data
  };
};

export const sendErrorResponse = (message: string, statusCode: number = 500) => {
  logger.error(`Error: ${message}`);
  return {
    success: false,
    error: message,
    statusCode
  };
};
