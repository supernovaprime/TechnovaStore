import { Router } from 'express';
import uploadController from '../controllers/upload.controller';

const router = Router();

router.post('/image', uploadController.uploadImage);
router.post('/images', uploadController.uploadMultipleImages);
router.delete('/:publicId', uploadController.deleteImage);

export default router;
