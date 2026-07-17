import { Router } from 'express';
import discountController, { discountValidators } from '../controllers/discount.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import { validate, validateId } from '../middleware/validation.middleware';

const router = Router();

router.get('/', authenticate, discountController.getAllDiscounts);
router.get('/:code', authenticate, discountController.getDiscountByCode);
router.post('/validate', authenticate, ...discountValidators.validate, validate, discountController.validateDiscount);

router.use(authenticate, adminOnly);
router.post('/', ...discountValidators.create, validate, discountController.createDiscount);
router.put('/:id', validateId, ...discountValidators.update, validate, discountController.updateDiscount);
router.delete('/:id', validateId, discountController.deleteDiscount);

export default router;
