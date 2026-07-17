import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse } from './apiResponse';
import { logger } from './logger';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
    ApiResponse.error(
      res,
      'Validation failed',
      400,
      errors.array().map((e: any) => ({
        field: e.path || e.param,
        message: e.msg
      }))
    );
    return;
  }

  next();
};

export const validateId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    logger.warn(`Invalid ID format: ${id}`);
    ApiResponse.error(res, 'Invalid ID format', 400);
    return;
  }

  next();
};

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          sanitized[key] = sanitize(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }

  next();
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error(`Error: ${err.message}`, { stack: err.stack, url: req.url, method: req.method });

  if (err.name === 'ValidationError') {
    return ApiResponse.error(res, err.message, 400);
  }

  if (err.name === 'CastError') {
    return ApiResponse.error(res, 'Invalid ID format', 400);
  }

  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    return ApiResponse.error(res, 'Resource already exists', 409);
  }

  if ((err as any).statusCode) {
    return ApiResponse.error(res, err.message, (err as any).statusCode);
  }

  return ApiResponse.error(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    500
  );
};

export const notFound = (req: Request, res: Response, _next: NextFunction): Response => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn(message);
  return ApiResponse.error(res, message, 404);
};

export default { validate, validateId, sanitizeInput, errorHandler, notFound };
