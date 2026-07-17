import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Package, ChevronDown, SlidersHorizontal, Clock, User, MapPin, AlertTriangle, Truck, XCircle, CheckCircle, RefreshCw, ThumbsUp } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'

interface OrderItem {
  product: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  _id: string
  orderNumber: string
  user: { _id: string; name: string; email: string } | null
  items: OrderItem[]
  totalAmount: number
  currency: string
  status: string
  paymentStatus: string
  paymentMethod: string
  shippingAddress: {
    fullName: string
    city: string
    country: string
  }
  createdAt: string
}

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  processing: 'bg-primary/10 text-primary border-primary/20',
  approved: 'bg-accent/10 text-accent border-accent/20',
  shipped: 'bg-secondary/10 text-secondary border-secondary/20',
  delivered: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-error/10 text-error border-error/20',
  refunded: 'bg-accent/10 text-accent border-accent/20'
}

const paymentStatusStyles: Record<string, string> = {
  pending: 'text-warning',
  completed: 'text-success',
  failed: 'text-error',
  refunded: 'text-accent'
}

const statusIconMap: Record<string, typeof Package> = {
  pending: Clock,
  processing: RefreshCw,
  approved: ThumbsUp,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: AlertTriangle
}

const orderStatuses = ['pending', 'processing', 'approved', 'shipped', 'delivered', 'cancelled', 'refunded']

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const fetchOrders = async (searchTerm?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: '20' })
      if (statusFilter) params.append('status', statusFilter)
      if (searchTerm ?? search) params.append('search', searchTerm ?? search)

      const response = await fetch(`/api/v1/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 401) {
        logout()
        navigate('/login', { replace: true })
        return
      }

      if (!response.ok) throw new Error('Failed to fetch orders')

      const result = await response.json()
      setOrders(result.data || [])
      const total = result.pagination?.total || 0
      setTotalPages(result.pagination?.total ? Math.ceil(total / 20) : 1)
      setTotalOrders(total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchOrders()
    else setLoading(false)
  }, [token, page, statusFilter])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  useEffect(() => {
    if (!token) return
    const timer = setTimeout(() => fetchOrders(), 400)
    return () => clearTimeout(timer)
  }, [search])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      const response = await fetch(`/api/v1/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      toast('success', `Order status updated to "${newStatus}"`)
      fetchOrders()
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length
  const processingCount = orders.filter(o => o.status === 'processing').length
  const deliveredCount = orders.filter(o => o.status === 'delivered').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text font-heading">Orders</h2>
          <p className="text-sm text-text-muted mt-0.5">Manage customer orders and fulfillment</p>
        </div>
      </div>

      {/* Order Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-outlineVariant/40 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-black text-warning">{pendingCount} {pendingCount === 1 ? 'order' : 'orders'}</p>
            <p className="text-[10px] text-text-muted/80">Awaiting processing</p>
          </div>
          <span className="p-3 bg-warning/10 text-warning rounded-xl"><Clock className="w-5 h-5" /></span>
        </div>

        <div className="p-5 rounded-2xl border border-outlineVariant/40 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Processing</p>
            <p className="text-2xl font-black text-primary">{processingCount} {processingCount === 1 ? 'order' : 'orders'}</p>
            <p className="text-[10px] text-text-muted/80">In fulfillment</p>
          </div>
          <span className="p-3 bg-primary/10 text-primary rounded-xl"><RefreshCw className="w-5 h-5" /></span>
        </div>

        <div className="p-5 rounded-2xl border border-outlineVariant/40 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Delivered</p>
            <p className="text-2xl font-black text-success">{deliveredCount} {deliveredCount === 1 ? 'order' : 'orders'}</p>
            <p className="text-[10px] text-text-muted/80">Completed deliveries</p>
          </div>
          <span className="p-3 bg-success/10 text-success rounded-xl"><CheckCircle className="w-5 h-5" /></span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order number or customer..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm transition-all outline-none"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 bg-background border border-outlineVariant/60 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
              >
                <option value="">All Statuses</option>
                {orderStatuses.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-all duration-200 ${
                showFilters
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-background border-outlineVariant/60 text-text-muted hover:border-primary/40'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showFilters && statusFilter && (
          <div className="mt-3 pt-3 border-t border-outlineVariant/20 text-xs text-text-muted flex flex-wrap gap-2 items-center">
            <button onClick={() => setStatusFilter('')} className="px-2.5 py-1 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors font-medium">
              Clear status filter
            </button>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outlineVariant/30">
          <h3 className="text-base font-bold text-text font-heading">Order Registry</h3>
          <p className="text-xs text-text-muted mt-0.5">Real-time order tracking and status management</p>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-background/50">
                <div className="w-10 h-10 rounded-xl bg-text-muted/20 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded bg-text-muted/20 animate-pulse" />
                  <div className="h-3 w-32 rounded bg-text-muted/20 animate-pulse" />
                </div>
                <div className="h-6 w-24 rounded-full bg-text-muted/20 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error text-sm">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <p className="text-text-muted font-medium">No orders found</p>
            <p className="text-sm text-text-muted/70 mt-1">Orders will appear here once customers place them</p>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            {orders.map((order) => {
              const StatusIcon = statusIconMap[order.status] || Package
              const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)

              return (
                <div
                  key={order._id}
                  className="relative overflow-hidden rounded-xl border border-outlineVariant/40 bg-gradient-to-r from-white via-white to-white/[0.98] transition-all duration-200 hover:shadow-sm"
                >
                  <div className="relative flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="p-2 rounded-xl bg-primary/5 text-primary flex-shrink-0">
                        <ShoppingCart className="w-4 h-4" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-text truncate">#{order.orderNumber}</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusStyles[order.status] || 'bg-background text-text-muted border-outlineVariant/40'}`}>
                            <StatusIcon className="w-3 h-3" />
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-text-muted truncate flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {order.user?.name || 'Guest'}
                          </span>
                          <span className="text-[10px] text-text-muted/40">|</span>
                          <span className="text-[10px] text-text-muted truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {order.shippingAddress?.city}, {order.shippingAddress?.country}
                          </span>
                          <span className="text-[10px] text-text-muted/40">|</span>
                          <span className="text-[10px] text-text-muted truncate flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-text">GHS {order.totalAmount.toLocaleString()}</p>
                        <p className="text-[9px] text-text-muted flex items-center gap-1 justify-end mt-0.5">
                          <Clock className="w-3 h-3" />
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className="appearance-none pl-2.5 pr-7 py-1.5 text-[10px] font-bold rounded-lg border border-outlineVariant/60 bg-white outline-none cursor-pointer hover:border-primary/40 transition-colors disabled:opacity-50"
                          >
                            {orderStatuses.map(s => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none" />
                        </div>
                      </div>

                      <span className={`text-[9px] font-bold tracking-wider uppercase ${paymentStatusStyles[order.paymentStatus] || 'text-text-muted'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-outlineVariant/20 bg-background/50">
            <p className="text-[10px] text-text-muted">
              Page {page} of {totalPages} &middot; {totalOrders} total {totalOrders === 1 ? 'order' : 'orders'}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-outlineVariant/60 bg-white hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-outlineVariant/60 bg-white hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
