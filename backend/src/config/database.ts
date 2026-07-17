import mongoose from 'mongoose';
import { config } from './index';
import { logger } from '../utils/logger';

const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Drop stale indexes that aren't in the schema
    try {
      const db = conn.connection.db
      if (db) {
        await db.collection('products').dropIndex('productId_1');
        logger.info('Dropped stale productId_1 index from products collection');
      }
    } catch {
      // index doesn't exist — no action needed
    }

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to application termination');
      process.exit(0);
    });
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

export default connectDatabase;
