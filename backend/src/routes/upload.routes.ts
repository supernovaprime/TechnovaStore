import { Router } from 'express';
import uploadController from '../controllers/upload.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';
import { UserRole } from '../types/auth.types';

const router = Router();

router.post('/image', authenticate, authorizeRole(UserRole.MANAGER, UserRole.ADMIN), uploadController.uploadImage);
router.post('/images', authenticate, authorizeRole(UserRole.MANAGER, UserRole.ADMIN), uploadController.uploadMultipleImages);
router.delete('/:publicId', authenticate, authorizeRole(UserRole.MANAGER, UserRole.ADMIN), uploadController.deleteImage);

export default router;
