import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Heart, Star, SlidersHorizontal, ChevronDown, Package, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

interface Product {
  _id: string
  name: string
  slug: string
  description?: string
  price: number
  oldPrice?: number
  rating: number
  reviewCount: number
  stockStatus: string
  stockQuantity: number
  brand?: { _id: string; name: string }
  category?: { _id: string; name: string }
  images: { url: string; alt: string; isPrimary: boolean }[]
  isActive: boolean
}

interface Brand { _id: string; name: string }
interface Category { _id: string; name: string }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('')
  const [likedProducts, setLikedProducts] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('technova_wishlist') || '[]') }
    catch { return [] }
  })
  const { token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    localStorage.setItem('technova_wishlist', JSON.stringify(likedProducts))
  }, [likedProducts])

  useEffect(() => {
    if (!token) return
    const fetchFilters = async () => {
      try {
        const [br, cr] = await Promise.all([
          fetch('/api/v1/brands'),
          fetch('/api/v1/categories')
        ])
        if (br.ok) { const d = await br.json(); setBrands(d.data || []) }
        if (cr.ok) { const d = await cr.json(); setCategories(d.data || []) }
      } catch { /* ignore */ }
    }
    fetchFilters()
  }, [token])

  useEffect(() => {
    setPage(1)
  }, [search, selectedBrand, selectedCategory, sortBy])

  useEffect(() => {
    if (!token) return
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: page.toString(), limit: '12' })
        if (search) params.append('search', search)
        if (selectedBrand) params.append('brand', selectedBrand)
        if (selectedCategory) params.append('category', selectedCategory)

        const sortConfig: Record<string, { sortBy: string; sortOrder: string }> = {
          'price_asc': { sortBy: 'price', sortOrder: 'asc' },
          'price_desc': { sortBy: 'price', sortOrder: 'desc' },
          'rating': { sortBy: 'rating', sortOrder: 'desc' },
          'newest': { sortBy: 'createdAt', sortOrder: 'desc' }
        }
        if (sortBy && sortConfig[sortBy]) {
          params.append('sortBy', sortConfig[sortBy].sortBy)
          params.append('sortOrder', sortConfig[sortBy].sortOrder)
        }

        const res = await fetch(`/api/v1/products?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setProducts(data.data || data.products || [])
          setTotalPages(data.pagination?.pages || 1)
        }
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetchProducts()
  }, [token, page, search, selectedBrand, selectedCategory, sortBy])

  const toggleWishlist = (id: string, name: string) => {
    if (likedProducts.includes(id)) {
      setLikedProducts(prev => prev.filter(p => p !== id))
      toast('info', `Removed "${name}" from wishlist`)
    } else {
      setLikedProducts(prev => [...prev, id])
      toast('success', `Added "${name}" to wishlist`)
    }
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
        <h2 className="text-2xl font-black text-text font-heading tracking-tight">Products</h2>
        <p className="text-xs text-text-muted mt-0.5">Browse our catalog and find your next device</p>
      </div>

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
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 bg-background border border-outlineVariant/60 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
              >
                <option value="">Sort by</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-all duration-200 ${
                showFilters || selectedBrand || selectedCategory
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-background border-outlineVariant/60 text-text-muted hover:border-primary/40'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-outlineVariant/20 flex flex-wrap gap-3 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 bg-background border border-outlineVariant/60 rounded-lg text-xs outline-none"
              >
                <option value="">All Brands</option>
                {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 bg-background border border-outlineVariant/60 rounded-lg text-xs outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            {(selectedBrand || selectedCategory) && (
              <button
                onClick={() => { setSelectedBrand(''); setSelectedCategory('') }}
                className="px-2.5 py-1.5 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors text-xs font-medium flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 overflow-hidden animate-pulse">
              <div className="h-48 bg-text-muted/10" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-text-muted/20" />
                <div className="h-3 w-1/2 rounded bg-text-muted/20" />
                <div className="h-5 w-1/3 rounded bg-text-muted/20" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-text-muted/20 mx-auto mb-4" />
          <p className="text-text-muted font-bold">No products found</p>
          <p className="text-xs text-text-muted/70 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => {
              const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
              const isLiked = likedProducts.includes(product._id)
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
                      onClick={() => toggleWishlist(product._id, product.name)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm border border-outlineVariant/30 hover:scale-110 transition-all"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-text-muted">Page {page} of {totalPages}</p>
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
        </>
      )}
    </div>
  )
}
