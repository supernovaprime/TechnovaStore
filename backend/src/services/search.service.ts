import { Product, Category, Brand } from '../models';
import { logger } from '../utils/logger';

export class SearchService {
  static async searchProducts(query: string, filters: any = {}) {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }

      const searchQuery: any = { $text: { $search: query } };

      if (filters.category) {
        searchQuery.category = filters.category;
      }

      if (filters.brand) {
        searchQuery.brand = filters.brand;
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        searchQuery.price = {};
        if (filters.minPrice !== undefined) searchQuery.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) searchQuery.price.$lte = filters.maxPrice;
      }

      const products = await Product.find(searchQuery)
        .populate('brand', 'name slug logo')
        .populate('category', 'name slug')
        .sort({ score: { $meta: 'textScore' } })
        .limit(filters.limit || 20)
        .lean();

      logger.debug(`Search returned ${products.length} products for query: ${query}`);
      return products;
    } catch (error) {
      logger.error(`Search products error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getSuggestions(query: string, limit: number = 10) {
    try {
      const suggestions = await Product.find(
        { $text: { $search: query }, isActive: true },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .select('name slug')
        .lean();

      logger.debug(`Fetched ${suggestions.length} suggestions for query: ${query}`);
      return suggestions;
    } catch (error) {
      logger.error(`Get suggestions error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getCategoriesWithProductCount() {
    try {
      const categories = await Category.find({ isActive: true })
        .populate({
          path: 'products',
          match: { isActive: true },
          options: { count: true }
        })
        .lean();

      logger.debug('Categories with product count fetched');
      return categories;
    } catch (error) {
      logger.error(`Get categories with product count error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getBrandsWithProductCount() {
    try {
      const brands = await Brand.find({ isActive: true })
        .populate({
          path: 'products',
          match: { isActive: true },
          options: { count: true }
        })
        .lean();

      logger.debug('Brands with product count fetched');
      return brands;
    } catch (error) {
      logger.error(`Get brands with product count error: ${(error as Error).message}`);
      throw error;
    }
  }

  static async getFilters() {
    try {
      const [categories, brands, priceRange] = await Promise.all([
        Category.find({ isActive: true }).select('name slug').lean(),
        Brand.find({ isActive: true }).select('name slug').lean(),
        Product.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: null,
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' }
            }
          }
        ])
      ]);

      const range = priceRange.length > 0 ? priceRange[0] : { minPrice: 0, maxPrice: 10000 };

      logger.debug('Filters fetched successfully');
      return {
        categories,
        brands,
        priceRange: {
          min: range.minPrice || 0,
          max: range.maxPrice || 10000
        }
      };
    } catch (error) {
      logger.error(`Get filters error: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default SearchService;
