import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Package, Heart, User, ArrowRight, Clock, CheckCircle, AlertTriangle, Smartphone } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function CustomerDashboard() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [orderCount, setOrderCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    const fetchData = async () => {
      try {
        const res = await fetch('/api/v1/orders?limit=1', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.status === 401) { logout(); navigate('/login'); return }
        if (res.ok) {
          const data = await res.json()
          setOrderCount(data.pagination?.total || 0)
        }
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetchData()
  }, [token])

  return (<div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-text font-heading tracking-tight">Welcome, {user?.name || 'Customer'}</h2>
        <p className="text-xs text-text-muted mt-0.5">Manage your orders, cart, and account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="col-span-1 lg:col-span-2 bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-secondary/10 p-2 rounded-xl"><User className="w-5 h-5 text-secondary" /></span>
              <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full">Account</span>
            </div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Signed in as</p>
            <p className="text-lg font-bold text-text mt-1">{user?.email}</p>
            <p className="text-xs text-text-muted mt-0.5 capitalize">{user?.role}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-outlineVariant/20 flex items-center gap-3">
            <button
              onClick={() => navigate('/customer/profile')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Manage Profile <ArrowRight className="w-3 h-3 text-secondary" />
            </button>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-accent/10 p-2 rounded-xl"><Package className="w-5 h-5 text-accent" /></span>
              <span className="text-[10px] font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">Orders</span>
            </div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">My Orders</p>
            <p className="text-3xl font-black text-text mt-1">{loading ? '...' : orderCount}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-outlineVariant/20">
            <button
              onClick={() => navigate('/customer/orders')}
              className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-secondary/10 p-2 rounded-xl"><ShoppingCart className="w-5 h-5 text-secondary" /></span>
              <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full">Cart</span>
            </div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Shopping Cart</p>
            <p className="text-3xl font-black text-text mt-1">—</p>
          </div>
          <div className="mt-4 pt-3 border-t border-outlineVariant/20">
            <button
              onClick={() => navigate('/customer/cart')}
              className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
            >
              Open Cart <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5 flex flex-col group hover:-translate-y-1 transition-all duration-300">
          <div className="px-5 py-4 border-b border-outlineVariant/30">
            <h3 className="text-xs font-bold text-text font-heading flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-primary" />
              Quick Actions
            </h3>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/customer/products')}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-outlineVariant/30 hover:border-primary/25 rounded-2xl transition-all group/btn"
            >
              <Smartphone className="w-5 h-5 text-primary mb-1.5 group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-text">Browse Products</span>
            </button>
            <button
              onClick={() => navigate('/customer/orders')}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-outlineVariant/30 hover:border-accent/25 rounded-2xl transition-all group/btn"
            >
              <Package className="w-5 h-5 text-accent mb-1.5 group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-text">My Orders</span>
            </button>
            <button
              onClick={() => navigate('/customer/wishlist')}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-outlineVariant/30 hover:border-rose-400/25 rounded-2xl transition-all group/btn"
            >
              <Heart className="w-5 h-5 text-rose-500 mb-1.5 group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-text">Wishlist</span>
            </button>
            <button
              onClick={() => navigate('/customer/profile')}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-outlineVariant/30 hover:border-secondary/25 rounded-2xl transition-all group/btn"
            >
              <User className="w-5 h-5 text-secondary mb-1.5 group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-text">Profile</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5 flex flex-col group hover:-translate-y-1 transition-all duration-300">
          <div className="px-5 py-4 border-b border-outlineVariant/30">
            <h3 className="text-xs font-bold text-text font-heading flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-success" />
              Recent Activity
            </h3>
          </div>
          <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-8 h-8 text-text-muted/30 mx-auto mb-3" />
            <p className="text-xs text-text-muted font-bold">No recent activity</p>
            <p className="text-[10px] text-text-muted/60 mt-0.5">Your recent orders and actions will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
