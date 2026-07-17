import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { logger } from '../utils/logger';

export class UploadService {
  static async uploadImage(filePath: string, folder: string = 'technova') {
    try {
      const result = await uploadToCloudinary(filePath, folder);
      logger.info(`Image uploaded successfully: ${result.publicId}`);
      return result;
    } catch (error) {
      logger.error(`Upload image error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async uploadMultipleImages(filePaths: string[], folder: string = 'technova') {
    try {
      const uploadPromises = filePaths.map((path) => uploadToCloudinary(path, folder));
      const results = await Promise.all(uploadPromises);
      logger.info(`Multiple images uploaded successfully: ${results.length} files`);
      return results;
    } catch (error) {
      logger.error(`Upload multiple images error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async deleteImage(publicId: string) {
    try {
      await deleteFromCloudinary(publicId);
      logger.info(`Image deleted successfully: ${publicId}`);
    } catch (error) {
      logger.error(`Delete image error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async deleteMultipleImages(publicIds: string[]) {
    try {
      const deletePromises = publicIds.map((id) => deleteFromCloudinary(id));
      await Promise.all(deletePromises);
      logger.info(`Multiple images deleted successfully: ${publicIds.length} files`);
    } catch (error) {
      logger.error(`Delete multiple images error: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default UploadService;
