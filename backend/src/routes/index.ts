import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';
import reviewRoutes from './review.routes';
import messageRoutes from './message.routes';
import uploadRoutes from './upload.routes';
import analyticsRoutes from './analytics.routes';
import healthRoutes from './health.routes';
import cartRoutes from './cart.routes';
import wishlistRoutes from './wishlist.routes';
import discountRoutes from './discount.routes';
import notificationRoutes from './notification.routes';
import auditRoutes from './audit.routes';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { configureSecurity } from '../middleware/security.middleware';
import { notFound, errorHandler } from '../utils/filters';
import { logger } from '../utils/logger';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/reviews', reviewRoutes);
router.use('/messages', messageRoutes);
router.use('/upload', uploadRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/health', healthRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/discounts', discountRoutes);
router.use('/notifications', notificationRoutes);
router.use('/audit', auditRoutes);

router.use(notFound);
router.use(errorHandler);

export const setupRoutes = (app: any): void => {
  logger.info('Configuring security middleware');
  configureSecurity(app);

  logger.info('Configuring request size limits');
  app.use(generalLimiter);

  logger.info('Registering API routes');
  app.use('/api/v1', router);

  logger.info('All routes registered successfully');
};

export default router;
