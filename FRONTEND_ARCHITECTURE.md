# TechNova Mobile Store - Frontend Architecture

## Technology Stack

### Core Framework
- **React 18+**: Modern React with hooks and concurrent features
- **Vite 5+**: Build tool for fast development and optimized production builds
- **TypeScript**: Type-safe development for better code quality

### UI Framework & Styling
- **TailwindCSS 3+**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible React components built on Radix UI
- **Lucide React**: Beautiful and consistent icon library
- **Framer Motion**: Production-ready motion library for smooth animations

### Design System & Color Palette

**Primary Color Palette (Blue & White - Professional Tech Look)**

The color palette is designed to feel modern, premium, and technology-focused, building trust and providing a clean appearance ideal for a mobile phone and accessories business.

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#2563EB',  // Royal Blue
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',  // Primary
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#1E3A8A',
        },
        // Secondary Colors
        secondary: {
          DEFAULT: '#0EA5E9',  // Sky Blue
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',  // Secondary
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        // Accent Color
        accent: {
          DEFAULT: '#F97316',  // Orange
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',  // Accent
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Neutral Colors
        background: '#F8FAFC',  // Light gray background
        card: '#FFFFFF',        // White cards
        text: {
          DEFAULT: '#1F2937',   // Primary text
          secondary: '#6B7280', // Secondary text
          muted: '#9CA3AF',    // Muted text
        },
        // Semantic Colors
        success: {
          DEFAULT: '#22C55E',  // Green
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
        },
        error: {
          DEFAULT: '#EF4444',  // Red
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
        },
        warning: {
          DEFAULT: '#F59E0B',  // Amber
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
      }
    }
  }
}
```

**Color Usage Guidelines**

- **Primary (#2563EB)**: Main brand color, used for primary buttons, links, and key interactive elements
- **Secondary (#0EA5E9)**: Supporting color, used for gradients, hover states, and secondary actions
- **Accent (#F97316)**: Call-to-action elements, badges, notifications, and highlights
- **Background (#F8FAFC)**: Page background, section backgrounds
- **Card (#FFFFFF)**: Card backgrounds, modal backgrounds, content containers
- **Text (#1F2937)**: Primary text, headings, body text
- **Text Secondary (#6B7280)**: Secondary text, descriptions, metadata
- **Success (#22C55E)**: Success messages, positive indicators
- **Error (#EF4444)**: Error messages, destructive actions, warnings

**Typography Scale**

```typescript
// Font family
fontFamily: {
  sans: ['Poppins', 'system-ui', 'sans-serif'],
  heading: ['Poppins', 'system-ui', 'sans-serif'],
  body: ['Inter', 'system-ui', 'sans-serif'],
}

// Font sizes
fontSize: {
  'xs': ['0.75rem', { lineHeight: '1rem' }],
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],
  'base': ['1rem', { lineHeight: '1.5rem' }],
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  '5xl': ['3rem', { lineHeight: '1' }],
  '6xl': ['3.75rem', { lineHeight: '1' }],
}
```

**Spacing Scale**

```typescript
// Consistent spacing using 4px base unit
spacing: {
  '0': '0',
  '1': '0.25rem',  // 4px
  '2': '0.5rem',   // 8px
  '3': '0.75rem',  // 12px
  '4': '1rem',     // 16px
  '5': '1.25rem',  // 20px
  '6': '1.5rem',   // 24px
  '8': '2rem',     // 32px
  '10': '2.5rem',  // 40px
  '12': '3rem',    // 48px
  '16': '4rem',    // 64px
}
```

**Border Radius**

```typescript
borderRadius: {
  'none': '0',
  'sm': '0.25rem',   // 4px
  'DEFAULT': '0.5rem', // 8px
  'md': '0.5rem',    // 8px
  'lg': '0.75rem',   // 12px
  'xl': '1rem',      // 16px
  '2xl': '1.5rem',   // 24px
  '3xl': '2rem',     // 32px
  'full': '9999px',  // Pill shape
}
```

**Shadows**

```typescript
boxShadow: {
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
}
```

**Component Examples**

```typescript
// Primary Button
<Button className="bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg">
  Shop Now
</Button>

// Secondary Button
<Button className="bg-secondary hover:bg-secondary-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300">
  Learn More
</Button>

// Accent Button
<Button className="bg-accent hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300">
  Add to Cart
</Button>

// Card
<Card className="bg-card rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>

// Input
<Input className="border-gray-200 focus:border-primary focus:ring-primary rounded-xl" />

// Badge
<Badge className="bg-accent text-white">New</Badge>
```

### State Management
- **Zustand**: Lightweight state management for global application state
- **React Query (TanStack Query)**: Server state management, caching, and synchronization
- **React Hook Form**: Performant form handling with validation
- **Zod**: Schema validation for forms and API responses

### Routing & Navigation
- **React Router 6+**: Declarative routing with nested routes and lazy loading
- **React Router DOM**: DOM bindings for React Router

### HTTP Client
- **Axios**: Promise-based HTTP client with interceptors
- **React Query**: Built-in data fetching and caching

### Authentication
- **Auth Context**: Custom React context for authentication state
- **JWT Handling**: Token storage, refresh, and validation
- **Protected Routes**: Route guards for authenticated and role-based access

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

## Project Structure

```
technova-store-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── input/
│   │   │   ├── modal/
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   ├── common/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── CartIcon.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── features/
│   │       ├── hero/
│   │       ├── features/
│   │       ├── products/
│   │       └── contact/
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── OrderSuccessPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── FAQPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── CustomersPage.tsx
│   │   │   └── MessagesPage.tsx
│   │   ├── components/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── OrderTable.tsx
│   │   │   └── ProductTable.tsx
│   │   └── hooks/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts           # Axios instance
│   │   │   ├── auth.api.ts
│   │   │   ├── products.api.ts
│   │   │   ├── orders.api.ts
│   │   │   └── users.api.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── helpers.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   ├── useProducts.ts
│   │   │   └── useOrders.ts
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   ├── cartStore.ts
│   │   │   └── uiStore.ts
│   │   ├── constants/
│   │   │   ├── routes.ts
│   │   │   ├── api.ts
│   │   │   └── config.ts
│   │   └── types/
│   │       ├── index.ts
│   │       ├── auth.types.ts
│   │       ├── product.types.ts
│   │       ├── order.types.ts
│   │       └── user.types.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── CartContext.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQuery.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.json
├── .prettierrc
└── README.md
```

## Component Architecture

### Atomic Design Principles
- **Atoms**: Basic UI elements (Button, Input, Icon)
- **Molecules**: Combinations of atoms (SearchBar, ProductCard)
- **Organisms**: Complex UI sections (Header, ProductGrid)
- **Templates**: Page layouts (ShopLayout, AdminLayout)
- **Pages**: Complete page implementations

### Component Best Practices
- Functional components with hooks
- TypeScript for type safety
- Prop interfaces clearly defined
- Single responsibility principle
- Reusable and composable components
- Proper error boundaries

## State Management Strategy

### Global State (Zustand)
```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

// cartStore.ts
interface CartState {
  items: CartItem[];
  total: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// uiStore.ts
interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  cartOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  toggleCart: () => void;
}
```

### Server State (React Query)
```typescript
// Products
const { data: products, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: () => api.products.getAll()
});

// Mutations
const addProductMutation = useMutation({
  mutationFn: api.products.create,
  onSuccess: () => {
    queryClient.invalidateQueries(['products']);
  }
});
```

### Form State (React Hook Form + Zod)
```typescript
const form = useForm<LoginSchema>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: '',
    password: ''
  }
});
```

## Routing Architecture

### Public Routes
- `/` - Landing page
- `/shop` - Product listing
- `/products/:id` - Product details
- `/contact` - Contact page
- `/faq` - FAQ page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Customer)
- `/profile` - User profile
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/orders` - Order history
- `/orders/:id` - Order details

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/customers` - Customer management
- `/admin/messages` - Message center

### Route Guards
```typescript
<ProtectedRoute>
  <CustomerRoute>
    <ProfilePage />
  </CustomerRoute>
</ProtectedRoute>

<ProtectedRoute>
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
</ProtectedRoute>
```

## API Integration

### Axios Configuration
```typescript
// lib/api/client.ts
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token refresh logic
    }
    return Promise.reject(error);
  }
);
```

### API Endpoints Structure
```typescript
// lib/api/products.api.ts
export const productsApi = {
  getAll: (params?: ProductFilters) => 
    axiosInstance.get<Product[]>('/products', { params }),
  
  getById: (id: string) => 
    axiosInstance.get<Product>(`/products/${id}`),
  
  create: (data: CreateProductDto) => 
    axiosInstance.post<Product>('/products', data),
  
  update: (id: string, data: UpdateProductDto) => 
    axiosInstance.patch<Product>(`/products/${id}`, data),
  
  delete: (id: string) => 
    axiosInstance.delete(`/products/${id}`),
  
  search: (query: string) => 
    axiosInstance.get<Product[]>('/products/search', { params: { q: query } })
};
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: Permission[];
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
```

### Permission Checking System

```typescript
// lib/hooks/usePermissions.ts
import { useAuthStore } from '../store/authStore';
import { Permission, ROLE_PERMISSIONS } from '../types/auth.types';

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const isAdmin = (): boolean => {
    return user?.role === UserRole.ADMIN;
  };

  const isCustomer = (): boolean => {
    return user?.role === UserRole.CUSTOMER;
  };

  const isAuthenticated = (): boolean => {
    return !!user;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isCustomer,
    isAuthenticated,
  };
};
```

### Protected Route Components

```typescript
// components/auth/ProtectedRoute.tsx
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { UserRole } from '../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermissions,
  fallback,
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const { hasPermission, hasAllPermissions } = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { redirectTo: window.location.pathname } 
      });
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      navigate('/unauthorized');
      return;
    }

    if (requiredPermissions && !hasAllPermissions(requiredPermissions)) {
      navigate('/unauthorized');
      return;
    }
  }, [isAuthenticated, user, requiredRole, requiredPermissions, navigate]);

  if (!isAuthenticated) {
    return fallback || <LoadingSpinner />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return fallback || <UnauthorizedPage />;
  }

  if (requiredPermissions && !hasAllPermissions(requiredPermissions)) {
    return fallback || <UnauthorizedPage />;
  }

  return <>{children}</>;
};

// Usage examples
<ProtectedRoute requiredRole={UserRole.ADMIN}>
  <AdminDashboard />
</ProtectedRoute>

<ProtectedRoute requiredPermissions={[Permission.MANAGE_PRODUCTS]}>
  <ProductManagement />
</ProtectedRoute>
```

### Role-Based Route Guards

```typescript
// components/auth/RoleRoute.tsx
import { UserRole } from '../types/auth.types';

export const CustomerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
    {children}
  </ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole={UserRole.ADMIN}>
    {children}
  </ProtectedRoute>
);

export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return <>{children}</>;
};
```

### Authentication Flow with Landing Page Entry

**Application Entry Point**

```typescript
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ShopPage } from './pages/ShopPage';
import { ProtectedRoute, CustomerRoute, AdminRoute, GuestRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Landing Page Entry */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        
        {/* Guest Only Routes */}
        <Route 
          path="/login" 
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          } 
        />
        
        {/* Customer Protected Routes */}
        <Route 
          path="/profile" 
          element={
            <CustomerRoute>
              <ProfilePage />
            </CustomerRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <CustomerRoute>
              <CartPage />
            </CustomerRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <CustomerRoute>
              <CheckoutPage />
            </CustomerRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <CustomerRoute>
              <OrderHistoryPage />
            </CustomerRoute>
          } 
        />
        
        {/* Admin Protected Routes */}
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Landing Page Authentication Entry

**Landing Page with Login/Signup Buttons**

```typescript
// pages/LandingPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '../components/auth/AuthModal';

export const LandingPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignupClick = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Redirect based on user role
    const { user } = useAuthStore();
    if (user?.role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header with Auth Buttons */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Phone className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">TechNova</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition">Features</a>
            <a href="#products" className="text-gray-600 hover:text-primary transition">Products</a>
            <a href="#about" className="text-gray-600 hover:text-primary transition">About</a>
            <a href="#contact" className="text-gray-600 hover:text-primary transition">Contact</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleLoginClick}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Login
            </Button>
            <Button 
              onClick={handleSignupClick}
              className="bg-primary hover:bg-primary-600 text-white"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                The Future of Mobile Technology
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Discover premium smartphones and accessories from the world's leading brands
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  onClick={handleSignupClick}
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Get Started
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/shop')}
                  className="border-white text-white hover:bg-white/10"
                >
                  Browse Products
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <Phone className="w-64 h-64 text-white opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        {/* Features content */}
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        {/* Products content */}
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onModeChange={setAuthMode}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};
```

### Auth Modal Component

```typescript
// components/auth/AuthModal.tsx
import { useState } from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onModeChange: (mode: 'login' | 'register') => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  mode,
  onClose,
  onModeChange,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Tab Switcher */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onModeChange('login')}
              className={`flex-1 py-2 px-4 rounded-md transition ${
                mode === 'login' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => onModeChange('register')}
              className={`flex-1 py-2 px-4 rounded-md transition ${
                mode === 'register' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <LoginForm onSuccess={onSuccess} isLoading={isLoading} setIsLoading={setIsLoading} />
          ) : (
            <RegisterForm onSuccess={onSuccess} isLoading={isLoading} setIsLoading={setIsLoading} />
          )}
        </div>
      </div>
    </div>
  );
};
```

### Login Form Component

```typescript
// components/auth/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

interface LoginFormProps {
  onSuccess: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  isLoading,
  setIsLoading,
}) => {
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await login(data);
      onSuccess();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="text-error text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          {...register('password')}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-error text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="/forgot-password" className="text-sm text-primary hover:underline">
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary-600 text-white py-3"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </Button>
      </div>
    </form>
  );
};
```

### Register Form with Role Selection

```typescript
// components/auth/RegisterForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types/auth.types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  role: z.enum([UserRole.CUSTOMER, UserRole.ADMIN]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface RegisterFormProps {
  onSuccess: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  isLoading,
  setIsLoading,
}) => {
  const { register: registerUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      onSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          {...register('name')}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="text-error text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="text-error text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Type
        </label>
        <select
          {...register('role')}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value={UserRole.CUSTOMER}>Customer Account</option>
          <option value={UserRole.ADMIN}>Admin Account</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          {...register('password')}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-error text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          {...register('confirmPassword')}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary-600 text-white py-3"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
};
```

### Auth Store with Role Management

```typescript
// lib/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole, User, Permission, ROLE_PERMISSIONS } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  hasPermission: (permission: Permission) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const response = await authApi.login(credentials);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      register: async (data) => {
        const response = await authApi.register(data);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },

      updateUser: (user) => {
        set({ user });
      },

      hasPermission: (permission: Permission) => {
        const { user } = get();
        if (!user) return false;
        const userPermissions = ROLE_PERMISSIONS[user.role] || [];
        return userPermissions.includes(permission);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
```

### Navigation Based on Role

```typescript
// components/layout/Header.tsx
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/auth.types';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user?.role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Phone className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">TechNova</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/shop" className="text-gray-600 hover:text-primary transition">Shop</a>
          <a href="/about" className="text-gray-600 hover:text-primary transition">About</a>
          <a href="/contact" className="text-gray-600 hover:text-primary transition">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/cart')}>
                <ShoppingCart className="w-5 h-5" />
              </Button>
              <div className="relative group">
                <Button variant="ghost" onClick={handleProfileClick}>
                  <User className="w-5 h-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <div className="p-2">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <div className="mt-2 pt-2 border-t">
                      <Button variant="ghost" className="w-full justify-start" onClick={handleProfileClick}>
                        {user?.role === UserRole.ADMIN ? 'Admin Dashboard' : 'Profile'}
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy loading for pages
const ShopPage = lazy(() => import('./pages/ShopPage'));
const AdminDashboard = lazy(() => import('./admin/pages/DashboardPage'));

// Route-based code splitting
<Route path="/shop" element={
  <Suspense fallback={<LoadingSpinner />}>
    <ShopPage />
  </Suspense>
} />
```

### Image Optimization
- Use Next.js Image component or react-image
- Lazy loading for below-the-fold images
- WebP format with fallbacks
- Responsive images with srcset

### Bundle Optimization
- Tree shaking with Vite
- Dynamic imports for heavy libraries
- Analyze bundle size with Rollup plugin
- Minification in production

### Caching Strategy
- React Query caching for API responses
- Local storage for user preferences
- Session storage for temporary data
- Service worker for offline support

## Responsive Design

### Breakpoints
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    }
  }
}
```

### Mobile-First Approach
- Design for mobile first
- Progressive enhancement for larger screens
- Touch-friendly interface elements
- Optimized images for mobile

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance (WCAG 2.1)

## Security Best Practices

### Client-Side Security
- XSS prevention with React's built-in escaping
- CSRF protection with tokens
- Secure storage of sensitive data
- Input validation and sanitization
- Content Security Policy (CSP)

### API Security
- HTTPS only in production
- Token-based authentication
- Request rate limiting
- Input validation on client side
- Error handling without exposing sensitive info

## Testing Strategy

### Unit Testing
- Vitest for unit tests
- React Testing Library for component tests
- Test hooks and utilities
- Mock API calls

### Integration Testing
- Test component interactions
- Test routing and navigation
- Test form submissions
- Test authentication flow

### E2E Testing
- Playwright for end-to-end tests
- Critical user flows
- Cross-browser testing
- Mobile testing

## Development Workflow

### Git Workflow
- Feature branches for new features
- Pull requests for code review
- Main branch for production
- Develop branch for staging

### Code Quality
- ESLint for linting
- Prettier for formatting
- Husky for git hooks
- lint-staged for pre-commit checks
- TypeScript for type safety

### Environment Variables
```bash
# .env.development
VITE_API_URL=http://localhost:5000/api/v1
VITE_ENABLE_DEVTOOLS=true

# .env.production
VITE_API_URL=https://api.technovamobile.com/api/v1
VITE_ENABLE_DEVTOOLS=false
```

## Deployment Strategy

### Build Process
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Options
- Vercel (recommended for React)
- Netlify
- AWS S3 + CloudFront
- Docker containers

### CI/CD Pipeline
- GitHub Actions for CI/CD
- Automated testing on push
- Automatic deployment on merge to main
- Rollback capabilities

## Monitoring & Analytics

### Error Tracking
- Sentry for error monitoring
- LogRocket for session replay
- Custom error boundaries

### Performance Monitoring
- Web Vitals tracking
- Lighthouse CI
- Custom performance metrics

### User Analytics
- Google Analytics 4
- Custom event tracking
- User behavior analysis

## Progressive Web App (PWA)

### PWA Features
- Service worker for offline support
- Web app manifest
- Push notifications
- Background sync
- Install prompts

### Implementation
- Vite PWA plugin
- Offline fallback pages
- Cache strategies
- Update management

## Internationalization (i18n)

### Multi-language Support
- react-i18next for translations
- Language switcher component
- RTL support for Arabic/Hebrew
- Currency formatting
- Date/time localization

## Future Enhancements

### Advanced Features
- Real-time updates with WebSockets
- Voice search integration
- AR product visualization
- AI-powered recommendations
- Advanced filtering and sorting

### Performance Enhancements
- Server-side rendering (SSR) with Next.js
- Edge computing with Cloudflare Workers
- CDN for static assets
- Database query optimization

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Project setup with Vite + React + TypeScript
- TailwindCSS + shadcn/ui setup
- Basic routing structure
- Authentication context and hooks
- API client configuration

### Phase 2: Core Components (Week 3-4)
- Layout components (Header, Footer, Sidebar)
- UI component library setup
- Form components with validation
- Product card and grid components
- Cart components

### Phase 3: Public Pages (Week 5-6)
- Landing page implementation
- Shop page with filtering
- Product detail page
- Contact page
- FAQ page

### Phase 4: Customer Features (Week 7-8)
- User authentication pages
- Shopping cart functionality
- Checkout process
- Order history
- User profile management

### Phase 5: Admin Dashboard (Week 9-10)
- Admin layout and navigation
- Product management interface
- Order management system
- Customer management
- Analytics dashboard

### Phase 6: Advanced Features (Week 11-12)
- Search functionality
- Wishlist feature
- Product comparison
- Review and rating system
- Notification system

### Phase 7: Polish & Optimization (Week 13-14)
- Performance optimization
- Responsive design refinement
- Accessibility improvements
- Testing and bug fixes
- Documentation

This architecture provides a solid foundation for building a modern, scalable, and maintainable frontend for the TechNova Mobile Store.
