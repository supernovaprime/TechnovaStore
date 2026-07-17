# Admin Dashboard Implementation Prompt

**Project**: TechNova Mobile Store - Admin Dashboard Enhancement  
**Reference**: FRONTEND_ARCHITECTURE.md, BACKEND_IMPLEMENTATION_PROGRESS.md  
**Current Status**: Basic Dashboard Implemented (30% Complete)  
**Goal**: Production-Ready Admin Dashboard with Full Feature Set

---

## CURRENT IMPLEMENTATION STATUS

**Already Implemented**:
- ✅ Basic AdminDashboard.tsx with sidebar navigation
- ✅ Top navbar with search and user profile
- ✅ Stats cards (Total Inventory Value, Active Users, Total Orders, System Status)
- ✅ Recent activity table
- ✅ Basic stock trends chart (SVG-based)
- ✅ Responsive layout with sidebar toggle
- ✅ Loading states and error handling
- ✅ API integration with /api/v1/analytics/dashboard
- ✅ Authentication integration with useAuth context

**Scaffolded Components (Not Implemented)**:
- ❌ AdminLayout.tsx - Separate layout component
- ❌ AdminSidebar.tsx - Separate sidebar component
- ❌ StatsCard.tsx - Reusable stats card component
- ❌ OrderTable.tsx - Order table component
- ❌ ProductTable.tsx - Product table component
- ❌ DashboardPage.tsx - Separate dashboard page
- ❌ ProductsPage.tsx - Product management page
- ❌ OrdersPage.tsx - Order management page
- ❌ CustomersPage.tsx - Customer management page
- ❌ MessagesPage.tsx - Message center page

**Missing Features**:
- ❌ Advanced analytics with proper chart library
- ❌ Data filtering and sorting in tables
- ❌ Export functionality for data
- ❌ Real-time updates (WebSocket/polling)
- ❌ Proper routing between admin pages
- ❌ CRUD operations for products, orders, customers
- ❌ Advanced search functionality
- ❌ Settings management page
- ❌ Notification system integration

---

## IMPLEMENTATION REQUIREMENTS

### Phase 1: Component Extraction & Modularization

**CRITICAL**: Extract inline components into separate, reusable files

#### 1.1 AdminLayout Component
- Extract layout logic from AdminDashboard.tsx
- Create separate AdminLayout.tsx component
- Include sidebar, top navbar, and main content area
- Add responsive behavior and mobile menu
- Implement proper routing with Outlet

**File**: `frontend/src/pages/admin/components/AdminLayout.tsx`
```typescript
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopNav } from './AdminTopNav'

export function AdminLayout() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <AdminSidebar />
      <div className="ml-64">
        <AdminTopNav />
        <main className="pt-24 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

#### 1.2 AdminSidebar Component
- Extract sidebar from AdminDashboard.tsx
- Create separate AdminSidebar.tsx component
- Implement proper navigation with React Router
- Add active state management
- Include collapsible functionality
- Add user profile section

**File**: `frontend/src/pages/admin/components/AdminSidebar.tsx`
```typescript
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Gauge, Boxes, Users, ShoppingCart, BarChart3, Settings, PanelLeftClose, PanelLeft } from 'lucide-react'

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/admin' },
  { icon: Boxes, label: 'Inventory', path: '/admin/products' },
  { icon: Users, label: 'Users', path: '/admin/customers' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
]

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  return (
    <aside className={`h-screen fixed left-0 top-0 bg-secondary shadow-xl flex flex-col z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} rounded-3xl`}>
      {/* Sidebar content */}
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            location.pathname === item.path ? 'bg-white text-secondary' : 'text-white/80 hover:bg-white/10'
          }`}
        >
          <item.icon className="w-5 h-5" />
          {isOpen && <span>{item.label}</span>}
        </Link>
      ))}
    </aside>
  )
}
```

#### 1.3 StatsCard Component
- Extract stats card logic from AdminDashboard.tsx
- Create reusable StatsCard.tsx component
- Support different icon types and colors
- Add trend indicators
- Include loading states

**File**: `frontend/src/pages/admin/components/StatsCard.tsx`
```typescript
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendColor?: string
  status?: string
  statusColor?: string
  loading?: boolean
}

export function StatsCard({ title, value, icon: Icon, trend, trendColor, status, statusColor, loading }: StatsCardProps) {
  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/60">
        <div className="h-5 w-5 rounded bg-outline/20 animate-pulse" />
        <div className="h-4 w-24 rounded bg-outline/20 animate-pulse mt-2" />
        <div className="h-6 w-16 rounded bg-outline/20 animate-pulse mt-2" />
      </div>
    )
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-xl shadow-primary/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="bg-primary/10 p-2 rounded-lg text-primary">
          <Icon className="w-5 h-5" />
        </span>
        {status && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor}`}>
            {status}
          </span>
        )}
      </div>
      <p className="text-label-sm text-outline-variant mt-2">{title}</p>
      <p className="text-headline-md font-bold text-on-surface mt-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {trend && (
        <p className={`text-xs mt-2 ${trendColor}`}>{trend}</p>
      )}
    </div>
  )
}
```

#### 1.4 AdminTopNav Component
- Extract top navbar from AdminDashboard.tsx
- Create separate AdminTopNav.tsx component
- Include search functionality
- Add notification bell with count
- Include user profile dropdown
- Add help button

**File**: `frontend/src/pages/admin/components/AdminTopNav.tsx`
```typescript
import { Bell, HelpCircle, Search } from 'lucide-react'
import { useState } from 'react'

export function AdminTopNav() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="fixed top-4 right-4 bg-white/80 backdrop-blur-xl border border-outline-variant/60 rounded-2xl z-40 h-16 flex items-center px-6 justify-between shadow-lg">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary/20"
            placeholder="Search administrative records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary-container rounded-full" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
```

---

### Phase 2: Dashboard Page Enhancement

**CRITICAL**: Enhance existing dashboard with proper routing and advanced features

#### 2.1 Separate DashboardPage Component
- Move dashboard logic from AdminDashboard.tsx to DashboardPage.tsx
- Use extracted components (AdminLayout, StatsCard, etc.)
- Add proper data fetching hooks
- Implement real-time updates
- Add advanced charts with chart library

**File**: `frontend/src/pages/admin/DashboardPage.tsx`
```typescript
import { useDashboardStats } from '../hooks/useDashboardStats'
import { StatsCard } from '../components/StatsCard'
import { RecentActivityTable } from '../components/RecentActivityTable'
import { StockTrendsChart } from '../components/StockTrendsChart'
import { Wallet, Users, ShoppingCart, CheckCircle } from 'lucide-react'

export function DashboardPage() {
  const { stats, loading, error } = useDashboardStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-on-surface">System Overview</h2>
        <span className="text-label-sm text-outline">Last updated: Just now</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Inventory Value"
          value={stats?.inventoryValue || 0}
          icon={Wallet}
          status="Live"
          statusColor="text-green-600 bg-green-50"
          loading={loading}
        />
        <StatsCard
          title="Active Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          status="Active"
          statusColor="text-primary bg-primary-fixed-dim/20"
          loading={loading}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
          status="Total"
          statusColor="text-white bg-tertiary-container"
          loading={loading}
        />
        <StatsCard
          title="System Status"
          value={`${stats?.pendingOrders || 0} pending`}
          icon={CheckCircle}
          status="Stable"
          statusColor="text-green-600 bg-green-50"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityTable activities={stats?.recentActivities || []} loading={loading} />
        <StockTrendsChart />
      </div>
    </div>
  )
}
```

#### 2.2 Custom Hooks for Data Fetching
- Create useDashboardStats hook
- Implement proper error handling
- Add caching and refetching
- Include loading states

**File**: `frontend/src/pages/admin/hooks/useDashboardStats.ts`
```typescript
import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  inventoryValue: number
  recentOrders: any[]
  lowStockProducts: any[]
  pendingOrders: number
  recentActivities: any[]
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/v1/analytics/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (!response.ok) throw new Error('Failed to fetch dashboard stats')
        
        const data = await response.json()
        setStats(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchStats()
  }, [token])

  return { stats, loading, error }
}
```

#### 2.3 Advanced Chart Implementation
- Install and configure Recharts or Chart.js
- Replace SVG chart with proper chart library
- Add interactive features (zoom, tooltips)
- Implement multiple chart types
- Add date range filters

**Install dependencies**:
```bash
npm install recharts
```

**File**: `frontend/src/pages/admin/components/StockTrendsChart.tsx`
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', stock: 150 },
  { month: 'Feb', stock: 130 },
  { month: 'Mar', stock: 160 },
  { month: 'Apr', stock: 110 },
  { month: 'May', stock: 140 },
  { month: 'Jun', stock: 80 },
]

export function StockTrendsChart() {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl p-6">
      <h3 className="font-headline-sm text-on-surface mb-4">Stock Level Trends</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="stock" stroke="#2563EB" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

---

### Phase 3: Product Management Page

**CRITICAL**: Implement complete product management CRUD operations

#### 3.1 ProductsPage Component
- Create ProductsPage.tsx with full CRUD functionality
- Implement product listing with ProductTable
- Add product creation modal
- Include product editing functionality
- Add product deletion with confirmation
- Implement search and filter
- Add bulk actions

**File**: `frontend/src/pages/admin/ProductsPage.tsx`
```typescript
import { useState } from 'react'
import { ProductTable } from '../components/ProductTable'
import { Button } from '../../../components/ui/button'
import { Plus, Search, Filter } from 'lucide-react'

export function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-on-surface">Product Management</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <ProductTable
        searchQuery={searchQuery}
        selectedProducts={selectedProducts}
        onSelectProducts={setSelectedProducts}
      />

      {showCreateModal && (
        <ProductCreateModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}
```

#### 3.2 ProductTable Component
- Create reusable ProductTable component
- Implement sorting and filtering
- Add pagination
- Include row selection
- Add action buttons (edit, delete)
- Show product images and details

**File**: `frontend/src/pages/admin/components/ProductTable.tsx`
```typescript
import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'

interface Product {
  _id: string
  name: string
  price: number
  stock: number
  category: string
  brand: string
  status: string
}

interface ProductTableProps {
  searchQuery: string
  selectedProducts: string[]
  onSelectProducts: (ids: string[]) => void
}

export function ProductTable({ searchQuery, selectedProducts, onSelectProducts }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products logic here

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input type="checkbox" />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectProducts([...selectedProducts, product._id])
                    } else {
                      onSelectProducts(selectedProducts.filter(id => id !== product._id))
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container rounded-lg" />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-outline-variant">{product.brand}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                  {product.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

#### 3.3 Product Create/Edit Modal
- Create ProductCreateModal component
- Implement form validation with Zod
- Add image upload with Cloudinary
- Include category and brand selection
- Add price and stock management
- Implement form submission

**File**: `frontend/src/pages/admin/components/ProductCreateModal.tsx`
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be positive'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

interface ProductCreateModalProps {
  onClose: () => void
}

export function ProductCreateModal({ onClose }: ProductCreateModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema)
  })

  const onSubmit = async (data: any) => {
    // Submit logic here
    console.log(data)
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields here */}
          <button type="submit">Create Product</button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

---

### Phase 4: Order Management Page

**CRITICAL**: Implement complete order management with status tracking

#### 4.1 OrdersPage Component
- Create OrdersPage.tsx with order listing
- Implement OrderTable component
- Add order status management
- Include order details view
- Implement order filtering (status, date, customer)
- Add bulk order actions

**File**: `frontend/src/pages/admin/OrdersPage.tsx`
```typescript
import { useState } from 'react'
import { OrderTable } from '../components/OrderTable'
import { Button } from '../../../components/ui/button'
import { Filter, Download } from 'lucide-react'

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-on-surface">Order Management</h2>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Orders
        </Button>
      </div>

      <div className="flex gap-4">
        <select
          className="px-4 py-2 bg-surface-container rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Date Range
        </Button>
      </div>

      <OrderTable statusFilter={statusFilter} />
    </div>
  )
}
```

#### 4.2 OrderTable Component
- Create OrderTable with order details
- Implement status badges
- Add customer information
- Include order total and items
- Add action buttons (view, edit status, delete)
- Implement pagination

**File**: `frontend/src/pages/admin/components/OrderTable.tsx`
```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Button } from '../../../components/ui/button'
import { Eye, Edit, Trash2 } from 'lucide-react'

interface Order {
  _id: string
  orderNumber: string
  customer: { name: string; email: string }
  total: number
  status: string
  createdAt: string
}

interface OrderTableProps {
  statusFilter: string
}

export function OrderTable({ statusFilter }: OrderTableProps) {
  const [orders, setOrders] = useState<Order[]>([])

  // Fetch orders logic here

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-outline-variant">{order.customer.email}</p>
                </div>
              </TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

---

### Phase 5: Customer Management Page

**CRITICAL**: Implement customer management with user actions

#### 5.1 CustomersPage Component
- Create CustomersPage.tsx with customer listing
- Implement CustomerTable component
- Add customer search and filter
- Include customer actions (edit, delete, ban)
- Add customer details view
- Implement user role management

**File**: `frontend/src/pages/admin/CustomersPage.tsx`
```typescript
import { useState } from 'react'
import { CustomerTable } from '../components/CustomerTable'
import { Button } from '../../../components/ui/button'
import { Search, UserPlus } from 'lucide-react'

export function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-on-surface">Customer Management</h2>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 bg-surface-container rounded-lg"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <CustomerTable searchQuery={searchQuery} roleFilter={roleFilter} />
    </div>
  )
}
```

#### 5.2 CustomerTable Component
- Create CustomerTable with user details
- Implement role badges
- Add account status indicators
- Include registration date
- Add action buttons (edit, delete, ban)
- Implement pagination

**File**: `frontend/src/pages/admin/components/CustomerTable.tsx`
```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Button } from '../../../components/ui/button'
import { Edit, Trash2, Shield, Ban } from 'lucide-react'

interface Customer {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  totalOrders: number
}

interface CustomerTableProps {
  searchQuery: string
  roleFilter: string
}

export function CustomerTable({ searchQuery, roleFilter }: CustomerTableProps) {
  const [customers, setCustomers] = useState<Customer[]>([])

  // Fetch customers logic here

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer._id}>
              <TableCell>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-outline-variant">{customer.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${customer.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {customer.role}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {customer.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>{customer.totalOrders}</TableCell>
              <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Ban className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

---

### Phase 6: Messages/Notifications Page

**CRITICAL**: Implement message center for customer communications

#### 6.1 MessagesPage Component
- Create MessagesPage.tsx with message listing
- Implement MessageTable component
- Add message composition
- Include message filtering (read/unread, priority)
- Add bulk actions (mark read, delete)
- Implement message threading

**File**: `frontend/src/pages/admin/MessagesPage.tsx`
```typescript
import { useState } from 'react'
import { MessageTable } from '../components/MessageTable'
import { Button } from '../../../components/ui/button'
import { MessageSquare, Filter } from 'lucide-react'

export function MessagesPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-on-surface">Message Center</h2>
        <Button>
          <MessageSquare className="w-4 h-4 mr-2" />
          Compose Message
        </Button>
      </div>

      <div className="flex gap-4">
        <select
          className="px-4 py-2 bg-surface-container rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
        <select
          className="px-4 py-2 bg-surface-container rounded-lg"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      <MessageTable statusFilter={statusFilter} priorityFilter={priorityFilter} />
    </div>
  )
}
```

---

### Phase 7: Routing Configuration

**CRITICAL**: Set up proper routing for all admin pages

#### 7.1 Admin Routes Setup
- Configure React Router for admin pages
- Add protected routes with AdminRoute
- Implement lazy loading for performance
- Add route transitions
- Handle 404 for admin routes

**File**: `frontend/src/App.tsx` (update existing routing)
```typescript
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminRoute } from './components/auth/ProtectedRoute'
import { AdminLayout } from './pages/admin/components/AdminLayout'

const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const ProductsPage = lazy(() => import('./pages/admin/ProductsPage'))
const OrdersPage = lazy(() => import('./pages/admin/OrdersPage'))
const CustomersPage = lazy(() => import('./pages/admin/CustomersPage'))
const MessagesPage = lazy(() => import('./pages/admin/MessagesPage'))

function App() {
  return (
    <Routes>
      {/* Existing routes */}
      
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
```

---

### Phase 8: API Integration

**CRITICAL**: Implement proper API calls for all admin operations

#### 8.1 Admin API Client
- Create admin-specific API functions
- Implement proper error handling
- Add request/response interceptors
- Include loading states
- Add caching strategies

**File**: `frontend/src/lib/api/admin.api.ts`
```typescript
import axios from 'axios'

const adminApi = axios.create({
  baseURL: '/api/v1/admin',
})

// Request interceptor
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const adminAPI = {
  // Products
  getProducts: (params?: any) => adminApi.get('/products', { params }),
  createProduct: (data: any) => adminApi.post('/products', data),
  updateProduct: (id: string, data: any) => adminApi.put(`/products/${id}`, data),
  deleteProduct: (id: string) => adminApi.delete(`/products/${id}`),
  
  // Orders
  getOrders: (params?: any) => adminApi.get('/orders', { params }),
  updateOrderStatus: (id: string, status: string) => adminApi.patch(`/orders/${id}/status`, { status }),
  
  // Customers
  getCustomers: (params?: any) => adminApi.get('/users', { params }),
  updateCustomer: (id: string, data: any) => adminApi.put(`/users/${id}`, data),
  deleteCustomer: (id: string) => adminApi.delete(`/users/${id}`),
  
  // Messages
  getMessages: (params?: any) => adminApi.get('/messages', { params }),
  createMessage: (data: any) => adminApi.post('/messages', data),
  updateMessageStatus: (id: string, status: string) => adminApi.patch(`/messages/${id}/status`, { status }),
}
```

---

## IMPLEMENTATION ORDER

### Phase 1: Component Extraction (Priority: CRITICAL)
1. Extract AdminLayout component
2. Extract AdminSidebar component
3. Extract AdminTopNav component
4. Extract StatsCard component
5. Extract RecentActivityTable component
6. Extract StockTrendsChart component

### Phase 2: Dashboard Enhancement (Priority: CRITICAL)
1. Create separate DashboardPage component
2. Implement useDashboardStats hook
3. Install and configure Recharts
4. Replace SVG chart with Recharts
5. Add real-time updates
6. Implement proper routing

### Phase 3: Product Management (Priority: HIGH)
1. Create ProductsPage component
2. Create ProductTable component
3. Create ProductCreateModal component
4. Implement product CRUD operations
5. Add search and filter functionality
6. Implement image upload

### Phase 4: Order Management (Priority: HIGH)
1. Create OrdersPage component
2. Create OrderTable component
3. Implement order status management
4. Add order filtering
5. Implement export functionality
6. Add order details view

### Phase 5: Customer Management (Priority: HIGH)
1. Create CustomersPage component
2. Create CustomerTable component
3. Implement user role management
4. Add customer search and filter
5. Implement user actions (edit, delete, ban)
6. Add customer details view

### Phase 6: Message Center (Priority: MEDIUM)
1. Create MessagesPage component
2. Create MessageTable component
3. Implement message composition
4. Add message filtering
5. Implement message threading
6. Add bulk actions

### Phase 7: API Integration (Priority: CRITICAL)
1. Create admin API client
2. Implement request/response interceptors
3. Add proper error handling
4. Implement loading states
5. Add caching strategies

### Phase 8: Advanced Features (Priority: LOW)
1. Implement real-time updates with WebSocket
2. Add advanced analytics page
3. Create settings management page
4. Implement data export functionality
5. Add notification system integration

---

## QUALITY GATES

**Before Considered Complete**:
- [ ] All components extracted and modularized
- [ ] Proper routing configured for all admin pages
- [ ] All CRUD operations functional
- [ ] Tables support sorting, filtering, and pagination
- [ ] Forms properly validated with Zod
- [ ] Error handling comprehensive
- [ ] Loading states implemented
- [ ] API integration complete
- [ ] Responsive design maintained
- [ ] Accessibility standards met

---

## CRITICAL NOTES

1. **Maintain Existing Design** - Keep the current design system and color palette
2. **Use Existing Components** - Leverage shadcn/ui components where possible
3. **Follow Existing Patterns** - Maintain consistency with current codebase
4. **TypeScript Strict Mode** - Maintain strict type checking
5. **Error Handling** - Comprehensive error handling for all operations
6. **Loading States** - Proper loading states for all async operations
7. **Responsive Design** - Ensure all components work on mobile devices
8. **Accessibility** - Follow WCAG guidelines for accessibility
9. **Performance** - Implement lazy loading and code splitting
10. **Security** - Maintain proper authentication and authorization

---

## EXPECTED DELIVERABLES

### Critical Deliverables (Required)
1. AdminLayout.tsx component
2. AdminSidebar.tsx component
3. AdminTopNav.tsx component
4. StatsCard.tsx component
5. DashboardPage.tsx component
6. ProductsPage.tsx component
7. ProductTable.tsx component
8. OrdersPage.tsx component
9. OrderTable.tsx component
10. CustomersPage.tsx component
11. CustomerTable.tsx component
12. MessagesPage.tsx component
13. Proper routing configuration
14. Admin API client

### Important Deliverables (High Priority)
15. ProductCreateModal component
16. MessageTable component
17. useDashboardStats hook
18. Advanced charts with Recharts
19. Search and filter functionality
20. Export functionality

### Optional Deliverables (Enhancement)
21. AnalyticsPage.tsx component
22. SettingsPage.tsx component
23. Real-time updates with WebSocket
24. Advanced notification system
25. Data export functionality

---

## IMMEDIATE ACTION ITEMS

**Start with these first**:
1. Extract AdminLayout component from AdminDashboard.tsx
2. Extract AdminSidebar component
3. Extract AdminTopNav component
4. Extract StatsCard component
5. Create separate DashboardPage component
6. Install Recharts for advanced charts
7. Configure proper routing with AdminLayout
8. Create ProductsPage component
9. Create ProductTable component
10. Implement admin API client

---

Start implementation immediately following this exact specification. Prioritize component extraction, proper routing, and core CRUD operations to achieve a production-ready admin dashboard. All implementations must follow best practices and maintain the existing codebase quality standards.
