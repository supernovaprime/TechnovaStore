import { Response } from 'express';
import { logger } from './logger';

export class ApiResponse {
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: any = {
      success: true,
      message
    };
    if (data !== undefined) {
      response.data = data;
    }
    logger.debug(`API Response: ${statusCode} ${message}`);
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors: any = null
  ): Response {
    const response: any = {
      success: false,
      error: message
    };
    if (errors) {
      response.errors = errors;
    }
    logger.error(`API Error: ${statusCode} ${message}`);
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
    message: string = 'Success'
  ): Response {
    logger.debug(
      `API Paginated Response: page ${pagination.page}, total ${pagination.total}`
    );
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: Math.ceil(pagination.total / pagination.limit)
      }
    });
  }
}

export default ApiResponse;
