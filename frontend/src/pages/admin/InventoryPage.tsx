import { useState, useEffect } from 'react'
import { Search, Plus, Package, Info, Trash2, ChevronDown, SlidersHorizontal, AlertTriangle, Heart, CheckCircle, XCircle, Star, List } from 'lucide-react'
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
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
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
      const params = new URLSearchParams({ page: page.toString(), limit: pageSize.toString() })
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
      setProducts(data.data || [])
      setTotalPages(data.pagination?.pages || 1)
      setTotalItems(data.pagination?.total || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchProducts()
    else setLoading(false)
  }, [token, page, pageSize, stockFilter])

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
            {products.map((product) => {
              const isLowStock = product.stockQuantity < 10 && product.stockQuantity > 0
              const isOutOfStock = product.stockQuantity === 0
              const isLiked = likedProducts.includes(product._id)
              const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]

              return (
                <div
                  key={product._id}
                  className={`bg-white/70 backdrop-blur-xl rounded-2xl border shadow-sm overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${
                    isLiked ? 'ring-2 ring-error/20 border-error/20' : 'border-outlineVariant/40'
                  }`}
                >
                  <div className="relative h-48 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center overflow-hidden">
                    {primaryImage?.url ? (
                      <img src={primaryImage.url} alt={primaryImage.alt || product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Package className="w-12 h-12 text-text-muted/30" />
                    )}
                    <button
                      onClick={() => toggleLike(product._id, product.name)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm border border-outlineVariant/30 hover:scale-110 transition-all"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                    </button>
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-error text-white text-[10px] font-bold px-3 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}
                    {isLowStock && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-warning text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {product.stockQuantity} left
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      {product.brand && (
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{product.brand.name}</p>
                      )}
                      <h3 className="text-sm font-bold text-text leading-tight line-clamp-2">{product.name}</h3>
                      {product.category && (
                        <p className="text-[10px] text-text-muted">{product.category.name}</p>
                      )}
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
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 rounded-xl transition-all duration-200 bg-primary/10 text-primary hover:bg-primary hover:text-white active:scale-95"
                          title="View / Edit"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="p-2 rounded-xl transition-all duration-200 bg-error/10 text-error hover:bg-error hover:text-white active:scale-95"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-3 border-t border-outlineVariant/20 bg-background/50 gap-3">
          <div className="flex items-center gap-3">
            <p className="text-[10px] text-text-muted">
              Page {page} of {totalPages} &middot; {totalItems} total products
            </p>
            <div className="flex items-center gap-1.5">
              <List className="w-3 h-3 text-text-muted" />
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
                className="appearance-none pl-2 pr-6 py-1 text-[10px] bg-white border border-outlineVariant/60 rounded-lg outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary cursor-pointer"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
          </div>
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
