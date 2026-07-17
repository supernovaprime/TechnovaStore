import { Router } from 'express';
import wishlistController, { wishlistValidators } from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, validateId } from '../middleware/validation.middleware';

const router = Router();

router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/', ...wishlistValidators.addToWishlist, validate, wishlistController.addToWishlist);
router.delete('/:productId', validateId, wishlistController.removeFromWishlist);
router.delete('/', wishlistController.clearWishlist);

export default router;
