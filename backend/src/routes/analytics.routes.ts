import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller';
import { authenticate, managerOrAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, managerOrAdmin);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/sales', analyticsController.getSalesAnalytics);
router.get('/products', analyticsController.getProductAnalytics);
router.get('/customers', analyticsController.getCustomerAnalytics);

export default router;
