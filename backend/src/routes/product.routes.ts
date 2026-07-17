import { Router } from 'express';
import productController, { productValidators } from '../controllers/product.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';
import { validate, validateId } from '../middleware/validation.middleware';
import { UserRole } from '../types/auth.types';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', validateId, productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);

router.use(authenticate, authorizeRole(UserRole.ADMIN));

router.post('/', ...productValidators.create, validate, productController.createProduct);
router.put('/:id', validateId, ...productValidators.update, validate, productController.updateProduct);
router.delete('/:id', validateId, productController.deleteProduct);
router.patch('/:id/stock', validateId, ...productValidators.updateStock, validate, productController.updateStock);
router.post('/upload', productController.uploadImages);

export default router;
