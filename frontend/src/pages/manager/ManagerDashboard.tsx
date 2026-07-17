import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, ShoppingCart, CheckCircle, AlertTriangle, Plus,
  RefreshCw, Layers, FolderTree, Building2, Clock, ArrowRight, Heart
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AddProductModal from '../admin/AddProductModal'
import AddCategoryModal from '../admin/AddCategoryModal'
import AddBrandModal from '../admin/AddBrandModal'

interface LowStockItem {
  id: string
  name: string
  stock: number
  threshold: number
}

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  inventoryValue: number
  pendingOrders: number
  lowStockProducts: LowStockItem[]
  recentOrders: any[]
}

const mockStats: DashboardStats = {
  totalProducts: 420,
  totalOrders: 1850,
  inventoryValue: 125840,
  pendingOrders: 14,
  lowStockProducts: [
    { id: '1', name: 'iPhone 15 Pro Max', stock: 2, threshold: 5 },
    { id: '2', name: 'Galaxy S24 Ultra', stock: 4, threshold: 10 },
    { id: '3', name: 'MacBook Air M3', stock: 1, threshold: 4 }
  ],
  recentOrders: []
}

function ManagerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [totalProductsFromDb, setTotalProductsFromDb] = useState<number | null>(null)
  const [totalOrdersFromDb, setTotalOrdersFromDb] = useState<number | null>(null)
  const [lowStockProductsFromDb, setLowStockProductsFromDb] = useState<LowStockItem[] | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddBrand, setShowAddBrand] = useState(false)
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const [pinnedWidgets, setPinnedWidgets] = useState<Record<string, boolean>>({
    inventory: false,
    orders: false,
    lowStock: false,
    actions: false,
    recent: false
  })

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPinnedWidgets(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const fetchStats = async () => {
    setLoading(true)
    setError('')
    try {
      const [dashboardRes, productsRes, ordersRes, lowStockRes] = await Promise.all([
        fetch('/api/v1/analytics/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/v1/products?limit=1', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/v1/orders?limit=1', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/v1/products?limit=100', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (dashboardRes.status === 401 || productsRes.status === 401 || ordersRes.status === 401) {
        logout()
        navigate('/login', { replace: true })
        return
      }

      if (!dashboardRes.ok) throw new Error('API server returned an error')

      const dashboardData = await dashboardRes.json()
      setStats(dashboardData.data)

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setTotalProductsFromDb(productsData.pagination?.total || productsData.data?.length || 0)
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setTotalOrdersFromDb(ordersData.pagination?.total || ordersData.data?.length || 0)
      }

      if (lowStockRes.ok) {
        const lowStockData = await lowStockRes.json()
        const allProducts = lowStockData.data || lowStockData.products || []
        const lowStock = allProducts
          .filter((p: any) => p.stockQuantity < 10 && p.isActive !== false)
          .slice(0, 3)
          .map((p: any) => ({
            id: p._id,
            name: p.name,
            stock: p.stockQuantity,
            threshold: 10
          }))
        setLowStockProductsFromDb(lowStock)
      }

      setIsDemoMode(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load live data')
      setIsDemoMode(true)
      setStats(mockStats)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchStats()
    } else {
      setLoading(false)
      setIsDemoMode(true)
      setStats(mockStats)
    }
  }, [token])

  const displayProducts = totalProductsFromDb ?? stats?.totalProducts ?? 0
  const displayOrders = totalOrdersFromDb ?? stats?.totalOrders ?? 0
  const displayLowStock = lowStockProductsFromDb ?? stats?.lowStockProducts ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-text font-heading tracking-tight">Manager Dashboard</h2>
          <p className="text-xs text-text-muted mt-0.5">Oversee products, inventory channels, and order fulfillment</p>
        </div>
        <div className="flex items-center gap-2">
          {isDemoMode && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              Demo Preview Mode
            </span>
          )}
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl bg-white/70 border border-outlineVariant/40 text-text-muted hover:text-primary hover:border-primary/40 transition-all duration-200 shadow-sm active:scale-95"
            title="Refresh Diagnostics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && !isDemoMode && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-sm font-bold text-rose-700">API Connection Offline</p>
              <p className="text-xs text-rose-600/80">{error}</p>
            </div>
          </div>
          <button
            onClick={() => { setError(''); setIsDemoMode(true); setStats(mockStats) }}
            className="text-xs font-bold bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors flex-shrink-0"
          >
            Load Simulated Data
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[auto]">
        {loading ? (
          <>
            <div className="col-span-1 lg:col-span-2 h-[200px] bg-white/40 rounded-3xl border border-outlineVariant/30 animate-pulse" />
            <div className="col-span-1 h-[200px] bg-white/40 rounded-3xl border border-outlineVariant/30 animate-pulse" />
            <div className="col-span-1 lg:row-span-2 h-[424px] bg-white/40 rounded-3xl border border-outlineVariant/30 animate-pulse" />
            <div className="col-span-1 h-[200px] bg-white/40 rounded-3xl border border-outlineVariant/30 animate-pulse" />
            <div className="col-span-1 lg:col-span-2 h-[200px] bg-white/40 rounded-3xl border border-outlineVariant/30 animate-pulse" />
          </>
        ) : stats ? (
          <>
            <div className={`col-span-1 lg:col-span-2 bg-white/70 backdrop-blur-xl p-6 rounded-3xl border ${pinnedWidgets.inventory ? 'ring-2 ring-primary border-primary/30' : 'border-outlineVariant/40'} shadow-xl shadow-primary/5 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative`}>
              <button 
                onClick={(e) => togglePin('inventory', e)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/10 hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Heart className={`w-3.5 h-3.5 transition-colors ${pinnedWidgets.inventory ? 'fill-rose-500 text-rose-500' : 'text-slate-300 group-hover:text-rose-400'}`} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary/10 p-2 rounded-xl"><Package className="w-5 h-5 text-primary" /></span>
                  <span className="text-[10px] font-bold text-success bg-success/10 px-2.5 py-0.5 rounded-full">System Live</span>
                </div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Product Items</p>
                <p className="text-3xl font-black text-text tracking-tight mt-1">{displayProducts} {displayProducts === 1 ? 'Product' : 'Products'}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-outlineVariant/20 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Inventory Value</p>
                  <p className="text-base font-black text-text mt-0.5">GHS {stats.inventoryValue.toLocaleString()}</p>
                </div>
                <div className="w-1/3 h-10">
                  <svg className="w-full h-full text-primary stroke-2 fill-none overflow-visible" viewBox="0 0 100 30">
                    <path d="M0,25 Q15,5 30,22 T60,10 T90,5 T100,12" />
                  </svg>
                </div>
              </div>
            </div>

            <div className={`col-span-1 bg-white/70 backdrop-blur-xl p-6 rounded-3xl border ${pinnedWidgets.orders ? 'ring-2 ring-primary border-primary/30' : 'border-outlineVariant/40'} shadow-xl shadow-primary/5 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative`}>
              <button 
                onClick={(e) => togglePin('orders', e)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/10 hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Heart className={`w-3.5 h-3.5 transition-colors ${pinnedWidgets.orders ? 'fill-rose-500 text-rose-500' : 'text-slate-300 group-hover:text-rose-400'}`} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-amber-100 p-2 rounded-xl text-amber-600"><ShoppingCart className="w-5 h-5" /></span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">Fulfillment</span>
                </div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Orders</p>
                <p className="text-3xl font-black text-text mt-1">{displayOrders}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-outlineVariant/20">
                <div className="flex justify-between items-center text-[10px] font-semibold text-text-muted mb-1">
                  <span>BACKLOG MONITOR</span>
                  <span className="text-amber-600">{stats.pendingOrders} pending</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.min((stats.pendingOrders / Math.max(stats.totalOrders || 1, 1)) * 100, 100)}%` }} />
                </div>
              </div>
            </div>

            <div className={`col-span-1 lg:row-span-2 bg-white/70 backdrop-blur-xl rounded-3xl border ${pinnedWidgets.recent ? 'ring-2 ring-primary border-primary/30' : 'border-outlineVariant/40'} shadow-xl shadow-primary/5 flex flex-col group hover:-translate-y-1 transition-all duration-300 relative`}>
              <button 
                onClick={(e) => togglePin('recent', e)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/10 hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Heart className={`w-3.5 h-3.5 transition-colors ${pinnedWidgets.recent ? 'fill-rose-500 text-rose-500' : 'text-slate-300 group-hover:text-rose-400'}`} />
              </button>
              <div className="px-5 py-4 border-b border-outlineVariant/30">
                <h3 className="text-xs font-bold text-text font-heading flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-primary" />
                  Recent Orders
                </h3>
              </div>
              <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-3 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-text-muted/30" />
                </div>
                <p className="text-xs text-text-muted font-bold">No Recent Backlog</p>
                <p className="text-[10px] text-text-muted/60 mt-0.5 max-w-[150px]">All inbound orders fully verified</p>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="mt-5 text-[10px] font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  View Order Directory <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className={`col-span-1 bg-white/70 backdrop-blur-xl rounded-3xl border ${pinnedWidgets.lowStock ? 'ring-2 ring-primary border-primary/30' : 'border-outlineVariant/40'} shadow-xl shadow-primary/5 flex flex-col group hover:-translate-y-1 transition-all duration-300 relative`}>
              <button 
                onClick={(e) => togglePin('lowStock', e)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/10 hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Heart className={`w-3.5 h-3.5 transition-colors ${pinnedWidgets.lowStock ? 'fill-rose-500 text-rose-500' : 'text-slate-300 group-hover:text-rose-400'}`} />
              </button>
              <div className="px-5 py-4 border-b border-outlineVariant/30">
                <h3 className="text-xs font-bold text-text font-heading flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Low Stock alerts
                </h3>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2 flex-1">
                  {displayLowStock.length > 0 ? (
                    displayLowStock.slice(0, 2).map((prod: LowStockItem) => (
                      <div key={prod.id} className="p-2.5 rounded-xl bg-rose-50/40 border border-rose-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-text truncate max-w-[120px]">{prod.name}</span>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-100/50 px-2 py-0.5 rounded-md">{prod.stock} left</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                      <p className="text-xs text-text-muted">Stock healthy</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate('/admin/inventory')}
                  className="w-full text-center text-[10px] font-bold text-secondary bg-secondary/5 hover:bg-secondary/10 py-2 rounded-xl transition-all mt-3 flex items-center justify-center gap-1 uppercase tracking-wider"
                >
                  Inventory Audit <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className={`col-span-1 lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl border ${pinnedWidgets.actions ? 'ring-2 ring-primary border-primary/30' : 'border-outlineVariant/40'} shadow-xl shadow-primary/5 flex flex-col group hover:-translate-y-1 transition-all duration-300 relative`}>
              <button 
                onClick={(e) => togglePin('actions', e)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/10 hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Heart className={`w-3.5 h-3.5 transition-colors ${pinnedWidgets.actions ? 'fill-rose-500 text-rose-500' : 'text-slate-300 group-hover:text-rose-400'}`} />
              </button>
              <div className="px-5 py-4 border-b border-outlineVariant/30">
                <h3 className="text-xs font-bold text-text font-heading flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-primary" />
                  Management Tools
                </h3>
              </div>
              <div className="p-5 grid grid-cols-3 gap-3 flex-1 items-center">
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex flex-col items-center justify-center p-3.5 bg-slate-50 border border-outlineVariant/30 hover:border-primary/25 rounded-2xl transition-all group/btn"
                >
                  <Plus className="w-5 h-5 text-primary mb-1.5 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-text">New Product</span>
                </button>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="flex flex-col items-center justify-center p-3.5 bg-slate-50 border border-outlineVariant/30 hover:border-secondary/25 rounded-2xl transition-all group/btn"
                >
                  <FolderTree className="w-5 h-5 text-secondary mb-1.5 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-text">New Category</span>
                </button>
                <button
                  onClick={() => setShowAddBrand(true)}
                  className="flex flex-col items-center justify-center p-3.5 bg-slate-50 border border-outlineVariant/30 hover:border-amber-500/25 rounded-2xl transition-all group/btn"
                >
                  <Building2 className="w-5 h-5 text-amber-500 mb-1.5 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-text">New Brand</span>
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <AddProductModal open={showAddProduct} onClose={() => setShowAddProduct(false)} onSuccess={() => {}} />
      <AddCategoryModal open={showAddCategory} onClose={() => setShowAddCategory(false)} onSuccess={() => {}} />
      <AddBrandModal open={showAddBrand} onClose={() => setShowAddBrand(false)} onSuccess={() => {}} />
    </div>
  )
}

export default ManagerDashboard
