import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DeactivatedPage from './pages/DeactivatedPage'
import AdminLayout from './layouts/AdminLayout'
import CustomerLayout from './layouts/CustomerLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import ManagerProfilePage from './pages/manager/ManagerProfilePage'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import ProductsPage from './pages/customer/ProductsPage'
import CartPage from './pages/customer/CartPage'
import CustomerOrdersPage from './pages/customer/CustomerOrdersPage'
import WishlistPage from './pages/customer/WishlistPage'
import CustomerProfilePage from './pages/customer/CustomerProfilePage'
import InventoryPage from './pages/admin/InventoryPage'
import UsersPage from './pages/admin/UsersPage'
import OrdersPage from './pages/admin/OrdersPage'
import AnalyticsPage from './pages/admin/AnalyticsPage'
import SettingsPage from './pages/admin/SettingsPage'
import AuditLogsPage from './pages/admin/AuditLogsPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function RoleDashboard() {
  const { user } = useAuth()
  if (user?.role === 'manager') return <ManagerDashboard />
  return <AdminDashboard />
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/deactivated" element={<DeactivatedPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RoleDashboard />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ManagerProfilePage />} />
          <Route path="audit" element={<AuditLogsPage />} />
        </Route>
        <Route
          path="/customer"
          element={
            <ProtectedRoute requiredRoles={['customer']}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
    </AuthProvider>
  )
}

export default App
