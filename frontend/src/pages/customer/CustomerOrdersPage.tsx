import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Clock, RefreshCw, ThumbsUp, Truck, CheckCircle, XCircle, ShoppingCart, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

interface OrderItem {
  product: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface StatusHistoryEntry {
  status: string
  timestamp: string
  note?: string
}

interface Order {
  _id: string
  orderNumber: string
  items: OrderItem[]
  totalAmount: number
  status: string
  paymentMethod: string
  paymentStatus: string
  shippingAddress: { fullName: string; city: string; country: string }
  statusHistory: StatusHistoryEntry[]
  createdAt: string
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  approved: 'Approved',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const statusIcons: Record<string, typeof Package> = {
  pending: Clock,
  processing: RefreshCw,
  approved: ThumbsUp,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  processing: 'bg-primary/10 text-primary border-primary/20',
  approved: 'bg-accent/10 text-accent border-accent/20',
  shipped: 'bg-secondary/10 text-secondary border-secondary/20',
  delivered: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-error/10 text-error border-error/20',
}

const timelineColors: Record<string, string> = {
  pending: 'bg-warning',
  processing: 'bg-primary',
  approved: 'bg-accent',
  shipped: 'bg-secondary',
  delivered: 'bg-success',
  cancelled: 'bg-error',
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const fetchOrders = async () => {
    if (!token) return
    try {
      const res = await fetch('/api/v1/orders?limit=50', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.status === 401) { logout(); navigate('/login'); return }
      if (res.ok) {
        const data = await res.json()
        setOrders(data.data || [])
      }
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [token])

  const handleCancel = async (orderId: string) => {
    setCancellingId(orderId)
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to cancel order')
      toast('success', 'Order cancelled successfully')
      fetchOrders()
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to cancel')
    }
    setCancellingId(null)
  }

  const canCancel = (status: string) => ['pending', 'processing'].includes(status)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-text font-heading tracking-tight">My Orders</h2>
        <p className="text-xs text-text-muted mt-0.5">Track and manage your orders</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 p-4 animate-pulse space-y-3">
              <div className="h-4 w-48 rounded bg-text-muted/20" />
              <div className="h-3 w-32 rounded bg-text-muted/20" />
              <div className="h-5 w-24 rounded bg-text-muted/20" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted font-bold">No orders yet</p>
          <p className="text-xs text-text-muted/70 mt-1">Place your first order to see it here</p>
          <button
            onClick={() => navigate('/customer/products')}
            className="mt-4 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-600 transition-all"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status] || Package
            const itemCount = order.items.reduce((s, i) => s + i.quantity, 0)
            const isExpanded = expandedId === order._id
            const sortedHistory = [...(order.statusHistory || [])].sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )

            return (
              <div
                key={order._id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`p-2 rounded-xl ${statusColors[order.status] || 'bg-background'}`}>
                        <StatusIcon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-text">#{order.orderNumber}</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusColors[order.status] || 'bg-background text-text-muted border-outlineVariant/40'}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'} &middot; GHS {order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {canCancel(order.status) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCancel(order._id) }}
                          disabled={cancellingId === order._id}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-error/10 text-error hover:bg-error/20 transition-all disabled:opacity-50"
                        >
                          {cancellingId === order._id ? '...' : 'Cancel'}
                        </button>
                      )}
                      <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-outlineVariant/30 px-4 py-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Payment</p>
                        <p className="text-xs font-medium text-text capitalize">{order.paymentMethod.replace(/_/g, ' ')}</p>
                        <p className="text-[10px] text-text-muted">{order.paymentStatus}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Delivery</p>
                        <p className="text-xs font-medium text-text">{order.shippingAddress?.fullName || '—'}</p>
                        <p className="text-[10px] text-text-muted">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Items</p>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-text font-medium truncate">{item.name} x{item.quantity}</span>
                            <span className="text-text-muted ml-2 shrink-0">GHS {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-outlineVariant/20 pt-1 flex justify-between text-xs font-bold">
                        <span className="text-text">Total</span>
                        <span className="text-text">GHS {order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {sortedHistory.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Status History</p>
                        <div className="space-y-2">
                          {sortedHistory.map((entry, idx) => {
                            const TimelineIcon = statusIcons[entry.status] || Package
                            const isLast = idx === sortedHistory.length - 1
                            return (
                              <div key={idx} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className={`w-6 h-6 rounded-full ${timelineColors[entry.status] || 'bg-text-muted'} flex items-center justify-center`}>
                                    <TimelineIcon className="w-3 h-3 text-white" />
                                  </div>
                                  {!isLast && <div className="w-0.5 flex-1 bg-outlineVariant/40 mt-1" />}
                                </div>
                                <div className="pb-2 flex-1">
                                  <p className="text-xs font-bold text-text">
                                    {statusLabels[entry.status] || entry.status}
                                  </p>
                                  <p className="text-[10px] text-text-muted">
                                    {new Date(entry.timestamp).toLocaleString()}
                                  </p>
                                  {entry.note && (
                                    <p className="text-[10px] text-text-muted/70 mt-0.5">{entry.note}</p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
