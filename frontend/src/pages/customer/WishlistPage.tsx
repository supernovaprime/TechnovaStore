import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Star, Package, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  oldPrice?: number
  rating: number
  reviewCount: number
  stockStatus: string
  stockQuantity: number
  brand?: { _id: string; name: string }
  images: { url: string; alt: string; isPrimary: boolean }[]
}

export default function WishlistPage() {
  const [likedProducts, setLikedProducts] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('technova_wishlist') || '[]') }
    catch { return [] }
  })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('technova_wishlist', JSON.stringify(likedProducts))
  }, [likedProducts])

  useEffect(() => {
    if (!token || likedProducts.length === 0) { setLoading(false); return }
    const fetchWishlistProducts = async () => {
      try {
        const res = await fetch('/api/v1/products?limit=100', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          const allProducts: Product[] = data.data || data.products || []
          setProducts(allProducts.filter(p => likedProducts.includes(p._id)))
        }
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetchWishlistProducts()
  }, [token, likedProducts])

  const removeFromWishlist = (id: string, name: string) => {
    setLikedProducts(prev => prev.filter(p => p !== id))
    setProducts(prev => prev.filter(p => p._id !== id))
    toast('info', `Removed "${name}" from wishlist`)
  }

  const addToCart = async (product: Product) => {
    try {
      const res = await fetch('/api/v1/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product: product._id, quantity: 1 })
      })
      if (res.status === 401) return
      if (!res.ok) throw new Error('Failed to add to cart')
      toast('success', `"${product.name}" added to cart`)
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to add to cart')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-text font-heading tracking-tight">My Wishlist</h2>
        <p className="text-xs text-text-muted mt-0.5">{likedProducts.length > 0 ? `${likedProducts.length} saved item${likedProducts.length !== 1 ? 's' : ''}` : 'Your wishlist is empty'}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 overflow-hidden animate-pulse">
              <div className="h-48 bg-text-muted/10" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-text-muted/20" />
                <div className="h-5 w-1/3 rounded bg-text-muted/20" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-12 text-center">
          <Heart className="w-16 h-16 text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted font-bold">Your wishlist is empty</p>
          <p className="text-xs text-text-muted/70 mt-1">Save your favorite products for later</p>
          <button
            onClick={() => navigate('/customer/products')}
            className="mt-4 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-600 transition-all"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => {
            const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
            const outOfStock = product.stockStatus === 'Out of Stock' || product.stockQuantity === 0

            return (
              <div
                key={product._id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center overflow-hidden">
                  {primaryImage?.url ? (
                    <img src={primaryImage.url} alt={primaryImage.alt || product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Package className="w-12 h-12 text-text-muted/30" />
                  )}
                  <button
                    onClick={() => removeFromWishlist(product._id, product.name)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm border border-outlineVariant/30 hover:scale-110 transition-all"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                  {outOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-error text-white text-[10px] font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    {product.brand && (
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{product.brand.name}</p>
                    )}
                    <h3 className="text-sm font-bold text-text leading-tight line-clamp-2">{product.name}</h3>
                  </div>

                  {product.rating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-text-muted font-medium">({product.reviewCount})</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-text">GHS {product.price.toLocaleString()}</span>
                      {product.oldPrice && (
                        <span className="text-[10px] text-text-muted line-through">GHS {product.oldPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={outOfStock}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        outOfStock
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                          : 'bg-primary/10 text-primary hover:bg-primary hover:text-white active:scale-95'
                      }`}
                      title={outOfStock ? 'Out of stock' : 'Add to cart'}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
