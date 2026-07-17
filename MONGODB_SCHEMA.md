# TechNova Mobile Store - MongoDB Database Schema

## Database Overview

**Database Name**: `technova_store`

**MongoDB Version**: 7.0+

**Design Philosophy**: Document-oriented schema with embedded documents for performance, references for relationships, and proper indexing for query optimization.

## Collection Schema Definitions

### 1. Users Collection

**Collection Name**: `users`

**Purpose**: Store user account information including customers and administrators.

```javascript
{
  _id: ObjectId("..."),
  name: String,
  email: String,
  password: String, // bcrypt hashed
  role: String, // "customer" | "admin"
  avatar: String, // Cloudinary URL
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: Boolean,
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: Date,
    location: String
  }],
  preferences: {
    newsletter: Boolean,
    notifications: Boolean,
    language: String,
    currency: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ isActive: 1 })
db.users.createIndex({ createdAt: -1 })
```

**Validation Rules**:
- `email`: Required, unique, valid email format
- `password`: Required, min 8 characters
- `role`: Required, enum ["customer", "admin"]
- `name`: Required, min 2 characters

---

### 2. Products Collection

**Collection Name**: `products`

**Purpose**: Store product information including smartphones, tablets, and accessories.

```javascript
{
  _id: ObjectId("..."),
  name: String,
  slug: String,
  description: String,
  shortDescription: String,
  brand: ObjectId("..."), // Reference to brands collection
  category: ObjectId("..."), // Reference to categories collection
  price: Number,
  oldPrice: Number,
  discountBadge: String,
  discountPercentage: Number,
  rating: Number, // 0-5
  reviewCount: Number,
  stockStatus: String, // "In Stock" | "Out of Stock" | "Low Stock"
  stockQuantity: Number,
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  specifications: {
    display: String,
    processor: String,
    ram: String,
    storage: String,
    camera: String,
    battery: String,
    os: String,
    dimensions: String,
    weight: String,
    color: [String],
    connectivity: [String]
  },
  features: [String],
  isFeatured: Boolean,
  isActive: Boolean,
  views: Number,
  sales: Number,
  tags: [String],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ name: "text", description: "text", shortDescription: "text" })
db.products.createIndex({ brand: 1, category: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ rating: -1 })
db.products.createIndex({ isFeatured: 1, isActive: 1 })
db.products.createIndex({ stockStatus: 1 })
db.products.createIndex({ createdAt: -1 })
db.products.createIndex({ tags: 1 })
```

**Validation Rules**:
- `name`: Required, min 3 characters
- `slug`: Required, unique, URL-friendly
- `price`: Required, positive number
- `brand`: Required, valid ObjectId
- `category`: Required, valid ObjectId
- `stockQuantity`: Required, non-negative integer

---

### 3. Categories Collection

**Collection Name**: `categories`

**Purpose**: Store product categories for organization and navigation.

```javascript
{
  _id: ObjectId("..."),
  name: String,
  slug: String,
  icon: String, // Font Awesome icon class
  description: String,
  image: String, // Cloudinary URL
  parent: ObjectId("..."), // For nested categories
  order: Number,
  isActive: Boolean,
  metadata: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.categories.createIndex({ slug: 1 }, { unique: true })
db.categories.createIndex({ parent: 1 })
db.categories.createIndex({ order: 1 })
db.categories.createIndex({ isActive: 1 })
```

**Validation Rules**:
- `name`: Required, unique within parent
- `slug`: Required, unique
- `order`: Required, non-negative integer

---

### 4. Brands Collection

**Collection Name**: `brands`

**Purpose**: Store manufacturer/brand information.

```javascript
{
  _id: ObjectId("..."),
  name: String,
  slug: String,
  logo: String, // Cloudinary URL
  description: String,
  website: String,
  country: String,
  isActive: Boolean,
  featured: Boolean,
  order: Number,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.brands.createIndex({ slug: 1 }, { unique: true })
db.brands.createIndex({ name: 1 })
db.brands.createIndex({ isActive: 1 })
db.brands.createIndex({ featured: 1 })
```

**Validation Rules**:
- `name`: Required, unique
- `slug`: Required, unique

---

### 5. Orders Collection

**Collection Name**: `orders`

**Purpose**: Store customer order information and status.

```javascript
{
  _id: ObjectId("..."),
  orderNumber: String, // Unique order identifier
  user: ObjectId("..."), // Reference to users collection
  guestEmail: String, // For guest orders
  items: [{
    product: ObjectId("..."),
    name: String,
    slug: String,
    price: Number,
    quantity: Number,
    image: String,
    specifications: {
      color: String,
      storage: String
    }
  }],
  shippingAddress: {
    fullName: String,
    phone: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: {
    fullName: String,
    phone: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String, // "credit_card" | "debit_card" | "paypal" | "cash_on_delivery"
  paymentStatus: String, // "pending" | "completed" | "failed" | "refunded"
  paymentDetails: {
    transactionId: String,
    paymentGateway: String,
    paidAt: Date,
    amount: Number,
    currency: String
  },
  subtotal: Number,
  shippingCost: Number,
  tax: Number,
  discount: Number,
  discountCode: String,
  totalAmount: Number,
  currency: String,
  status: String, // "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String,
    updatedBy: ObjectId // Reference to users (admin)
  }],
  tracking: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  notes: String,
  internalNotes: String, // Admin-only notes
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.orders.createIndex({ orderNumber: 1 }, { unique: true })
db.orders.createIndex({ user: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ paymentStatus: 1 })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ "tracking.trackingNumber": 1 })
db.orders.createIndex({ guestEmail: 1 })
```

**Validation Rules**:
- `orderNumber`: Required, unique
- `user`: Required for registered users
- `items`: Required, at least one item
- `totalAmount`: Required, positive number
- `status`: Required, enum values

---

### 6. Reviews Collection

**Collection Name**: `reviews`

**Purpose**: Store product reviews and ratings from customers.

```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("..."), // Reference to users collection
  product: ObjectId("..."), // Reference to products collection
  order: ObjectId("..."), // Reference to orders (for verified purchases)
  rating: Number, // 1-5
  title: String,
  comment: String,
  images: [String], // Cloudinary URLs
  isVerifiedPurchase: Boolean,
  isApproved: Boolean,
  helpful: Number, // Number of helpful votes
  helpfulUsers: [ObjectId], // Users who marked as helpful
  response: {
    content: String,
    respondedBy: ObjectId, // Admin user
    respondedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.reviews.createIndex({ product: 1, user: 1 }, { unique: true })
db.reviews.createIndex({ product: 1 })
db.reviews.createIndex({ user: 1 })
db.reviews.createIndex({ rating: 1 })
db.reviews.createIndex({ isApproved: 1 })
db.reviews.createIndex({ createdAt: -1 })
```

**Validation Rules**:
- `user`: Required
- `product`: Required
- `rating`: Required, 1-5 integer
- `title`: Required, min 5 characters
- `comment`: Required, min 20 characters

---

### 7. Messages Collection

**Collection Name**: `messages`

**Purpose**: Store contact form submissions and customer inquiries.

```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("..."), // Optional (for logged-in users)
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String, // "unread" | "read" | "replied" | "closed"
  priority: String, // "low" | "medium" | "high" | "urgent"
  category: String, // "general" | "order" | "product" | "technical" | "billing"
  reply: {
    content: String,
    repliedBy: ObjectId, // Admin user
    repliedAt: Date
  },
  attachments: [String], // Cloudinary URLs
  metadata: {
    ip: String,
    userAgent: String,
    referrer: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.messages.createIndex({ status: 1 })
db.messages.createIndex({ priority: 1 })
db.messages.createIndex({ category: 1 })
db.messages.createIndex({ user: 1 })
db.messages.createIndex({ email: 1 })
db.messages.createIndex({ createdAt: -1 })
```

**Validation Rules**:
- `name`: Required
- `email`: Required, valid email
- `subject`: Required
- `message`: Required, min 10 characters

---

### 8. Cart Collection

**Collection Name**: `carts`

**Purpose**: Store shopping cart data for users.

```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("..."), // Reference to users collection
  session: String, // For guest carts
  items: [{
    product: ObjectId("..."),
    quantity: Number,
    price: Number, // Price at time of adding
    addedAt: Date
  }],
  expiresAt: Date, // For guest carts
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.carts.createIndex({ user: 1 }, { unique: true })
db.carts.createIndex({ session: 1 }, { unique: true, sparse: true })
db.carts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

**Validation Rules**:
- `user`: Required (or session for guests)
- `items`: Required, array

---

### 9. Wishlists Collection

**Collection Name**: `wishlists`

**Purpose**: Store user wishlist items.

```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("..."), // Reference to users collection
  products: [{
    product: ObjectId("..."),
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.wishlists.createIndex({ user: 1 }, { unique: true })
db.wishlists.createIndex({ "products.product": 1 })
```

**Validation Rules**:
- `user`: Required, unique

---

### 10. Discounts Collection

**Collection Name**: `discounts`

**Purpose**: Store discount codes and promotional offers.

```javascript
{
  _id: ObjectId("..."),
  code: String,
  description: String,
  type: String, // "percentage" | "fixed" | "free_shipping"
  value: Number,
  minimumPurchase: Number,
  maximumDiscount: Number,
  usageLimit: Number,
  usedCount: Number,
  userLimit: Number, // Per user
  applicableProducts: [ObjectId], // Empty = all products
  applicableCategories: [ObjectId], // Empty = all categories
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.discounts.createIndex({ code: 1 }, { unique: true })
db.discounts.createIndex({ isActive: 1, startDate: 1, endDate: 1 })
```

**Validation Rules**:
- `code`: Required, unique
- `type`: Required, enum values
- `value`: Required, positive number

---

### 11. Notifications Collection

**Collection Name**: `notifications`

**Purpose**: Store user notifications for orders, promotions, etc.

```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("..."), // Reference to users collection
  type: String, // "order" | "promotion" | "system" | "review"
  title: String,
  message: String,
  data: {
    // Additional data based on type
    orderId?: ObjectId,
    productId?: ObjectId,
    discountCode?: String
  },
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}
```

**Indexes**:
```javascript
db.notifications.createIndex({ user: 1, isRead: 1 })
db.notifications.createIndex({ createdAt: -1 })
db.notifications.createIndex({ type: 1 })
```

**Validation Rules**:
- `user`: Required
- `type`: Required
- `title`: Required
- `message`: Required

---

## Database Relationships

### One-to-One Relationships
- User ↔ Cart (one cart per user)
- User ↔ Wishlist (one wishlist per user)

### One-to-Many Relationships
- User → Orders (one user, many orders)
- User → Reviews (one user, many reviews)
- User → Messages (one user, many messages)
- Category → Products (one category, many products)
- Brand → Products (one brand, many products)
- Product → Reviews (one product, many reviews)
- Order → Order Items (one order, many items)

### Many-to-Many Relationships
- Products ↔ Categories (via product.category reference)
- Products ↔ Brands (via product.brand reference)
- Users ↔ Products (via wishlist and reviews)

## Data Integrity Strategies

### Referential Integrity
- Use Mongoose populate for referenced documents
- Implement cascading deletes in application logic
- Validate ObjectId references before saving

### Transaction Support
```javascript
// Example transaction for order creation
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Create order
  const order = await Order.create([orderData], { session });
  
  // Update product stock
  await Product.updateMany(
    { _id: { $in: productIds } },
    { $inc: { stockQuantity: -1 } },
    { session }
  );
  
  // Clear user cart
  await Cart.findOneAndUpdate(
    { user: userId },
    { $set: { items: [] } },
    { session }
  );
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## Performance Optimization

### Indexing Strategy
- Create indexes on frequently queried fields
- Use compound indexes for multi-field queries
- Use text indexes for full-text search
- Monitor index usage with `explain()`

### Query Optimization
```javascript
// Bad - N+1 query problem
const products = await Product.find({});
for (const product of products) {
  const brand = await Brand.findById(product.brand);
  // Process brand
}

// Good - Use populate
const products = await Product.find({})
  .populate('brand', 'name logo')
  .populate('category', 'name icon')
  .lean();
```

### Caching Strategy
- Cache frequently accessed data (categories, brands)
- Use Redis for session storage
- Implement query result caching
- Cache product details with TTL

## Backup Strategy

### Backup Schedule
- **Daily**: Full database backup
- **Hourly**: Incremental backup of critical collections
- **Real-time**: Oplog tailing for disaster recovery

### Backup Commands
```bash
# Full backup
mongodump --uri="mongodb://user:pass@host:port/technova_store" --out=/backup/daily

# Restore
mongorestore --uri="mongodb://user:pass@host:port/technova_store" /backup/daily
```

## Security Considerations

### Data Encryption
- Encrypt sensitive fields at rest
- Use TLS for database connections
- Implement field-level encryption for PII

### Access Control
- Role-based access control (RBAC)
- Least privilege principle for database users
- IP whitelisting for database access

### Data Anonymization
- Remove PII from logs
- Anonymize user data for analytics
- Implement data retention policies

## Scaling Strategy

### Horizontal Scaling
- Shard collections by user region
- Use read replicas for read-heavy operations
- Implement connection pooling

### Vertical Scaling
- Increase server resources as needed
- Optimize memory allocation
- Monitor performance metrics

## Migration Strategy

### Schema Versioning
```javascript
const schemaVersion = {
  version: 1,
  migrations: [
    {
      version: 1,
      description: "Initial schema",
      appliedAt: new Date()
    }
  ]
};
```

### Data Migration
```javascript
// Example migration script
async function migrateProductImages() {
  const products = await Product.find({ images: { $exists: false } });
  
  for (const product of products) {
    product.images = [{
      url: product.image_url,
      alt: product.name,
      isPrimary: true
    }];
    await product.save();
  }
}
```

## Monitoring & Maintenance

### Performance Monitoring
- Monitor query execution times
- Track index usage statistics
- Monitor connection pool usage
- Set up alerts for slow queries

### Regular Maintenance
- Rebuild indexes periodically
- Compact database files
- Remove old data (logs, expired sessions)
- Update statistics for query optimizer

## Database Statistics

### Expected Data Volumes (Year 1)
- Users: 10,000 documents
- Products: 500 documents
- Orders: 50,000 documents
- Reviews: 20,000 documents
- Categories: 20 documents
- Brands: 15 documents

### Storage Estimates
- Users: ~5 MB
- Products: ~50 MB (with images)
- Orders: ~100 MB
- Reviews: ~30 MB
- Total: ~200 MB (excluding images)

This MongoDB schema provides a flexible, scalable, and performant foundation for the TechNova Mobile Store, supporting all required features while maintaining data integrity and security.
