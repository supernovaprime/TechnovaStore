import { useState, useEffect, useRef } from 'react'
import { X, Package, Loader2, Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

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
  images?: { url: string; alt: string; isPrimary: boolean }[]
}

interface AddProductModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  product?: ProductData | null
}

export default function AddProductModal({ open, onClose, onSuccess, product }: AddProductModalProps) {
  const { toast } = useToast()
  const { logout } = useAuth()
  const navigate = useNavigate()
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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAuthError = (res: Response) => {
    if (res.status === 401) {
      logout()
      navigate('/login')
      return true
    }
    return false
  }

  const uploadImage = async (file: File) => {
    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/upload/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      if (!res.ok) {
        if (handleAuthError(res)) return
        const errData = await res.json()
        throw new Error(errData.error || errData.message || 'Upload failed')
      }
      const data = await res.json()
      setImageUrl(data.data.url)
    } catch (err) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        toast('error', 'Network error — check your connection')
        return
      }
      const message = err instanceof Error ? err.message : 'Image upload failed'
      toast('error', message)
      setError(message)
      setImageFile(null)
      setImagePreview('')
    } finally {
      setImageUploading(false)
    }
  }

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
      const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
      if (primaryImage) {
        setImageUrl(primaryImage.url)
        setImagePreview(primaryImage.url)
      }
    } else {
      reset()
    }
  }, [product, open])

  const reset = () => {
    setName('')
    setDescription('')
    setPrice('')
    setStockQuantity('')
    setBrandId('')
    setCategoryId('')
    setError('')
    setImageFile(null)
    setImagePreview('')
    setImageUrl('')
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
      const images = imageUrl ? [{ url: imageUrl, alt: name, isPrimary: true }] : []
      const body = JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity) || 0,
        brand: brandId,
        category: categoryId,
        images
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
        if (handleAuthError(response)) return
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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text">Product Image</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-primary/50 ${
                imagePreview ? 'border-primary/30 bg-primary/[0.02]' : 'border-outlineVariant/60 bg-background'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setImageFile(file)
                    setImagePreview(URL.createObjectURL(file))
                    uploadImage(file)
                  }
                }}
              />
              {imageUploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-xs text-text-muted">Uploading image...</span>
                </div>
              ) : imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="h-28 rounded-lg object-cover mx-auto shadow-sm" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setImageFile(null)
                      setImagePreview('')
                      setImageUrl('')
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-error text-white rounded-full shadow hover:bg-error/80 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Upload className="w-8 h-8 text-text-muted/40" />
                  <span className="text-xs text-text-muted">Click to upload product image</span>
                  <span className="text-[9px] text-text-muted/50">JPEG, PNG, WebP (max 5MB)</span>
                </div>
              )}
            </div>
            {imageUrl && !imageUploading && (
              <p className="text-[10px] text-success font-medium flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Image uploaded successfully
              </p>
            )}
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
