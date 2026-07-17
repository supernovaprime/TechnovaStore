import { useState, useEffect } from 'react'
import { X, Package, Loader2 } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'

interface Brand {
  _id: string
  name: string
}

interface Category {
  _id: string
  name: string
}

interface ProductData {
  _id: string
  name: string
  description?: string
  price: number
  stockQuantity: number
  brand: { _id: string; name: string } | null
  category: { _id: string; name: string } | null
}

interface AddProductModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  product?: ProductData | null
}

export default function AddProductModal({ open, onClose, onSuccess, product }: AddProductModalProps) {
  const { toast } = useToast()
  const isEdit = !!product

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')
  const [brandId, setBrandId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const fetchData = async () => {
      try {
        const [brandRes, catRes] = await Promise.all([
          fetch('/api/v1/brands'),
          fetch('/api/v1/categories')
        ])
        if (brandRes.ok) {
          const bd = await brandRes.json()
          setBrands(bd.data || [])
        }
        if (catRes.ok) {
          const cd = await catRes.json()
          setCategories(cd.data || [])
        }
      } catch { /* ignore */ }
    }
    fetchData()
  }, [open])

  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description || '')
      setPrice(product.price.toString())
      setStockQuantity(product.stockQuantity.toString())
      setBrandId(product.brand?._id || '')
      setCategoryId(product.category?._id || '')
    } else {
      reset()
    }
  }, [product])

  const reset = () => {
    setName('')
    setDescription('')
    setPrice('')
    setStockQuantity('')
    setBrandId('')
    setCategoryId('')
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !price || !brandId || !categoryId) {
      setError('Name, price, brand, and category are required')
      return
    }
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const body = JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity) || 0,
        brand: brandId,
        category: categoryId
      })

      const url = isEdit ? `/api/v1/products/${product!._id}` : '/api/v1/products'
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || data.message || `Failed to ${isEdit ? 'update' : 'create'} product`)
      }

      toast(isEdit ? 'success' : 'success', isEdit ? 'Product updated successfully' : 'Product created successfully')
      reset()
      onSuccess()
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to ${isEdit ? 'update' : 'create'} product`
      toast('error', message)
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <style>{`.scrollbar-rounded::-webkit-scrollbar { width: 6px; }
.scrollbar-rounded::-webkit-scrollbar-track { background: transparent; }
.scrollbar-rounded::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
.scrollbar-rounded::-webkit-scrollbar-thumb:hover { background: #94a3b8; }`}</style>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-rounded">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outlineVariant/30">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isEdit ? 'bg-accent/10' : 'bg-primary/10'}`}>
              <Package className={`w-4 h-4 ${isEdit ? 'text-accent' : 'text-primary'}`} />
            </div>
            <div>
              <h3 className="text-base font-bold text-text font-heading">{isEdit ? 'Edit Product' : 'Add Product'}</h3>
              <p className="text-xs text-text-muted">{isEdit ? 'Update product details' : 'Create a new product listing'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background transition-colors">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="iPhone 15 Pro Max"
              className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description..."
              rows={3}
              className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">Price (GHS)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="999.99"
                className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="50"
                className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">Brand</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm outline-none transition-all"
                required
              >
                <option value="">Select brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm outline-none transition-all"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-background border border-outlineVariant/60 rounded-xl text-sm font-semibold text-text hover:bg-outlineVariant/20 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isEdit ? 'bg-accent hover:bg-accent-600' : 'bg-primary hover:bg-primary-600'}`}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
