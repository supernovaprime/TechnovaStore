import { Router } from 'express';
import cartController, { cartValidators } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, validateId } from '../middleware/validation.middleware';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', ...cartValidators.addToCart, validate, cartController.addToCart);
router.put('/:id', validateId, ...cartValidators.updateCartItem, validate, cartController.updateCartItem);
router.delete('/:id', validateId, cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
