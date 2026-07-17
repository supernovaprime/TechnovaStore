import { useState, useEffect } from 'react'
import {
  Wallet, Users, ShoppingCart, CheckCircle, Shield, UserPlus, Pencil,
  XCircle, ArrowRight, Heart, AlertTriangle, Activity, Plus,
  RefreshCw, Layers, FolderTree, Building2
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import AddProductModal from './AddProductModal'
import AddStaffModal from './AddStaffModal'
import AddCategoryModal from './AddCategoryModal'
import AddBrandModal from './AddBrandModal'

interface Activity {
  _id: string
  action: string
  email: string
  role: string
  status: string
  createdAt: string
}

interface LowStockItem {
  id: string
  name: string
  stock: number
  threshold: number
}

const mockStats = {
  totalProducts: 420,
  totalOrders: 1850,
  totalUsers: 954,
  totalRevenue: 245000,
  inventoryValue: 125840,
  recentOrders: [],
  lowStockProducts: [
    { id: '1', name: 'iPhone 15 Pro Max', stock: 2, threshold: 5 },
    { id: '2', name: 'Galaxy S24 Ultra', stock: 4, threshold: 10 },
    { id: '3', name: 'MacBook Air M3', stock: 1, threshold: 4 }
  ] as LowStockItem[],
  pendingOrders: 14,
  recentActivities: [
    { _id: '1', action: 'login', email: 'samuel@technova.com', role: 'admin', status: 'success', createdAt: new Date().toISOString() },
    { _id: '2', action: 'register', email: 'jessica.brown@outlook.com', role: 'customer', status: 'success', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { _id: '3', action: 'login', email: 'admin_root@technova.com', role: 'admin', status: 'success', createdAt: new Date(Date.now() - 7200000).toISOString() },
    { _id: '4', action: 'login', email: 'malicious_user@hacker.io', role: 'guest', status: 'failed', createdAt: new Date(Date.now() - 14400000).toISOString() }
  ] as Activity[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<typeof mockStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [totalUsersFromDb, setTotalUsersFromDb] = useState<number | null>(null)
  const [likedWidgets, setLikedWidgets] = useState<Record<string, boolean>>({
    finance: false, users: false, orders: false,
    activities: false, lowStock: false, shortcuts: false, health: false
  })
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddBrand, setShowAddBrand] = useState(false)
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const toggleLike = (id: string) => {
    setLikedWidgets(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const fetchStats = async () => {
    setLoading(true)
    setError('')
    try {
      const [dashboardRes, usersRes] = await Promise.all([
        fetch('/api/v1/analytics/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/v1/users?limit=1', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (dashboardRes.status === 401 || usersRes.status === 401) {
        logout()
        navigate('/login', { replace: true })
        return
      }

      if (!dashboardRes.ok) throw new Error('API server returned an error')

      const dashboardData = await dashboardRes.json()
      setStats(dashboardData.data)

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setTotalUsersFromDb(usersData.pagination?.total || usersData.data?.length || 0)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text font-heading">System Overview</h2>
          <p className="text-sm text-text-muted mt-0.5">Monitor your store's performance</p>
        </div>
        <div className="flex items-center gap-2">
          {isDemoMode && (
            <span className="text-[11px] font-semibold text-warning bg-warning/10 px-2.5 py-1 rounded-full border border-warning/20">
              Demo Preview
            </span>
          )}
          <button
            onClick={fetchStats}
            className="p-2 rounded-xl bg-white/70 border border-outlineVariant/40 text-text-muted hover:text-primary hover:border-primary/40 transition-all duration-200"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && !isDemoMode && (
        <div className="bg-error/5 border border-error/15 rounded-2xl p-4 flex items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-error">Connection Issue</p>
              <p className="text-xs text-error/80">{error}</p>
            </div>
          </div>
          <button
            onClick={() => { setError(''); setIsDemoMode(true); setStats(mockStats) }}
            className="text-xs font-semibold bg-error text-white px-3 py-1.5 rounded-lg hover:bg-error/90 transition-colors flex-shrink-0"
          >
            Use Mock Data
          </button>
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx} className={`bg-white/60 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 animate-pulse p-6 ${
              idx === 0 ? 'lg:col-span-2' : ''
            } ${idx === 3 ? 'lg:col-span-2 lg:row-span-2 min-h-[300px]' : ''}`}>
              <div className="h-4 w-4 rounded bg-text-muted/20" />
              <div className="h-3 w-24 rounded bg-text-muted/20 mt-4" />
              <div className="h-5 w-16 rounded bg-text-muted/20 mt-2" />
            </div>
          ))
        ) : stats ? (
          <>
            {/* Financial Performance */}
            <div className={`lg:col-span-2 bg-white/70 backdrop-blur-xl p-6 rounded-2xl border shadow-sm flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative ${
              likedWidgets.finance ? 'ring-2 ring-primary/30 border-primary/20' : 'border-outlineVariant/40'
            }`}>
              <button
                onClick={() => toggleLike('finance')}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/30 hover:scale-110 transition-all"
              >
                <Heart className={`w-4 h-4 ${likedWidgets.finance ? 'fill-error text-error' : 'text-text-muted'}`} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary/10 p-2 rounded-lg"><Wallet className="w-5 h-5 text-primary" /></span>
                  <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">Financial Center</span>
                </div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Inventory Value</p>
                <p className="text-2xl font-bold text-text mt-1">GHS {stats.inventoryValue.toLocaleString()}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-outlineVariant/20 flex items-end justify-between">
                <div>
                  <p className="text-[11px] text-text-muted">Projected Revenue</p>
                  <p className="text-sm font-bold text-text">84.2% completed</p>
                </div>
                <div className="w-20 h-8">
                  <svg className="w-full h-full text-success stroke-2 fill-none" viewBox="0 0 100 30">
                    <path d="M0,25 Q15,5 30,22 T60,10 T90,5 T100,12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className={`bg-white/70 backdrop-blur-xl p-6 rounded-2xl border shadow-sm flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative ${
              likedWidgets.users ? 'ring-2 ring-primary/30 border-primary/20' : 'border-outlineVariant/40'
            }`}>
              <button
                onClick={() => toggleLike('users')}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/30 hover:scale-110 transition-all"
              >
                <Heart className={`w-4 h-4 ${likedWidgets.users ? 'fill-error text-error' : 'text-text-muted'}`} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-secondary/10 p-2 rounded-lg"><Users className="w-5 h-5 text-secondary" /></span>
                  <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">Live</span>
                </div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Active Users</p>
                <p className="text-2xl font-bold text-text mt-1">{totalUsersFromDb ?? stats.totalUsers}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-outlineVariant/20 flex items-center justify-between">
                <span className="text-[10px] text-text-muted">Registered accounts</span>
                <span onClick={() => navigate('/admin/users')} className="text-[10px] font-semibold text-primary hover:underline cursor-pointer">View all</span>
              </div>
            </div>

            {/* Orders */}
            <div className={`bg-white/70 backdrop-blur-xl p-6 rounded-2xl border shadow-sm flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative ${
              likedWidgets.orders ? 'ring-2 ring-primary/30 border-primary/20' : 'border-outlineVariant/40'
            }`}>
              <button
                onClick={() => toggleLike('orders')}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/30 hover:scale-110 transition-all"
              >
                <Heart className={`w-4 h-4 ${likedWidgets.orders ? 'fill-error text-error' : 'text-text-muted'}`} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-accent/10 p-2 rounded-lg"><ShoppingCart className="w-5 h-5 text-accent" /></span>
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Processing</span>
                </div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Orders Dispatched</p>
                <p className="text-2xl font-bold text-text mt-1">{stats.totalOrders}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-outlineVariant/20">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Backlog</span>
                  <span className="font-bold text-accent">{stats.pendingOrders} pending</span>
                </div>
                <div className="w-full bg-outlineVariant/30 rounded-full h-1.5">
                  <div className="bg-accent h-1.5 rounded-full" style={{ width: `${Math.min((stats.pendingOrders / Math.max(stats.totalOrders, 1)) * 100, 100)}%` }} />
                </div>
              </div>
            </div>

            {/* Activity Logs */}
            <div className={`lg:col-span-2 lg:row-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border shadow-sm flex flex-col group hover:shadow-md transition-all duration-300 relative ${
              likedWidgets.activities ? 'ring-2 ring-primary/30 border-primary/20' : 'border-outlineVariant/40'
            }`}>
              <button
                onClick={() => toggleLike('activities')}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/30 hover:scale-110 transition-all z-10"
              >
                <Heart className={`w-4 h-4 ${likedWidgets.activities ? 'fill-error text-error' : 'text-text-muted'}`} />
              </button>
              <div className="px-6 py-4 border-b border-outlineVariant/30">
                <h3 className="text-base font-bold text-text font-heading">Administrative Activity</h3>
                <p className="text-xs text-text-muted mt-0.5">Security audit events</p>
              </div>
              <div className="p-5 flex-1 overflow-y-auto max-h-[320px] space-y-3">
                {stats.recentActivities.length ? (
                  stats.recentActivities.map((activity: Activity) => {
                    const isSuccess = activity.status === 'success'
                    const isLogin = activity.action === 'login'
                    const isRegister = activity.action === 'register'
                    const IconComponent = isLogin ? Shield : isRegister ? UserPlus : Pencil

                    return (
                      <div
                        key={activity._id}
                        className={`relative overflow-hidden rounded-xl border transition-all duration-200 ${
                          isSuccess
                            ? 'bg-gradient-to-r from-success/5 via-white to-success/[0.02] border-success/15'
                            : 'bg-gradient-to-r from-error/5 via-white to-error/[0.02] border-error/15'
                        }`}
                      >
                        <div className={`absolute inset-0 opacity-[0.03] ${
                          isSuccess
                            ? 'bg-gradient-to-br from-success via-transparent to-transparent'
                            : 'bg-gradient-to-br from-error via-transparent to-transparent'
                        }`} />
                        <div className="relative flex items-center justify-between p-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`p-2 rounded-xl flex-shrink-0 ${
                              isLogin ? 'bg-primary/10 text-primary' : isRegister ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                            }`}>
                              <IconComponent className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-text truncate">
                                {isLogin ? 'Login attempt' : isRegister ? 'New registration' : activity.action}
                              </p>
                              <p className="text-xs text-text-muted truncate">{activity.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isSuccess ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                            }`}>
                              {isSuccess ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {isSuccess ? 'Verified' : 'Flagged'}
                            </span>
                            <span className="text-[10px] text-text-muted hidden sm:block">
                              {activity.createdAt ? new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="py-10 text-center">
                    <Shield className="w-8 h-8 text-text-muted/30 mx-auto mb-3" />
                    <p className="text-sm text-text-muted">No events recorded</p>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 border-t border-outlineVariant/20 bg-background/50 flex justify-between items-center">
                <span className="text-[10px] text-text-muted">Session Security: Level A</span>
                <button onClick={() => navigate('/admin/audit')} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                  Full audit logs <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className={`bg-white/70 backdrop-blur-xl rounded-2xl border shadow-sm flex flex-col group hover:shadow-md transition-all duration-300 relative ${
              likedWidgets.lowStock ? 'ring-2 ring-primary/30 border-primary/20' : 'border-outlineVariant/40'
            }`}>
              <button
                onClick={() => toggleLike('lowStock')}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/30 hover:scale-110 transition-all z-10"
              >
                <Heart className={`w-4 h-4 ${likedWidgets.lowStock ? 'fill-error text-error' : 'text-text-muted'}`} />
              </button>
              <div className="px-5 py-4 border-b border-outlineVariant/30">
                <h3 className="text-sm font-bold text-text font-heading flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-error" />
                  Critical Stock
                </h3>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="space-y-2.5 flex-1">
                  {stats.lowStockProducts.length > 0 ? (
                    stats.lowStockProducts.slice(0, 3).map((prod: LowStockItem) => (
                      <div key={prod.id} className="p-2.5 rounded-xl bg-error/5 border border-error/10 flex items-center justify-between">
                        <span className="text-xs font-semibold text-text truncate max-w-[140px]">{prod.name}</span>
                        <span className="text-[10px] font-bold text-error bg-error/10 px-2 py-0.5 rounded-md">{prod.stock} left</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <CheckCircle className="w-8 h-8 text-success mx-auto mb-2 opacity-60" />
                      <p className="text-xs text-text-muted">All stock levels healthy</p>
                    </div>
                  )}
                </div>
                <button className="w-full text-center text-xs font-bold text-secondary bg-secondary/5 hover:bg-secondary/10 py-2 rounded-xl transition-all mt-3">
                  Initiate Restock
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`bg-white/70 backdrop-blur-xl rounded-2xl border shadow-sm flex flex-col group hover:shadow-md transition-all duration-300 relative ${
              likedWidgets.shortcuts ? 'ring-2 ring-primary/30 border-primary/20' : 'border-outlineVariant/40'
            }`}>
              <button
                onClick={() => toggleLike('shortcuts')}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/30 hover:scale-110 transition-all z-10"
              >
                <Heart className={`w-4 h-4 ${likedWidgets.shortcuts ? 'fill-error text-error' : 'text-text-muted'}`} />
              </button>
              <div className="px-5 py-4 border-b border-outlineVariant/30">
                <h3 className="text-sm font-bold text-text font-heading flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary" />
                  Quick Actions
                </h3>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex flex-col items-center justify-center p-3 bg-background hover:bg-primary/5 border border-outlineVariant/30 hover:border-primary/20 rounded-xl transition-all group/btn"
                >
                  <Plus className="w-5 h-5 text-primary mb-1 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-text">Add Product</span>
                </button>
                <button
                  onClick={() => setShowAddStaff(true)}
                  className="flex flex-col items-center justify-center p-3 bg-background hover:bg-secondary/5 border border-outlineVariant/30 hover:border-secondary/20 rounded-xl transition-all group/btn"
                >
                  <Users className="w-5 h-5 text-secondary mb-1 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-text">Add Staff</span>
                </button>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="flex flex-col items-center justify-center p-3 bg-background hover:bg-secondary/5 border border-outlineVariant/30 hover:border-secondary/20 rounded-xl transition-all group/btn"
                >
                  <FolderTree className="w-5 h-5 text-secondary mb-1 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-text">Add Category</span>
                </button>
                <button
                  onClick={() => setShowAddBrand(true)}
                  className="flex flex-col items-center justify-center p-3 bg-background hover:bg-accent/5 border border-outlineVariant/30 hover:border-accent/20 rounded-xl transition-all group/btn"
                >
                  <Building2 className="w-5 h-5 text-accent mb-1 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-text">Add Brand</span>
                </button>
              </div>
            </div>

            {/* System Health */}
            <div className={`lg:col-span-2 bg-white/70 backdrop-blur-xl p-6 rounded-2xl border shadow-sm flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative ${
              likedWidgets.health ? 'ring-2 ring-primary/30 border-primary/20' : 'border-outlineVariant/40'
            }`}>
              <button
                onClick={() => toggleLike('health')}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-outlineVariant/30 hover:scale-110 transition-all"
              >
                <Heart className={`w-4 h-4 ${likedWidgets.health ? 'fill-error text-error' : 'text-text-muted'}`} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-success/10 p-2 rounded-lg"><Activity className="w-5 h-5 text-success" /></span>
                  <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">Server Status</span>
                </div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Infrastructure Ping</p>
                <p className="text-xl font-bold text-text mt-1">
                  12 ms <span className="text-xs font-bold text-success">(Excellent)</span>
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outlineVariant/20 flex items-center justify-between">
                <span className="text-[10px] text-text-muted font-semibold">Gateway: AWS-US-East</span>
                <span className="w-2.5 h-2.5 bg-success rounded-full animate-ping" />
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Modals */}
      <AddProductModal open={showAddProduct} onClose={() => setShowAddProduct(false)} onSuccess={() => {}} />
      <AddStaffModal open={showAddStaff} onClose={() => setShowAddStaff(false)} onSuccess={() => {}} />
      <AddCategoryModal open={showAddCategory} onClose={() => setShowAddCategory(false)} onSuccess={() => {}} />
      <AddBrandModal open={showAddBrand} onClose={() => setShowAddBrand(false)} onSuccess={() => {}} />

      {/* Scroll to Top FAB */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-95 z-50 group"
      >
        <ArrowRight className="w-5 h-5 -rotate-90 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  )
}
