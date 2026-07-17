import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Package, Smartphone } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import CheckoutModal from '../../components/CheckoutModal'

interface CartItem {
  product: {
    _id: string
    name: string
    price: number
    slug: string
    stockQuantity: number
    stockStatus: string
    images: { url: string; alt: string; isPrimary: boolean }[]
    brand?: { _id: string; name: string }
  }
  quantity: number
  price: number
  addedAt: string
}

interface CartData {
  _id: string
  user: string
  items: CartItem[]
  totalItems?: number
  totalPrice?: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const { token, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const fetchCart = async () => {
    if (!token) return
    try {
      const res = await fetch('/api/v1/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.status === 401) { logout(); navigate('/login'); return }
      if (res.ok) {
        const data = await res.json()
        setCart(data.data || null)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => {
    fetchCart()
  }, [token])

  const updateQuantity = async (productId: string, newQty: number) => {
    if (newQty < 1) return
    setUpdating(productId)
    try {
      const res = await fetch(`/api/v1/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQty })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || 'Failed to update quantity')
      }
      toast('success', 'Cart updated')
      fetchCart()
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to update')
    }
    setUpdating(null)
  }

  const removeItem = async (productId: string, name: string) => {
    setUpdating(productId)
    try {
      const res = await fetch(`/api/v1/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to remove item')
      toast('info', `Removed "${name}" from cart`)
      fetchCart()
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to remove')
    }
    setUpdating(null)
  }

  const clearCart = async () => {
    try {
      const res = await fetch('/api/v1/cart', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to clear cart')
      toast('info', 'Cart cleared')
      fetchCart()
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to clear cart')
    }
  }

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-text font-heading tracking-tight">Shopping Cart</h2>
        <p className="text-xs text-text-muted mt-0.5">{itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart` : 'Your cart is empty'}</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 p-4 animate-pulse flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-text-muted/10 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-text-muted/20" />
                <div className="h-3 w-1/2 rounded bg-text-muted/20" />
                <div className="h-5 w-1/4 rounded bg-text-muted/20" />
              </div>
            </div>
          ))}
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted font-bold">Your cart is empty</p>
          <p className="text-xs text-text-muted/70 mt-1">Browse our products and add items to get started</p>
          <button
            onClick={() => navigate('/customer/products')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-600 transition-all"
          >
            <Smartphone className="w-4 h-4" /> Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cart.items.map((item) => {
              const primaryImage = item.product.images?.find(img => img.isPrimary) || item.product.images?.[0]
              return (
                <div
                  key={item.product._id}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-4 flex gap-4 group hover:shadow-md transition-all duration-200"
                >
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 shrink-0 flex items-center justify-center overflow-hidden">
                    {primaryImage?.url ? (
                      <img src={primaryImage.url} alt={primaryImage.alt || item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-text-muted/30" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {item.product.brand && (
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{item.product.brand.name}</p>
                        )}
                        <h3 className="text-sm font-bold text-text truncate">{item.product.name}</h3>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id, item.product.name)}
                        disabled={updating === item.product._id}
                        className="p-1.5 rounded-lg text-text-muted hover:bg-error/10 hover:text-error transition-all shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={updating === item.product._id || item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-outlineVariant/60 bg-white hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-text">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={updating === item.product._id || item.quantity >= item.product.stockQuantity}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-outlineVariant/60 bg-white hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm font-black text-text">GHS {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-xs text-text-muted hover:text-error font-medium flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-5 space-y-4 sticky top-24">
              <h3 className="text-xs font-bold text-text uppercase tracking-wider">Order Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Items ({itemCount})</span>
                  <span className="text-text font-medium">GHS {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Shipping</span>
                  <span className="text-text font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t border-outlineVariant/30 pt-2 flex justify-between">
                  <span className="font-bold text-text">Total</span>
                  <span className="font-black text-text text-lg">GHS {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutOpen(true)}
                className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/customer/products')}
                className="w-full py-2 text-xs text-text-muted hover:text-primary font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => {
          setCheckoutOpen(false)
          fetchCart()
          navigate('/customer/orders')
        }}
        items={cart?.items?.map(i => ({
          product: i.product._id,
          quantity: i.quantity,
          price: i.price,
        })) || []}
      />
    </div>
  )
}
