import { Router } from 'express';
import categoryController, { categoryValidators } from '../controllers/category.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import { validate, validateId } from '../middleware/validation.middleware';

const router = Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', validateId, categoryController.getCategoryById);

router.use(authenticate, adminOnly);
router.post('/', ...categoryValidators.create, validate, categoryController.createCategory);
router.put('/:id', validateId, ...categoryValidators.update, validate, categoryController.updateCategory);
router.delete('/:id', validateId, categoryController.deleteCategory);

export default router;
