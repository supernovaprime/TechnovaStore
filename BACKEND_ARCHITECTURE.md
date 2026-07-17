# TechNova Mobile Store - Backend Architecture

## Technology Stack

### Core Framework
- **Node.js 20+**: JavaScript runtime for server-side development
- **Express.js 4+**: Fast, minimalist web framework for Node.js
- **TypeScript**: Type-safe development for better code quality and maintainability

### Database & ORM
- **MongoDB 7+**: NoSQL database for flexible schema design
- **Mongoose 8+**: ODM (Object Data Modeling) library for MongoDB and Node.js
- **MongoDB Atlas**: Cloud-hosted MongoDB database (or self-hosted)

### Authentication & Security
- **JSON Web Tokens (JWT)**: Stateless authentication
- **bcrypt**: Password hashing for security
- **Helmet**: Security middleware for Express
- **express-rate-limit**: Rate limiting to prevent abuse
- **cors**: Cross-Origin Resource Sharing configuration
- **express-validator**: Request validation and sanitization

### File Upload & Storage
- **Multer**: Middleware for handling multipart/form-data
- **Cloudinary**: Cloud-based image and video storage
- **AWS S3**: Alternative cloud storage option

### Email & Notifications
- **Nodemailer**: Email sending capability
- **SendGrid**: Email service provider
- **Socket.io**: Real-time bidirectional event-based communication

### Logging & Monitoring
- **Winston**: Logging library with multiple transports
- **Morgan**: HTTP request logger middleware
- **Sentry**: Error tracking and performance monitoring

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library for testing

### API Documentation
- **Swagger/OpenAPI**: API documentation
- **swagger-ui-express**: Swagger UI middleware

## Project Structure

```
technova-store-backend/
├── src/
│   ├── config/
│   │   ├── database.ts           # MongoDB connection
│   │   ├── cloudinary.ts         # Cloudinary configuration
│   │   ├── email.ts              # Email service configuration
│   │   └── index.ts              # Environment variables
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   ├── user.controller.ts
│   │   ├── category.controller.ts
│   │   ├── brand.controller.ts
│   │   ├── review.controller.ts
│   │   └── message.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT authentication
│   │   ├── admin.middleware.ts   # Admin role check
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts   # Global error handler
│   │   ├── upload.middleware.ts  # File upload handling
│   │   └── rateLimit.middleware.ts
│   ├── models/
│   │   ├── User.model.ts
│   │   ├── Product.model.ts
│   │   ├── Category.model.ts
│   │   ├── Brand.model.ts
│   │   ├── Order.model.ts
│   │   ├── Review.model.ts
│   │   ├── Message.model.ts
│   │   └── Cart.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── order.routes.ts
│   │   ├── user.routes.ts
│   │   ├── category.routes.ts
│   │   ├── brand.routes.ts
│   │   ├── review.routes.ts
│   │   └── message.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── user.service.ts
│   │   ├── email.service.ts
│   │   ├── upload.service.ts
│   │   └── cache.service.ts
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── product.validator.ts
│   │   ├── order.validator.ts
│   │   └── user.validator.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   ├── constants.ts
│   │   ├── logger.ts
│   │   └── apiResponse.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   └── user.types.ts
│   ├── app.ts                    # Express app configuration
│   └── server.ts                 # Server entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── logs/
├── uploads/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.json
├── .prettierrc
├── README.md
└── swagger.json
```

## Database Schema Design

### User Collection
```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string; // Hashed
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Collection
```typescript
interface IProduct {
  _id: ObjectId;
  name: string;
  slug: string;
  description: string;
  brand: ObjectId; // Reference to Brand
  category: ObjectId; // Reference to Category
  price: number;
  oldPrice?: number;
  discountBadge?: string;
  rating: number;
  stockStatus: 'In Stock' | 'Out of Stock';
  stockQuantity: number;
  images: string[];
  specifications: {
    [key: string]: string;
  };
  features: string[];
  isFeatured: boolean;
  isActive: boolean;
  views: number;
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Collection
```typescript
interface ICategory {
  _id: ObjectId;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  image?: string;
  parent?: ObjectId; // For nested categories
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Brand Collection
```typescript
interface IBrand {
  _id: ObjectId;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Collection
```typescript
interface IOrder {
  _id: ObjectId;
  orderNumber: string;
  user: ObjectId; // Reference to User
  items: {
    product: ObjectId;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDetails?: {
    transactionId?: string;
    paidAt?: Date;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  statusHistory: {
    status: string;
    timestamp: Date;
    note?: string;
  }[];
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Review Collection
```typescript
interface IReview {
  _id: ObjectId;
  user: ObjectId; // Reference to User
  product: ObjectId; // Reference to Product
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpful: number; // Number of helpful votes
  createdAt: Date;
  updatedAt: Date;
}
```

### Message Collection
```typescript
interface IMessage {
  _id: ObjectId;
  user?: ObjectId; // Optional if guest
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  reply?: string;
  repliedAt?: Date;
  repliedBy?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### Cart Collection
```typescript
interface ICart {
  _id: ObjectId;
  user: ObjectId; // Reference to User
  items: {
    product: ObjectId;
    quantity: number;
    price: number; // Price at time of adding
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

## API Architecture

### RESTful API Design Principles
- Resource-based URLs
- HTTP methods for operations (GET, POST, PUT, DELETE, PATCH)
- Status codes for responses
- HATEOAS for linking
- Versioning (/api/v1/)

### API Endpoints Structure

#### Authentication Endpoints
```
POST   /api/v1/auth/register       - Register new user
POST   /api/v1/auth/login          - Login user
POST   /api/v1/auth/logout         - Logout user
POST   /api/v1/auth/refresh        - Refresh access token
POST   /api/v1/auth/forgot-password - Request password reset
POST   /api/v1/auth/reset-password - Reset password
GET    /api/v1/auth/verify-email   - Verify email address
```

#### User Endpoints
```
GET    /api/v1/users/profile       - Get user profile
PUT    /api/v1/users/profile       - Update user profile
PUT    /api/v1/users/password      - Change password
PUT    /api/v1/users/avatar       - Update avatar
GET    /api/v1/users/orders        - Get user orders
```

#### Product Endpoints
```
GET    /api/v1/products            - Get all products (with filters)
GET    /api/v1/products/featured   - Get featured products
GET    /api/v1/products/:id        - Get product by ID
GET    /api/v1/products/:slug      - Get product by slug
POST   /api/v1/products            - Create product (Admin)
PUT    /api/v1/products/:id        - Update product (Admin)
DELETE /api/v1/products/:id        - Delete product (Admin)
PATCH  /api/v1/products/:id/stock  - Update stock (Admin)
GET    /api/v1/products/search     - Search products
```

#### Category Endpoints
```
GET    /api/v1/categories          - Get all categories
GET    /api/v1/categories/:id      - Get category by ID
POST   /api/v1/categories          - Create category (Admin)
PUT    /api/v1/categories/:id      - Update category (Admin)
DELETE /api/v1/categories/:id      - Delete category (Admin)
```

#### Brand Endpoints
```
GET    /api/v1/brands              - Get all brands
GET    /api/v1/brands/:id          - Get brand by ID
POST   /api/v1/brands              - Create brand (Admin)
PUT    /api/v1/brands/:id          - Update brand (Admin)
DELETE /api/v1/brands/:id          - Delete brand (Admin)
```

#### Order Endpoints
```
GET    /api/v1/orders              - Get all orders (Admin)
GET    /api/v1/orders/:id          - Get order by ID
POST   /api/v1/orders              - Create order
PUT    /api/v1/orders/:id/status   - Update order status (Admin)
PATCH  /api/v1/orders/:id/cancel   - Cancel order
GET    /api/v1/orders/tracking/:id - Get order tracking
```

#### Cart Endpoints
```
GET    /api/v1/cart                - Get user cart
POST   /api/v1/cart                - Add item to cart
PUT    /api/v1/cart/:itemId        - Update cart item
DELETE /api/v1/cart/:itemId        - Remove item from cart
DELETE /api/v1/cart                - Clear cart
```

#### Review Endpoints
```
GET    /api/v1/reviews             - Get reviews (with filters)
GET    /api/v1/reviews/product/:productId - Get product reviews
POST   /api/v1/reviews             - Create review
PUT    /api/v1/reviews/:id         - Update review
DELETE /api/v1/reviews/:id         - Delete review
PATCH  /api/v1/reviews/:id/approve - Approve review (Admin)
```

#### Message Endpoints
```
GET    /api/v1/messages            - Get all messages (Admin)
GET    /api/v1/messages/:id        - Get message by ID
POST   /api/v1/messages            - Create message
PUT    /api/v1/messages/:id/reply  - Reply to message (Admin)
DELETE /api/v1/messages/:id        - Delete message (Admin)
```

## Role-Based Access Control (RBAC) System

### User Roles & Permissions

**Role Hierarchy**
```
Guest (Unauthenticated)
  ↓
Customer (Authenticated)
  ↓
Admin (Authenticated + Elevated Permissions)
```

**Role Definitions**

```typescript
// types/auth.types.ts
export enum UserRole {
  GUEST = 'guest',
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}

export enum Permission {
  // Customer Permissions
  VIEW_PRODUCTS = 'view:products',
  CREATE_ORDER = 'create:order',
  VIEW_OWN_ORDERS = 'view:own:orders',
  WRITE_REVIEW = 'write:review',
  MANAGE_PROFILE = 'manage:profile',
  MANAGE_CART = 'manage:cart',
  
  // Admin Permissions
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

// Role-Permission Mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [
    Permission.VIEW_PRODUCTS,
  ],
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

// Permission checking utility
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};
```

### Enhanced User Model with Roles

```typescript
// models/User.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, Permission, ROLE_PERMISSIONS } from '../types/auth.types';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    avatar: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Automatically assign permissions based on role
UserSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    this.permissions = ROLE_PERMISSIONS[this.role] || [];
  }
  next();
});

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
```

### Enhanced Authentication Middleware

```typescript
// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.model';
import { UserRole, Permission } from '../types/auth.types';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please provide a valid token',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: UserRole;
    };

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account inactive',
        message: 'Your account has been deactivated',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      message: 'Please authenticate to continue',
    });
  }
};

export const authorize = (permissions: Permission | Permission[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please authenticate to continue',
      });
    }

    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    const userPermissions = req.user.permissions || [];
    
    const hasRequiredPermission = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasRequiredPermission) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

export const authorizeRole = (roles: UserRole | UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please authenticate to continue',
      });
    }

    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient privileges',
        message: 'This action requires elevated privileges',
      });
    }

    next();
  };
};

// Convenience middleware for admin-only routes
export const adminOnly = authorizeRole(UserRole.ADMIN);

// Convenience middleware for customer-only routes
export const customerOnly = authorizeRole(UserRole.CUSTOMER);
```

### JWT Token Strategy with Role Information

```typescript
// services/auth.service.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User.model';
import { UserRole, TokenPayload } from '../types/auth.types';

export class AuthService {
  private generateAccessToken(user: IUser): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
  }

  private generateRefreshToken(user: IUser): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      user: user.toObject() as IUser,
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      user: user.toObject() as IUser,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    user: IUser;
  }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as TokenPayload;

      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      const accessToken = this.generateAccessToken(user);

      return {
        accessToken,
        user: user.toObject() as IUser,
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await User.findOne({ emailVerificationToken: token });
    
    if (!user) {
      throw new Error('Invalid verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
  }

  async requestPasswordReset(email: string): Promise<string> {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }
}
```

### Enhanced Authentication Controller

```typescript
// controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import { UserRole } from '../types/auth.types';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role selection (prevent unauthorized admin creation)
    if (role === UserRole.ADMIN) {
      // In production, you might want additional verification for admin accounts
      // For now, we'll allow it but could add email verification requirement
    }

    const result = await authService.register({
      name,
      email,
      password,
      role: role || UserRole.CUSTOMER,
    });

    ApiResponse.success(res, result, 'Registration successful', 201);
  } catch (error) {
    ApiResponse.error(res, error.message, 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    ApiResponse.success(res, result, 'Login successful');
  } catch (error) {
    ApiResponse.error(res, error.message, 401);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    
    ApiResponse.success(res, result, 'Token refreshed successfully');
  } catch (error) {
    ApiResponse.error(res, error.message, 401);
  }
};

export const logout = async (req: Request, res: Response) => {
  // In a production environment, you might want to invalidate the refresh token
  // For now, we'll just return success (client should remove tokens)
  ApiResponse.success(res, null, 'Logout successful');
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    await authService.verifyEmail(token);
    
    ApiResponse.success(res, null, 'Email verified successfully');
  } catch (error) {
    ApiResponse.error(res, error.message, 400);
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const resetToken = await authService.requestPasswordReset(email);
    
    // Send email with reset token
    await emailService.sendPasswordResetEmail(email, resetToken);
    
    ApiResponse.success(res, null, 'Password reset email sent');
  } catch (error) {
    ApiResponse.error(res, error.message, 400);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    
    ApiResponse.success(res, null, 'Password reset successful');
  } catch (error) {
    ApiResponse.error(res, error.message, 400);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // User is already attached to req by authenticate middleware
    ApiResponse.success(res, req.user, 'Profile retrieved successfully');
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, phone, address } = req.body;
    const user = req.user!;
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    await user.save();
    
    ApiResponse.success(res, user, 'Profile updated successfully');
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};
```

### Protected Route Implementation

```typescript
// routes/auth.routes.ts
import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
} from '../controllers/auth.controller';
import {
  authenticate,
  authorize,
  adminOnly,
  customerOnly,
} from '../middleware/auth.middleware';
import { Permission } from '../types/auth.types';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Admin-only routes
router.get('/users', authenticate, adminOnly, getAllUsers);
router.put('/users/:id/role', authenticate, adminOnly, updateUserRole);
router.delete('/users/:id', authenticate, adminOnly, deleteUser);

export default router;
```

### Role-Based Route Protection Examples

```typescript
// routes/product.routes.ts
import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import {
  authenticate,
  authorize,
  adminOnly,
} from '../middleware/auth.middleware';
import { Permission } from '../types/auth.types';

const router = express.Router();

// Public routes (guest access)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes (require authentication)
router.post('/reviews', authenticate, authorize(Permission.WRITE_REVIEW), createReview);

// Admin-only routes
router.post('/', authenticate, authorize(Permission.MANAGE_PRODUCTS), createProduct);
router.put('/:id', authenticate, authorize(Permission.MANAGE_PRODUCTS), updateProduct);
router.delete('/:id', authenticate, authorize(Permission.MANAGE_PRODUCTS), deleteProduct);

export default router;
```

### User Management Controller (Admin Only)

```typescript
// controllers/user.controller.ts
import { Response } from 'express';
import { User } from '../models/User.model';
import { ApiResponse } from '../utils/apiResponse';
import { UserRole } from '../types/auth.types';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    const query: any = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    ApiResponse.paginated(res, users, {
      page: Number(page),
      limit: Number(limit),
      total,
    });
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      return ApiResponse.error(res, 'Invalid role', 400);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    ApiResponse.success(res, user, 'User role updated successfully');
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    ApiResponse.success(res, null, 'User deleted successfully');
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};
```

### Permission-Based Access Control in Controllers

```typescript
// controllers/order.controller.ts
import { Response } from 'express';
import { Order } from '../models/Order.model';
import { ApiResponse } from '../utils/apiResponse';
import { Permission } from '../types/auth.types';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    
    // Customers can only see their own orders
    if (user.role === UserRole.CUSTOMER) {
      const orders = await Order.find({ user: user._id })
        .sort({ createdAt: -1 });
      
      return ApiResponse.success(res, orders, 'Orders retrieved successfully');
    }

    // Admins can see all orders
    if (user.role === UserRole.ADMIN) {
      const { page = 1, limit = 10, status } = req.query;
      
      const query: any = {};
      if (status) query.status = status;

      const orders = await Order.find(query)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await Order.countDocuments(query);

      return ApiResponse.paginated(res, orders, {
        page: Number(page),
        limit: Number(limit),
        total,
      });
    }

    return ApiResponse.error(res, 'Unauthorized access', 403);
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    // Only admins can update order status
    if (req.user.role !== UserRole.ADMIN) {
      return ApiResponse.error(res, 'Admin access required', 403);
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status,
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            note,
            updatedBy: req.user._id,
          },
        },
      },
      { new: true }
    );

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    // Send notification to customer
    await notificationService.sendOrderStatusUpdate(order);

    ApiResponse.success(res, order, 'Order status updated successfully');
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};
```

### Authentication & Authorization

### JWT Token Strategy
```typescript
// Access Token: Short-lived (15 minutes)
// Refresh Token: Long-lived (7 days)

interface TokenPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
}

// Token generation
const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });
};

const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
};
```

### Middleware Implementation
```typescript
// auth.middleware.ts
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// admin.middleware.ts
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

### Password Security
```typescript
import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
```

## Error Handling

### Global Error Handler
```typescript
// error.middleware.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details
    });
  }

  if (err instanceof AuthenticationError) {
    return res.status(401).json({
      error: 'Authentication Error',
      message: err.message
    });
  }

  if (err instanceof AuthorizationError) {
    return res.status(403).json({
      error: 'Authorization Error',
      message: err.message
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};
```

### Custom Error Classes
```typescript
export class ValidationError extends Error {
  constructor(public details: any) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
```

## Request Validation

### Express Validator Integration
```typescript
// validators/auth.validator.ts
import { body, validationResult } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('role').isIn(['customer', 'admin']).withMessage('Invalid role'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// middleware usage
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array());
  }
  next();
};
```

## File Upload Handling

### Multer Configuration
```typescript
// middleware/upload.middleware.ts
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'technova-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

export const uploadMultiple = upload.array('images', 5);
export const uploadSingle = upload.single('image');
```

## Rate Limiting

### Rate Limit Configuration
```typescript
// middleware/rateLimit.middleware.ts
import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: 'Upload limit exceeded, please try again later',
});
```

## Caching Strategy

### Redis Caching (Optional Enhancement)
```typescript
// services/cache.service.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cacheService = {
  async get(key: string): Promise<any> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};
```

## Email Service

### Nodemailer Configuration
```typescript
// services/email.service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const emailService = {
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to TechNova Mobile',
      html: `<h1>Welcome ${name}!</h1><p>Thank you for registering with TechNova Mobile.</p>`,
    });
  },

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
  },

  async sendOrderConfirmationEmail(email: string, orderDetails: any): Promise<void> {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Order Confirmation',
      html: `<h1>Order #${orderDetails.orderNumber}</h1><p>Your order has been confirmed.</p>`,
    });
  },
};
```

## Logging System

### Winston Configuration
```typescript
// utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

## API Response Standardization

### Consistent Response Format
```typescript
// utils/apiResponse.ts
export class ApiResponse {
  static success(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string, statusCode: number = 500, errors: any = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  static paginated(res: Response, data: any, pagination: any, message: string = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: Math.ceil(pagination.total / pagination.limit),
      },
    });
  }
}
```

## Environment Variables

### Configuration Management
```typescript
// config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/technova_db',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  
  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  
  // Email
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  emailFrom: process.env.EMAIL_FROM,
  
  // Redis (optional)
  redisUrl: process.env.REDIS_URL,
  
  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
```

## Testing Strategy

### Unit Testing with Jest
```typescript
// tests/unit/product.service.test.ts
import { ProductService } from '../../src/services/product.service';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  describe('getAllProducts', () => {
    it('should return array of products', async () => {
      const products = await productService.getAllProducts();
      expect(Array.isArray(products)).toBe(true);
    });

    it('should apply filters correctly', async () => {
      const products = await productService.getAllProducts({ category: 'phones' });
      expect(products.every(p => p.category === 'phones')).toBe(true);
    });
  });
});
```

### Integration Testing with Supertest
```typescript
// tests/integration/auth.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('Auth Endpoints', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123',
          role: 'customer',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });
  });
});
```

## Security Best Practices

### Security Headers with Helmet
```typescript
// app.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

### CORS Configuration
```typescript
// app.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Input Sanitization
```typescript
// middleware/validation.middleware.ts
import { sanitize } from 'express-mongo-sanitize';

app.use(sanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
```

## Performance Optimization

### Database Indexing
```typescript
// models/Product.model.ts
productSchema.index({ name: 'text', description: 'text' }); // Text search
productSchema.index({ price: 1 });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 }, { unique: true });
```

### Query Optimization
```typescript
// services/product.service.ts
export const getProducts = async (filters: any) => {
  const query = Product.find(filters)
    .populate('brand', 'name logo')
    .populate('category', 'name icon')
    .select('-__v')
    .sort({ createdAt: -1 })
    .limit(20);

  return query.lean(); // Faster queries
};
```

### Connection Pooling
```typescript
// config/database.ts
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

## Monitoring & Analytics

### Health Check Endpoint
```typescript
// routes/health.routes.ts
router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  };

  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json(health);
  } catch (error) {
    health.message = 'Database connection failed';
    res.status(503).json(health);
  }
});
```

### Request Logging with Morgan
```typescript
// app.ts
import morgan from 'morgan';

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
```

## Deployment Strategy

### Environment Setup
```bash
# Production
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/technova
JWT_SECRET=your-production-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy
```

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Project setup with Express + TypeScript
- MongoDB connection and Mongoose models
- Authentication system (JWT)
- Basic middleware setup
- Environment configuration

### Phase 2: Core APIs (Week 3-4)
- User management APIs
- Product CRUD operations
- Category and Brand APIs
- File upload functionality
- Basic validation

### Phase 3: Order System (Week 5-6)
- Shopping cart APIs
- Order creation and management
- Payment integration
- Order status updates
- Email notifications

### Phase 4: Advanced Features (Week 7-8)
- Review and rating system
- Search functionality
- Filtering and sorting
- Message system
- Admin dashboard APIs

### Phase 5: Security & Performance (Week 9-10)
- Rate limiting implementation
- Security hardening
- Performance optimization
- Caching layer
- Monitoring setup

### Phase 6: Testing & Documentation (Week 11-12)
- Unit testing
- Integration testing
- API documentation (Swagger)
- Code documentation
- Load testing

### Phase 7: Deployment & Monitoring (Week 13-14)
- Production deployment
- Monitoring setup
- Error tracking
- Performance monitoring
- Backup strategies

This architecture provides a robust, scalable, and secure backend foundation for the TechNova Mobile Store, following industry best practices and modern development standards.
