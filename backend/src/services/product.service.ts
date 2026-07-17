import { Product } from '../models';
import { logger } from '../utils/logger';
import { buildSortQuery, getPaginationParams } from '../utils/pagination';
import { STOCK_STATUS } from '../utils/constants';

export class ProductService {
  static async getProducts(filters: any = {}) {
    try {
      const { page, limit, skip } = getPaginationParams(filters);
      const query: any = { isActive: true };

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.brand) {
        query.brand = filters.brand;
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
      }

      if (filters.stockStatus) {
        query.stockStatus = filters.stockStatus;
      }

      if (filters.isFeatured !== undefined) {
        query.isFeatured = filters.isFeatured;
      }

      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      const sort = buildSortQuery(filters.sortBy || 'createdAt', filters.sortOrder || 'desc') as any;

      const [products, total] = await Promise.all([
        Product.find(query)
          .populate('brand', 'name slug logo')
          .populate('category', 'name slug')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(query)
      ]);

      logger.debug(`Fetched ${products.length} products (total: ${total})`);
      return { products, total, page, limit };
    } catch (error) {
      logger.error(`Get products error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getProductById(id: string) {
    try {
      const product = await Product.findById(id)
        .populate('brand', 'name slug logo description website')
        .populate('category', 'name slug icon')
        .lean();

      if (!product) {
        logger.warn(`Product not found: ${id}`);
        throw new Error('Product not found');
      }

      await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });

      logger.debug(`Product fetched: ${product.name}`);
      return product;
    } catch (error) {
      logger.error(`Get product error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getProductBySlug(slug: string) {
    try {
      const product = await Product.findOne({ slug })
        .populate('brand', 'name slug logo')
        .populate('category', 'name slug')
        .lean();

      if (!product) {
        logger.warn(`Product not found by slug: ${slug}`);
        throw new Error('Product not found');
      }

      await Product.findOneAndUpdate({ slug }, { $inc: { views: 1 } });

      logger.debug(`Product fetched by slug: ${product.name}`);
      return product;
    } catch (error) {
      logger.error(`Get product by slug error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getFeaturedProducts(limit: number = 10) {
    try {
      const products = await Product.find({ isFeatured: true, isActive: true })
        .populate('brand', 'name slug logo')
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      logger.debug(`Fetched ${products.length} featured products`);
      return products;
    } catch (error) {
      logger.error(`Get featured products error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async searchProducts(query: string, limit: number = 20) {
    try {
      const products = await Product.find({ $text: { $search: query }, isActive: true })
        .populate('brand', 'name slug logo')
        .populate('category', 'name slug')
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .lean();

      logger.debug(`Search returned ${products.length} products for query: ${query}`);
      return products;
    } catch (error) {
      logger.error(`Search products error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async createProduct(data: any) {
    try {
      const product = await Product.create(data);
      logger.info(`Product created: ${product.name}`);
      return product;
    } catch (error) {
      logger.error(`Create product error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async updateProduct(id: string, data: any) {
    try {
      const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!product) {
        logger.warn(`Update failed - product not found: ${id}`);
        throw new Error('Product not found');
      }
      logger.info(`Product updated: ${product.name}`);
      return product;
    } catch (error) {
      logger.error(`Update product error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async deleteProduct(id: string) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        logger.warn(`Delete failed - product not found: ${id}`);
        throw new Error('Product not found');
      }
      await product.deleteOne();
      logger.info(`Product deleted: ${product.name}`);
      return product;
    } catch (error) {
      logger.error(`Delete product error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async updateStock(id: string, quantity: number) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        logger.warn(`Stock update failed - product not found: ${id}`);
        throw new Error('Product not found');
      }

      product.stockQuantity = Math.max(0, product.stockQuantity + quantity);

      if (product.stockQuantity === 0) {
        product.stockStatus = STOCK_STATUS.OUT_OF_STOCK;
      } else if (product.stockQuantity < 10) {
        product.stockStatus = STOCK_STATUS.LOW_STOCK;
      } else {
        product.stockStatus = STOCK_STATUS.IN_STOCK;
      }

      await product.save();
      logger.info(`Stock updated for product ${id}: ${product.stockQuantity}`);
      return product;
    } catch (error) {
      logger.error(`Update stock error: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default ProductService;
