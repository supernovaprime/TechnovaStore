import { Router } from 'express';
import userController, { userValidators } from '../controllers/user.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import { validate, validateId } from '../middleware/validation.middleware';

const router = Router();

router.use(authenticate, adminOnly);

router.get('/', userController.getAllUsers);
router.get('/:id', validateId, userController.getUserById);
router.put('/:id/role', validateId, ...userValidators.updateRole, validate, userController.updateUserRole);
router.put('/:id/status', validateId, ...userValidators.updateStatus, validate, userController.updateUserStatus);
router.delete('/:id', validateId, userController.deleteUser);

export default router;
