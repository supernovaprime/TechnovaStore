import { useState } from 'react'
import { X, Building2, Loader2 } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'

interface AddBrandModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddBrandModal({ open, onClose, onSuccess }: AddBrandModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const reset = () => {
    setName('')
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name) {
      setError('Brand name is required')
      return
    }
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/v1/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || data.message || 'Failed to create brand')
      }
      toast('success', `Brand "${name}" created successfully`)
      reset()
      onSuccess()
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create brand'
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-rounded">
        <style>{`.scrollbar-rounded::-webkit-scrollbar { width: 6px; }
.scrollbar-rounded::-webkit-scrollbar-track { background: transparent; }
.scrollbar-rounded::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
.scrollbar-rounded::-webkit-scrollbar-thumb:hover { background: #94a3b8; }`}</style>
        <div className="flex items-center justify-between px-6 py-4 border-b border-outlineVariant/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text font-heading">Add Brand</h3>
              <p className="text-xs text-text-muted">Create a new brand</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background transition-colors">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text">Brand Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Apple"
              className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm outline-none transition-all"
              required
            />
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
              className="flex-1 py-2.5 bg-accent hover:bg-accent-600 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Creating...' : 'Create Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
