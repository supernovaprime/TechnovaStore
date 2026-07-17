import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign, Package, Users, ShoppingCart, Star, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  inventoryValue: number
  pendingOrders: number
  lowStockProducts: { _id: string; name: string; stockQuantity: number }[]
}

interface SalesDataPoint {
  _id: string
  sales: number
  orders: number
}

interface TopProduct {
  _id: string
  name: string
  sales: number
  views: number
  rating: number
}

interface CategoryStat {
  _id: string
  count: number
  totalSales: number
  avgRating: number
  category: { name: string }
}

interface CustomerGrowth {
  _id: string
  newCustomers: number
}

interface TopCustomer {
  _id: string
  name: string
  email: string
  totalSpent: number
  orderCount: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([])
  const [customerGrowth, setCustomerGrowth] = useState<CustomerGrowth[]>([])
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'customers'>('overview')
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [dashRes, salesRes, prodRes, custRes] = await Promise.all([
        fetch('/api/v1/analytics/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/v1/analytics/sales', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/v1/analytics/products', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/v1/analytics/customers', { headers: { Authorization: `Bearer ${token}` } })
      ])

      if (dashRes.status === 401) { logout(); navigate('/login', { replace: true }); return }

      if (!dashRes.ok || !salesRes.ok || !prodRes.ok || !custRes.ok) throw new Error('Failed to fetch analytics')

      const dash = await dashRes.json()
      setStats(dash.data)

      const sales = await salesRes.json()
      setSalesData(sales.data || [])

      const prod = await prodRes.json()
      setTopProducts(prod.data?.topProducts || [])
      setCategoryStats(prod.data?.categoryStats || [])

      const cust = await custRes.json()
      setCustomerGrowth(cust.data?.customerStats || [])
      setTopCustomers(cust.data?.topCustomers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchAll()
    else setLoading(false)
  }, [token])

  const maxSales = Math.max(...salesData.map(d => d.sales), 1)
  const totalSalesRevenue = salesData.reduce((sum, d) => sum + d.sales, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text font-heading">Analytics</h2>
          <p className="text-sm text-text-muted mt-0.5">Performance metrics and business intelligence</p>
        </div>
        <div className="flex items-center gap-1 bg-background rounded-xl border border-outlineVariant/40 p-1">
          {(['overview', 'products', 'customers'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-primary'}`}
            >{tab}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/70 border border-outlineVariant/40">
                <div className="h-4 w-24 bg-text-muted/20 animate-pulse rounded mb-3" />
                <div className="h-8 w-32 bg-text-muted/20 animate-pulse rounded" />
              </div>
            ))}
          </div>
          <div className="h-80 bg-white/70 rounded-2xl border border-outlineVariant/40 animate-pulse" />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-error text-sm bg-white/70 rounded-2xl border border-outlineVariant/40">{error}</div>
      ) : (
        <>
          {/* Summary Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-outlineVariant/40 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Revenue</p>
                  <p className="text-xl font-black text-text">GHS {(stats.totalRevenue || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-text-muted/80">From completed orders</p>
                </div>
                <span className="p-3 bg-success/10 text-success rounded-xl"><DollarSign className="w-5 h-5" /></span>
              </div>

              <div className="p-5 rounded-2xl border border-outlineVariant/40 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Orders</p>
                  <p className="text-xl font-black text-primary">{stats.totalOrders || 0}</p>
                  <p className="text-[10px] text-text-muted/80">{stats.pendingOrders || 0} pending</p>
                </div>
                <span className="p-3 bg-primary/10 text-primary rounded-xl"><ShoppingCart className="w-5 h-5" /></span>
              </div>

              <div className="p-5 rounded-2xl border border-outlineVariant/40 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Products</p>
                  <p className="text-xl font-black text-accent">{stats.totalProducts || 0}</p>
                  <p className="text-[10px] text-text-muted/80">{stats.lowStockProducts?.length || 0} low stock</p>
                </div>
                <span className="p-3 bg-accent/10 text-accent rounded-xl"><Package className="w-5 h-5" /></span>
              </div>

              <div className="p-5 rounded-2xl border border-outlineVariant/40 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Customers</p>
                  <p className="text-xl font-black text-secondary">{stats.totalUsers || 0}</p>
                  <p className="text-[10px] text-text-muted/80">Registered accounts</p>
                </div>
                <span className="p-3 bg-secondary/10 text-secondary rounded-xl"><Users className="w-5 h-5" /></span>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Sales Chart */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-text font-heading flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Daily Sales
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">Revenue from completed orders</p>
                  </div>
                  <span className="text-xs font-bold text-text">GHS {totalSalesRevenue.toLocaleString()} total</span>
                </div>

                {salesData.length === 0 ? (
                  <div className="py-12 text-center text-text-muted text-sm">No sales data available</div>
                ) : (
                  <div className="flex items-end gap-1.5 h-48">
                    {salesData.slice(-30).map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-text text-white text-[9px] px-2 py-0.5 rounded whitespace-nowrap z-10">
                          GHS {d.sales.toLocaleString()} ({d.orders} orders)
                        </div>
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-primary/60 to-primary/30 hover:from-primary hover:to-primary/60 transition-all cursor-pointer"
                          style={{ height: `${(d.sales / maxSales) * 100}%` }}
                        />
                        <span className="text-[7px] text-text-muted -rotate-45 origin-left whitespace-nowrap">
                          {new Date(d._id).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Low Stock & Inventory */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-6">
                  <h3 className="text-base font-bold text-text font-heading flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    Low Stock Alerts
                  </h3>
                  {!stats || stats.lowStockProducts?.length === 0 ? (
                    <p className="text-sm text-text-muted text-center py-8">All products have sufficient stock</p>
                  ) : (
                    <div className="space-y-2">
                      {stats.lowStockProducts.map((p: any) => (
                        <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-warning/5 border border-warning/10">
                          <span className="text-sm font-semibold text-text truncate">{p.name}</span>
                          <span className="text-xs font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full">{p.stockQuantity} left</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-6">
                  <h3 className="text-base font-bold text-text font-heading flex items-center gap-2 mb-4">
                    <Package className="w-4 h-4 text-accent" />
                    Inventory Value
                  </h3>
                  <p className="text-3xl font-black text-text">GHS {(stats?.inventoryValue || 0).toLocaleString()}</p>
                  <p className="text-xs text-text-muted mt-1">Total value of active inventory</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                    <div className="w-3 h-3 rounded bg-success" />
                    <span>{stats?.totalProducts || 0} active products</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-outlineVariant/30">
                  <h3 className="text-base font-bold text-text font-heading flex items-center gap-2">
                    <Star className="w-4 h-4 text-accent" />
                    Top Selling Products
                  </h3>
                </div>
                {topProducts.length === 0 ? (
                  <div className="p-6 text-sm text-text-muted text-center">No product data available</div>
                ) : (
                  <div className="p-5 space-y-2">
                    {topProducts.map((p, i) => (
                      <div key={p._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-background transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">#{i + 1}</span>
                          <span className="text-sm font-semibold text-text truncate">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="text-xs text-text-muted">{p.sales} sold</span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3" />{p.rating?.toFixed(1) || '-'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Breakdown */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-outlineVariant/30">
                  <h3 className="text-base font-bold text-text font-heading flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-secondary" />
                    Category Performance
                  </h3>
                </div>
                {categoryStats.length === 0 ? (
                  <div className="p-6 text-sm text-text-muted text-center">No category data available</div>
                ) : (
                  <div className="p-5 space-y-2">
                    {categoryStats.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-background transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-xs font-bold flex-shrink-0">
                            {c.category?.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text truncate">{c.category?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-text-muted">{c.count} products</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs font-semibold text-text">{c.totalSales} sold</span>
                          <span className="text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full">
                            ★ {(c.avgRating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Growth Chart */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-6">
                <h3 className="text-base font-bold text-text font-heading flex items-center gap-2 mb-6">
                  <TrendingUp className="w-4 h-4 text-success" />
                  Customer Growth
                </h3>
                {customerGrowth.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-8">No customer growth data available</p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={customerGrowth} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="_id" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                        labelStyle={{ fontWeight: 700, marginBottom: 4 }}
                        formatter={(value) => [`${value ?? 0} new`, 'Customers']}
                      />
                      <Bar dataKey="newCustomers" radius={[6, 6, 0, 0]} fill="#22C55E" maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Top Customers */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-outlineVariant/30">
                  <h3 className="text-base font-bold text-text font-heading flex items-center gap-2">
                    <Users className="w-4 h-4 text-secondary" />
                    Top Customers
                  </h3>
                </div>
                {topCustomers.length === 0 ? (
                  <div className="p-6 text-sm text-text-muted text-center py-12">No customer data available</div>
                ) : (
                  <div className="p-5 space-y-2">
                    {topCustomers.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-background transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            {c.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text truncate">{c.name}</p>
                            <p className="text-[10px] text-text-muted truncate">{c.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-text-muted">{c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}</span>
                          <span className="text-xs font-bold text-text">GHS {c.totalSpent.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
