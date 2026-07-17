# Kilo CLI Backend Implementation Prompt

**Project**: TechNova Mobile Store Backend  
**Architecture Reference**: BACKEND_ARCHITECTURE.md  
**Database Schema**: MONGODB_SCHEMA.md  
**Implementation Goal**: Production-ready Node.js/Express backend with MongoDB

---

## CRITICAL IMPLEMENTATION REQUIREMENTS

### 1. PROJECT INITIALIZATION
- Initialize Node.js 20+ project with TypeScript strict mode
- Set up Express.js 4+ with proper TypeScript configuration
- Configure package.json with all required dependencies
- Set up tsconfig.json with strict type checking and ES2022 target
- Create exact folder structure as specified in BACKEND_ARCHITECTURE.md
- Initialize Git repository with .gitignore for Node.js/TypeScript

### 2. DEPENDENCY INSTALLATION (COST-OPTIMIZED)
- Install only essential production dependencies (no bloat)
- Use exact versions for stability
- Group dependencies logically in package.json
- Include dev dependencies for testing and linting
- Set up Husky for pre-commit hooks
- Configure lint-staged for efficient linting

**Required Production Dependencies**:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "nodemailer": "^6.9.7",
    "winston": "^3.11.0",
    "morgan": "^1.10.0"
  }
}
```

**Required Dev Dependencies**:
```json
{
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/multer": "^1.4.11",
    "@types/nodemailer": "^6.4.14",
    "@types/morgan": "^1.9.9",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "ts-jest": "^29.1.1",
    "supertest": "^6.3.3",
    "@types/supertest": "^6.0.2",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "prettier": "^3.1.1",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0"
  }
}
```

### 3. ENVIRONMENT CONFIGURATION
- Create .env.example with all required variables
- Implement environment variable validation
- Use process.env with proper fallbacks
- Support development, staging, and production environments
- Never commit .env files

**Required Environment Variables**:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/technova_store
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@technovamobile.com
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=info
```

### 4. DATABASE IMPLEMENTATION (MONGOOSE)

**CRITICAL**: Implement exact schema from MONGODB_SCHEMA.md

**User Model Requirements**:
- Implement IUser interface with all fields from MONGODB_SCHEMA.md
- Add role field with enum (GUEST, CUSTOMER, ADMIN)
- Add permissions array with automatic assignment based on role
- Implement password hashing with bcrypt (12 rounds)
- Add comparePassword method
- Implement pre-save hook for permission assignment
- Add indexes on email (unique), role, isActive
- Implement timestamps

**Product Model Requirements**:
- Implement IProduct interface with all fields
- Add references to Brand and Category models
- Implement text search index on name, description
- Add indexes on slug (unique), price, rating, isFeatured
- Implement stock status validation
- Add virtual fields for discount calculation

**Category Model Requirements**:
- Implement ICategory interface
- Add parent reference for nested categories
- Implement slug generation
- Add indexes on slug (unique), parent

**Brand Model Requirements**:
- Implement IBrand interface
- Add indexes on slug (unique), name

**Order Model Requirements**:
- Implement IOrder interface with all fields
- Add references to User model
- Implement order number generation
- Add status history tracking
- Implement total amount calculation
- Add indexes on orderNumber (unique), user, status

**Review Model Requirements**:
- Implement IReview interface
- Add references to User and Product models
- Implement rating validation (1-5)
- Add indexes on user, product, rating

**Message Model Requirements**:
- Implement IMessage interface
- Add optional user reference
- Implement status tracking
- Add indexes on status, email

**Cart Model Requirements**:
- Implement ICart interface
- Add user reference with unique constraint
- Implement session-based guest carts
- Add TTL index for session expiration

### 5. ROLE-BASED ACCESS CONTROL (RBAC)

**CRITICAL**: Implement exact RBAC system from BACKEND_ARCHITECTURE.md

**Types Implementation**:
```typescript
// types/auth.types.ts
export enum UserRole {
  GUEST = 'guest',
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}

export enum Permission {
  VIEW_PRODUCTS = 'view:products',
  CREATE_ORDER = 'create:order',
  VIEW_OWN_ORDERS = 'view:own:orders',
  WRITE_REVIEW = 'write:review',
  MANAGE_PROFILE = 'manage:profile',
  MANAGE_CART = 'manage:cart',
  MANAGE_PRODUCTS = 'manage:products',
  MANAGE_ORDERS = 'manage:orders',
  MANAGE_USERS = 'manage:users',
  MANAGE_CATEGORIES = 'manage:categories',
  MANAGE_BRANDS = 'manage:brands',
  MANAGE_REVIEWS = 'manage:reviews',
  MANAGE_MESSAGES = 'manage:messages',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_SETTINGS = 'manage:settings',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [Permission.VIEW_PRODUCTS],
  [UserRole.CUSTOMER]: [
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_ORDER,
    Permission.VIEW_OWN_ORDERS,
    Permission.WRITE_REVIEW,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_CART,
  ],
  [UserRole.ADMIN]: [
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_ORDER,
    Permission.VIEW_OWN_ORDERS,
    Permission.WRITE_REVIEW,
    Permission.MANAGE_PROFILE,
    Permission.MANAGE_CART,
    Permission.MANAGE_PRODUCTS,
    Permission.MANAGE_ORDERS,
    Permission.MANAGE_USERS,
    Permission.MANAGE_CATEGORIES,
    Permission.MANAGE_BRANDS,
    Permission.MANAGE_REVIEWS,
    Permission.MANAGE_MESSAGES,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SETTINGS,
  ],
};
```

**Middleware Implementation**:
- Implement authenticate middleware with JWT verification
- Implement authorize middleware for permission checking
- Implement authorizeRole middleware for role checking
- Implement adminOnly and customerOnly convenience middleware
- Add proper error responses for unauthorized access
- Include user object in request after authentication

### 6. AUTHENTICATION SERVICE

**CRITICAL**: Implement complete auth service with role support

**AuthService Requirements**:
- Implement register method with role selection
- Implement login method with credential validation
- Implement token generation (access + refresh tokens)
- Implement token refresh mechanism
- Implement email verification
- Implement password reset flow
- Add proper error handling
- Include last login tracking
- Implement account status checking

**JWT Token Strategy**:
- Access token: 15 minutes expiration
- Refresh token: 7 days expiration
- Include userId, email, and role in payload
- Use separate secrets for access and refresh tokens
- Implement proper token validation

### 7. CONTROLLERS IMPLEMENTATION

**Auth Controller**:
- register: Handle user registration with role selection
- login: Handle user login
- refreshToken: Handle token refresh
- logout: Handle logout
- verifyEmail: Handle email verification
- requestPasswordReset: Handle password reset request
- resetPassword: Handle password reset
- getProfile: Get user profile
- updateProfile: Update user profile

**Product Controller**:
- getAllProducts: Get all products with filtering/pagination
- getProductById: Get product by ID
- createProduct: Create product (admin only)
- updateProduct: Update product (admin only)
- deleteProduct: Delete product (admin only)
- searchProducts: Search products

**Order Controller**:
- getOrders: Get orders (role-based access)
- getOrderById: Get order by ID
- createOrder: Create order
- updateOrderStatus: Update order status (admin only)
- cancelOrder: Cancel order

**User Controller**:
- getAllUsers: Get all users (admin only)
- getUserById: Get user by ID (admin only)
- updateUserRole: Update user role (admin only)
- deleteUser: Delete user (admin only)

**Category Controller**:
- getAllCategories: Get all categories
- getCategoryById: Get category by ID
- createCategory: Create category (admin only)
- updateCategory: Update category (admin only)
- deleteCategory: Delete category (admin only)

**Brand Controller**:
- getAllBrands: Get all brands
- getBrandById: Get brand by ID
- createBrand: Create brand (admin only)
- updateBrand: Update brand (admin only)
- deleteBrand: Delete brand (admin only)

**Review Controller**:
- getAllReviews: Get all reviews with filtering
- getReviewsByProduct: Get reviews for a product
- createReview: Create review
- updateReview: Update review
- deleteReview: Delete review
- approveReview: Approve review (admin only)

**Message Controller**:
- getAllMessages: Get all messages (admin only)
- getMessageById: Get message by ID
- createMessage: Create message
- replyToMessage: Reply to message (admin only)
- deleteMessage: Delete message (admin only)

### 8. ROUTES IMPLEMENTATION

**CRITICAL**: Implement exact API structure from BACKEND_ARCHITECTURE.md

**Route Structure**:
- Public routes: No authentication required
- Protected routes: Authentication required
- Permission-based routes: Specific permissions required
- Role-based routes: Specific roles required

**Auth Routes**:
- POST /api/v1/auth/register (public)
- POST /api/v1/auth/login (public)
- POST /api/v1/auth/refresh (public)
- POST /api/v1/auth/logout (protected)
- GET /api/v1/auth/profile (protected)
- PUT /api/v1/auth/profile (protected)
- GET /api/v1/auth/verify-email/:token (public)
- POST /api/v1/auth/forgot-password (public)
- POST /api/v1/auth/reset-password (public)

**Product Routes**:
- GET /api/v1/products (public)
- GET /api/v1/products/featured (public)
- GET /api/v1/products/:id (public)
- POST /api/v1/products (admin only)
- PUT /api/v1/products/:id (admin only)
- DELETE /api/v1/products/:id (admin only)
- GET /api/v1/products/search (public)

**Order Routes**:
- GET /api/v1/orders (protected, role-based)
- GET /api/v1/orders/:id (protected, role-based)
- POST /api/v1/orders (protected)
- PUT /api/v1/orders/:id/status (admin only)
- PATCH /api/v1/orders/:id/cancel (protected)

**User Routes**:
- GET /api/v1/users (admin only)
- GET /api/v1/users/:id (admin only)
- PUT /api/v1/users/:id/role (admin only)
- DELETE /api/v1/users/:id (admin only)

**Category Routes**:
- GET /api/v1/categories (public)
- GET /api/v1/categories/:id (public)
- POST /api/v1/categories (admin only)
- PUT /api/v1/categories/:id (admin only)
- DELETE /api/v1/categories/:id (admin only)

**Brand Routes**:
- GET /api/v1/brands (public)
- GET /api/v1/brands/:id (public)
- POST /api/v1/brands (admin only)
- PUT /api/v1/brands/:id (admin only)
- DELETE /api/v1/brands/:id (admin only)

**Review Routes**:
- GET /api/v1/reviews (public)
- GET /api/v1/reviews/product/:productId (public)
- POST /api/v1/reviews (protected)
- PUT /api/v1/reviews/:id (protected)
- DELETE /api/v1/reviews/:id (protected)
- PATCH /api/v1/reviews/:id/approve (admin only)

**Message Routes**:
- GET /api/v1/messages (admin only)
- GET /api/v1/messages/:id (admin only)
- POST /api/v1/messages (public)
- PUT /api/v1/messages/:id/reply (admin only)
- DELETE /api/v1/messages/:id (admin only)

### 9. MIDDLEWARE IMPLEMENTATION

**Auth Middleware**:
- authenticate: JWT verification and user attachment
- authorize: Permission-based access control
- authorizeRole: Role-based access control
- adminOnly: Admin-only access
- customerOnly: Customer-only access

**Validation Middleware**:
- Implement request validation using express-validator
- Create validation schemas for all endpoints
- Sanitize input to prevent injection attacks
- Return proper error messages for validation failures

**Error Middleware**:
- Implement global error handler
- Handle authentication errors
- Handle authorization errors
- Handle validation errors
- Handle database errors
- Return consistent error responses

**Rate Limiting Middleware**:
- Implement general rate limiter
- Implement auth-specific rate limiter
- Implement upload rate limiter
- Configure appropriate limits

**Security Middleware**:
- Configure Helmet for security headers
- Configure CORS for cross-origin requests
- Implement request size limits
- Add input sanitization

### 10. SERVICES IMPLEMENTATION

**Auth Service**:
- Complete authentication logic
- Token generation and validation
- Password hashing
- Email verification
- Password reset

**Product Service**:
- Product CRUD operations
- Search functionality
- Filtering and sorting
- Stock management

**Order Service**:
- Order creation logic
- Order status updates
- Order calculations
- Notification triggers

**User Service**:
- User management
- Profile updates
- Role management

**Email Service**:
- Email configuration
- Email templates
- Send verification emails
- Send password reset emails
- Send order confirmation emails

**Upload Service**:
- Cloudinary configuration
- Image upload handling
- Image optimization
- Error handling

### 11. CONFIGURATION FILES

**Database Configuration**:
- Implement MongoDB connection
- Add connection error handling
- Implement connection retry logic
- Add connection event listeners

**Cloudinary Configuration**:
- Configure Cloudinary SDK
- Set up upload transformations
- Configure folder structure

**Email Configuration**:
- Configure Nodemailer
- Set up SendGrid integration
- Implement email templates

**Logger Configuration**:
- Configure Winston
- Set up multiple transports
- Implement log rotation
- Configure log levels

### 12. API RESPONSE STANDARDIZATION

**Implement ApiResponse utility**:
```typescript
class ApiResponse {
  static success(res, data, message, statusCode)
  static error(res, message, statusCode, errors)
  static paginated(res, data, pagination, message)
}
```

**Response Format**:
- Success: { success: true, message, data }
- Error: { success: false, error, message, errors }
- Paginated: { success: true, message, data, pagination }

### 13. TESTING IMPLEMENTATION

**Unit Tests**:
- Test all service methods
- Test utility functions
- Test validation schemas
- Use Jest with TypeScript

**Integration Tests**:
- Test all API endpoints
- Test authentication flow
- Test authorization
- Use Supertest

**Test Coverage**:
- Aim for 80%+ code coverage
- Test critical paths thoroughly
- Test error scenarios

### 14. CODE QUALITY REQUIREMENTS

**TypeScript Configuration**:
- Strict mode enabled
- No implicit any
- Strict null checks
- Strict function types
- Proper interface definitions

**Code Style**:
- Follow ESLint rules
- Use Prettier for formatting
- Consistent naming conventions
- Proper file organization
- Meaningful variable names

**Error Handling**:
- Comprehensive error handling
- Proper error messages
- Error logging
- Graceful degradation

**Performance**:
- Implement database indexes
- Use lean() for queries
- Implement query optimization
- Add response caching where appropriate
- Use connection pooling

**Security**:
- Input validation
- Output sanitization
- SQL injection prevention
- XSS prevention
- CSRF protection
- Rate limiting
- Secure headers

### 15. DOCUMENTATION

**Code Comments**:
- Add JSDoc comments for functions
- Comment complex logic
- Document API endpoints
- Add usage examples

**API Documentation**:
- Implement Swagger/OpenAPI
- Add route documentation
- Include request/response examples
- Document authentication requirements

### 16. DEPLOYMENT CONFIGURATION

**Docker Configuration**:
- Create Dockerfile
- Create docker-compose.yml
- Configure environment variables
- Set up health checks

**Production Configuration**:
- Environment-specific configurations
- Production-optimized settings
- Error tracking integration
- Performance monitoring

---

## IMPLEMENTATION ORDER

### Phase 1: Foundation (Priority: CRITICAL)
1. Project initialization and configuration
2. Environment setup
3. Database connection
4. Base middleware implementation
5. Error handling setup
6. Logging configuration
7. API response standardization

### Phase 2: Authentication System (Priority: CRITICAL)
1. User model with RBAC
2. Auth types and permissions
3. Auth middleware implementation
4. Auth service implementation
5. Auth controller implementation
6. Auth routes implementation
7. Token management

### Phase 3: Core Models (Priority: HIGH)
1. Product model
2. Category model
3. Brand model
4. Order model
5. Review model
6. Message model
7. Cart model

### Phase 4: Core Services (Priority: HIGH)
1. Product service
2. Order service
3. User service
4. Email service
5. Upload service

### Phase 5: Controllers & Routes (Priority: HIGH)
1. Product controller and routes
2. Order controller and routes
3. User controller and routes
4. Category controller and routes
5. Brand controller and routes
6. Review controller and routes
7. Message controller and routes

### Phase 6: Testing & Quality (Priority: MEDIUM)
1. Unit tests
2. Integration tests
3. Code quality checks
4. Performance optimization
5. Security hardening

### Phase 7: Documentation & Deployment (Priority: MEDIUM)
1. API documentation
2. Code documentation
3. Deployment configuration
4. Monitoring setup

---

## COST-OPTIMIZATION REQUIREMENTS

**Dependency Management**:
- Use only essential dependencies
- Prefer lightweight alternatives
- Remove unused dependencies
- Use exact versions

**Database Optimization**:
- Implement proper indexing
- Use query optimization
- Implement connection pooling
- Use lean queries where appropriate

**Caching Strategy**:
- Implement response caching
- Cache frequently accessed data
- Use appropriate TTL values
- Implement cache invalidation

**Resource Management**:
- Implement proper cleanup
- Use efficient data structures
- Optimize memory usage
- Implement rate limiting

**Deployment Optimization**:
- Use appropriate instance sizes
- Implement auto-scaling
- Optimize bundle size
- Use CDN for static assets

---

## QUALITY GATES

**Before Considered Complete**:
- [ ] All models implemented with exact schema
- [ ] RBAC system fully functional
- [ ] All API endpoints implemented
- [ ] Authentication flow complete
- [ ] Error handling comprehensive
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Logging functional
- [ ] Unit tests passing (80%+ coverage)
- [ ] Integration tests passing
- [ ] ESLint passing with zero errors
- [ ] TypeScript compilation successful
- [ ] API documentation complete
- [ ] Environment configuration complete
- [ ] Deployment configuration ready

---

## SUCCESS CRITERIA

**Functional Requirements**:
- Complete RBAC system with role hierarchy
- All authentication flows functional
- All CRUD operations for core entities
- Permission-based access control working
- File upload functionality working
- Email notifications working
- API responses consistent
- Error handling comprehensive

**Non-Functional Requirements**:
- Code quality: ESLint zero errors
- Type safety: TypeScript strict mode
- Test coverage: 80%+
- Performance: API response time <200ms
- Security: All security measures implemented
- Documentation: Complete API documentation

**Integration Requirements**:
- MongoDB connection stable
- Cloudinary integration working
- Email service functional
- Environment configuration complete
- Deployment configuration ready

---

## CRITICAL NOTES

1. **Follow BACKEND_ARCHITECTURE.md exactly** - Do not deviate from the specified architecture
2. **Implement exact schema from MONGODB_SCHEMA.md** - All fields and relationships must match
3. **RBAC system is critical** - Must implement exact role hierarchy and permissions
4. **TypeScript strict mode** - No implicit any, proper type definitions
5. **Error handling is mandatory** - Every function must have proper error handling
6. **Security is priority** - Implement all security measures
7. **Code quality is non-negotiable** - Follow best practices, clean code principles
8. **Testing is required** - Unit and integration tests for critical functionality
9. **Documentation is essential** - Code comments and API documentation
10. **Cost optimization** - Use efficient approaches, avoid unnecessary dependencies

---

## EXPECTED DELIVERABLES

1. Complete backend project structure
2. All Mongoose models with exact schema
3. Complete RBAC system implementation
4. All controllers with proper error handling
5. All routes with proper middleware
6. Authentication service with JWT
7. File upload service with Cloudinary
8. Email service with templates
9. Complete middleware suite
10. Configuration files for all services
11. Unit tests for critical functionality
12. Integration tests for API endpoints
13. API documentation with Swagger
14. Docker configuration
15. Environment configuration templates
16. Deployment configuration
17. README with setup instructions

---

Start implementation immediately following this exact specification. Do not deviate from the architecture defined in BACKEND_ARCHITECTURE.md and MONGODB_SCHEMA.md. Prioritize code quality, security, and performance optimization throughout the implementation process.
