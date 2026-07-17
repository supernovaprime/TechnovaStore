import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service';
import { ApiResponse } from '../utils/apiResponse';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/upload.middleware';

const uploadController = {
  uploadImage: [
    uploadSingle,
    handleUploadError,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.file) {
          ApiResponse.error(res, 'No file uploaded', 400);
          return;
        }

        const result = await UploadService.uploadImage(req.file.path);
        ApiResponse.success(res, result, 'Image uploaded successfully', 201);
      } catch (error) {
        next(error);
      }
    }
  ],

  uploadMultipleImages: [
    uploadMultiple,
    handleUploadError,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
          ApiResponse.error(res, 'No files uploaded', 400);
          return;
        }

        const filePaths = req.files.map((file: any) => file.path);
        const results = await UploadService.uploadMultipleImages(filePaths);
        ApiResponse.success(res, results, 'Images uploaded successfully', 201);
      } catch (error) {
        next(error);
      }
    }
  ],

  deleteImage: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { publicId } = req.params;
      await UploadService.deleteImage(publicId);
      ApiResponse.success(res, null, 'Image deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

export default uploadController;
