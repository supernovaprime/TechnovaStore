import { Router } from 'express';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const router = Router();

router.get('/health', async (_req: any, res) => {
  try {
    const db = mongoose.connection.db;
    const health = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development'
    };

    if (mongoose.connection.readyState === 1 && db) {
      await db.admin().ping();
      res.status(200).json(health);
    } else {
      res.status(503).json({ ...health, message: 'Database connection failed' });
    }
  } catch (error) {
    logger.error(`Health check failed: ${(error as Error).message}`);
    res.status(503).json({
      uptime: process.uptime(),
      message: 'Health check failed',
      timestamp: Date.now(),
      error: (error as Error).message
    });
  }
});

export default router;
