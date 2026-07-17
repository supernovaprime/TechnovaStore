import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, adminOnly);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/sales', analyticsController.getSalesAnalytics);
router.get('/products', analyticsController.getProductAnalytics);
router.get('/customers', analyticsController.getCustomerAnalytics);

export default router;
