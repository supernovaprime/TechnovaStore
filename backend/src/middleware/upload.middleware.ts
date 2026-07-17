import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'technova',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  } as any
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      logger.warn(`Invalid file type uploaded: ${file.mimetype}`);
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 5);

export const handleUploadError = (err: any, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    logger.error(`Multer error: ${err.message}`);
    if (err.code === 'LIMIT_FILE_SIZE') {
      ApiResponse.error(res, 'File too large. Maximum size is 5MB.', 400);
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      ApiResponse.error(res, 'Too many files. Maximum is 5 files.', 400);
      return;
    }
    ApiResponse.error(res, err.message, 400);
    return;
  }

  if (err) {
    logger.error(`Upload error: ${err.message}`);
    ApiResponse.error(res, err.message || 'File upload failed', 400);
    return;
  }

  next();
};

export default { upload, uploadSingle, uploadMultiple, handleUploadError };
