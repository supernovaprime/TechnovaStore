import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import { logger } from '../utils/logger';

export const configureSecurity = (app: express.Application): void => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:', 'http:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      },
      frameguard: { action: 'deny' },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
    })
  );

  logger.info('Helmet security headers configured');

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
  );

  logger.info('CORS configured');

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  logger.info('Body parsers configured');
};

export const configureRequestSizeLimit = (app: express.Application): void => {
  app.use((req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSize = 10 * 1024 * 1024;

    if (contentLength > maxSize) {
      logger.warn(`Request size exceeded: ${contentLength} bytes from ${req.ip}`);
      res.status(413).json({
        success: false,
        error: 'Request entity too large'
      });
      return;
    }

    next();
  });

  logger.info('Request size limit configured (10MB)');
};

export default { configureSecurity, configureRequestSizeLimit };
