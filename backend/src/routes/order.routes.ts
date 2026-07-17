import { Router } from 'express';
import orderController, { orderValidators } from '../controllers/order.controller';
import { authenticate, managerOrAdmin } from '../middleware/auth.middleware';
import { validate, validateId } from '../middleware/validation.middleware';

const router = Router();

router.use(authenticate);

router.get('/', orderController.getOrders);
router.get('/:id', validateId, orderController.getOrderById);
router.post('/', ...orderValidators.create, validate, orderController.createOrder);
router.patch('/:id/cancel', validateId, orderController.cancelOrder);

router.use(authenticate, managerOrAdmin);
router.put('/:id/status', validateId, ...orderValidators.updateStatus, validate, orderController.updateOrderStatus);

export default router;
