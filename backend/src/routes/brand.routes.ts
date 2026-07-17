import { Router } from 'express';
import brandController, { brandValidators } from '../controllers/brand.controller';
import { authenticate, managerOrAdmin } from '../middleware/auth.middleware';
import { validate, validateId } from '../middleware/validation.middleware';

const router = Router();

router.get('/', brandController.getAllBrands);
router.get('/:id', validateId, brandController.getBrandById);

router.use(authenticate, managerOrAdmin);
router.post('/', ...brandValidators.create, validate, brandController.createBrand);
router.put('/:id', validateId, ...brandValidators.update, validate, brandController.updateBrand);
router.delete('/:id', validateId, brandController.deleteBrand);

export default router;
