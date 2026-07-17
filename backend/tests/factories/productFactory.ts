import { Product } from '../../src/models';

export const createProduct = async (overrides = {}) => {
  const productData = {
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test description',
    brand: undefined,
    category: undefined,
    price: 100,
    stockQuantity: 10,
    stockStatus: 'In Stock',
    rating: 0,
    reviewCount: 0,
    images: [],
    features: [],
    isFeatured: false,
    isActive: true,
    views: 0,
    sales: 0,
    tags: [],
    ...overrides,
  };
  return await Product.create(productData);
};
