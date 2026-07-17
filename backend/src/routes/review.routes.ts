import { Router } from 'express';
import reviewController, { reviewValidators } from '../controllers/review.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import { validate, validateId } from '../middleware/validation.middleware';

const router = Router();

router.get('/', reviewController.getAllReviews);
router.get('/product/:productId', validateId, reviewController.getReviewsByProduct);

router.use(authenticate);

router.post('/', ...reviewValidators.create, validate, reviewController.createReview);
router.put('/:id', validateId, validate, reviewController.updateReview);
router.delete('/:id', validateId, reviewController.deleteReview);

router.use(authenticate, adminOnly);
router.patch('/:id/approve', validateId, reviewController.approveReview);

export default router;
