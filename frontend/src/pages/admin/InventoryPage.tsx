import { useState, useEffect } from 'react'
import { Search, Plus, Package, Edit3, Trash2, ChevronDown, SlidersHorizontal, AlertTriangle, Clock, ShoppingBag, Heart, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import AddProductModal from './AddProductModal'
import ConfirmModal from '../../components/ConfirmModal'

interface Product {
  _id: string
  name: string
  slug: string
  description?: string
  price: number
  oldPrice?: number
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock'
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  brand: { _id: string; name: string; slug: string } | null
  category: { _id: string; name: string; slug: string } | null
  images: { url: string; alt: string; isPrimary: boolean }[]
  createdAt: string
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stockFilter, setStockFilter] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [likedProducts, setLikedProducts] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('technova_watchlist') || '[]') }
    catch { return [] }
  })
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    localStorage.setItem('technova_watchlist', JSON.stringify(likedProducts))
  }, [likedProducts])

  const toggleLike = (id: string, name: string) => {
    if (likedProducts.includes(id)) {
      setLikedProducts(prev => prev.filter(p => p !== id))
      toast('info', `Removed "${name}" from watchlist`)
    } else {
      setLikedProducts(prev => [...prev, id])
      toast('success', `Added "${name}" to watchlist`)
    }
  }

  const fetchProducts = async (searchTerm?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: '10' })
      const term = searchTerm ?? search
      if (term) params.append('search', term)
      if (stockFilter) params.append('stockStatus', stockFilter)

      const response = await fetch(`/api/v1/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 401) {
        logout()
        navigate('/login', { replace: true })
        return
      }

      if (!response.ok) throw new Error('Failed to fetch products')

      const data = await response.json()
      setProducts(data.data?.products || data.data || [])
      setTotalPages(data.data?.totalPages || data.totalPages || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchProducts()
    else setLoading(false)
  }, [token, page, stockFilter])

  useEffect(() => {
    setPage(1)
  }, [search, stockFilter])

  useEffect(() => {
    if (!token) return
    const timer = setTimeout(() => fetchProducts(), 400)
    return () => clearTimeout(timer)
  }, [search])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const response = await fetch(`/api/v1/products/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Failed to delete product')
      toast('success', `"${deleteTarget.name}" deleted successfully`)
      setDeleteTarget(null)
      fetchProducts()
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  const lowStockCount = products.filter(p => p.stockStatus === 'Low Stock' || (p.stockQuantity > 0 && p.stockQuantity < 10)).length
  const outOfStockCount = products.filter(p => p.stockQuantity === 0).length
  const normalStockCount = products.filter(p => p.stockStatus === 'In Stock' && p.stockQuantity >= 10).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text font-heading">Inventory</h2>
          <p className="text-sm text-text-muted mt-0.5">Product catalog and stock logs</p>
        </div>
        <button
          onClick={() => setShowAddProduct(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stock Intelligence Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setStockFilter(stockFilter === 'In Stock' ? '' : 'In Stock')}
          className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
            stockFilter === 'In Stock'
              ? 'bg-success/10 border-success shadow-sm ring-1 ring-success/30'
              : 'bg-white/70 backdrop-blur-xl border-outlineVariant/40 hover:border-success/30 hover:shadow-sm'
          }`}
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">In Stock</p>
            <p className="text-2xl font-black text-success">{normalStockCount} {normalStockCount === 1 ? 'SKU' : 'SKUs'}</p>
            <p className="text-[10px] text-text-muted/80">Operational units</p>
          </div>
          <span className="p-3 bg-success/10 text-success rounded-xl"><CheckCircle className="w-5 h-5" /></span>
        </div>

        <div
          onClick={() => setStockFilter(stockFilter === 'Low Stock' ? '' : 'Low Stock')}
          className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
            stockFilter === 'Low Stock'
              ? 'bg-warning/10 border-warning shadow-sm ring-1 ring-warning/30'
              : 'bg-white/70 backdrop-blur-xl border-outlineVariant/40 hover:border-warning/30 hover:shadow-sm'
          }`}
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Low Stock</p>
            <p className="text-2xl font-black text-warning">{lowStockCount} {lowStockCount === 1 ? 'SKU' : 'SKUs'}</p>
            <p className="text-[10px] text-text-muted/80">Reorder recommended</p>
          </div>
          <span className="p-3 bg-warning/10 text-warning rounded-xl"><AlertTriangle className="w-5 h-5" /></span>
        </div>

        <div
          onClick={() => setStockFilter(stockFilter === 'Out of Stock' ? '' : 'Out of Stock')}
          className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
            stockFilter === 'Out of Stock'
              ? 'bg-error/10 border-error shadow-sm ring-1 ring-error/30'
              : 'bg-white/70 backdrop-blur-xl border-outlineVariant/40 hover:border-error/30 hover:shadow-sm'
          }`}
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Out of Stock</p>
            <p className="text-2xl font-black text-error">{outOfStockCount} {outOfStockCount === 1 ? 'SKU' : 'SKUs'}</p>
            <p className="text-[10px] text-text-muted/80">Depleted inventory</p>
          </div>
          <span className="p-3 bg-error/10 text-error rounded-xl"><XCircle className="w-5 h-5" /></span>
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
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm transition-all outline-none"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 bg-background border border-outlineVariant/60 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
              >
                <option value="">All Stock</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
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

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-outlineVariant/20 text-xs text-text-muted flex flex-wrap gap-2 items-center">
            <span className="font-semibold">Watchlist:</span>
            <span className="px-2.5 py-1 rounded-md bg-background border border-outlineVariant/40 font-medium flex items-center gap-1">
              <Heart className={`w-3 h-3 ${likedProducts.length > 0 ? 'fill-error text-error' : 'text-text-muted'}`} />
              {likedProducts.length} monitored
            </span>
            {stockFilter && (
              <button onClick={() => setStockFilter('')} className="px-2.5 py-1 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors font-medium">
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Logs */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outlineVariant/30 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text font-heading">Product Activity Log</h3>
            <p className="text-xs text-text-muted mt-0.5">Real-time inventory updates and stock monitoring</p>
          </div>
          {likedProducts.length > 0 && (
            <span className="text-[10px] bg-error/10 border border-error/20 text-error px-2.5 py-1 rounded-full font-bold">
              Watching {likedProducts.length} products
            </span>
          )}
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
                <div className="h-6 w-20 rounded-full bg-text-muted/20 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error text-sm">{error}</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <p className="text-text-muted font-medium">No products found</p>
            <p className="text-sm text-text-muted/70 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            {products.map((product) => {
              const isLowStock = product.stockQuantity < 10 && product.stockQuantity > 0
              const isOutOfStock = product.stockQuantity === 0
              const isDanger = isLowStock || isOutOfStock
              const isLiked = likedProducts.includes(product._id)
              const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]

              return (
                <div
                  key={product._id}
                  className={`relative overflow-hidden rounded-xl border transition-all duration-200 group ${
                    isLiked ? 'ring-1 ring-error/30 border-error/20' : ''
                  } ${
                    isDanger
                      ? 'bg-gradient-to-r from-error/5 via-white to-error/[0.02] border-error/15'
                      : 'bg-gradient-to-r from-success/5 via-white to-success/[0.02] border-success/15'
                  }`}
                >
                  <div className={`absolute inset-0 opacity-[0.03] ${
                    isDanger
                      ? 'bg-gradient-to-br from-error via-transparent to-transparent'
                      : 'bg-gradient-to-br from-success via-transparent to-transparent'
                  }`} />
                  <div className="relative flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => toggleLike(product._id, product.name)}
                        className="p-1 rounded-lg hover:bg-background transition-colors flex-shrink-0"
                      >
                        <Heart className={`w-4 h-4 transition-all ${isLiked ? 'fill-error text-error scale-110' : 'text-text-muted/40 hover:text-error'}`} />
                      </button>

                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-background flex-shrink-0 border border-outlineVariant/40 flex items-center justify-center">
                        {primaryImage?.url ? (
                          <img src={primaryImage.url} alt={primaryImage.alt || product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                            {product.name[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-text truncate">{product.name}</p>
                          {isDanger && (
                            <AlertTriangle className="w-3.5 h-3.5 text-error flex-shrink-0" />
                          )}
                          {isLiked && (
                            <span className="text-[9px] bg-error/10 text-error px-1.5 py-0.5 rounded border border-error/20 font-bold">
                              Watchlisted
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-text-muted truncate flex items-center gap-1 font-semibold">
                            <ShoppingBag className="w-3 h-3" />
                            {product.brand?.name || 'Generic'}
                          </span>
                          <span className="text-[10px] text-text-muted/40">|</span>
                          <span className="text-[10px] text-text-muted truncate">{product.category?.name || 'Uncategorized'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-text">GHS {product.price.toLocaleString()}</p>
                        <p className="text-[10px] text-text-muted flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}
                        </p>
                      </div>

                      <div className="flex flex-col items-center gap-0.5 min-w-[70px]">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap border ${
                          isOutOfStock
                            ? 'bg-error/10 text-error border-error/20'
                            : isLowStock
                              ? 'bg-warning/10 text-warning border-warning/20'
                              : 'bg-success/10 text-success border-success/20'
                        }`}>
                          <Package className="w-3 h-3" />
                          {product.stockQuantity}
                        </span>
                        <span className={`text-[8px] font-bold tracking-wider uppercase ${
                          isOutOfStock ? 'text-error' : isLowStock ? 'text-warning' : 'text-success'
                        }`}>
                          {product.stockStatus}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1">
                        <button onClick={() => setEditingProduct(product)} className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-all duration-200" title="Edit">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(product)} className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-all duration-200" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
              Page {page} of {totalPages} &middot; Total stock items tracked
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

      <AddProductModal open={showAddProduct} onClose={() => setShowAddProduct(false)} onSuccess={fetchProducts} />
      <AddProductModal open={!!editingProduct} product={editingProduct} onClose={() => setEditingProduct(null)} onSuccess={fetchProducts} />
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
