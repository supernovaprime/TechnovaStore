import { AlertTriangle, Loader2 } from 'lucide-react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  confirmVariant?: 'danger' | 'primary' | 'warning'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ open, title, message, confirmLabel = 'Delete', confirmVariant = 'danger', loading, onConfirm, onCancel }: ConfirmModalProps) {
  if (!open) return null

  const confirmStyles = {
    danger: 'bg-error hover:bg-error-600 focus:ring-error/30',
    primary: 'bg-primary hover:bg-primary-600 focus:ring-primary/30',
    warning: 'bg-warning hover:bg-warning-600 focus:ring-warning/30'
  }

  const iconStyles = {
    danger: 'bg-error/10 text-error',
    primary: 'bg-primary/10 text-primary',
    warning: 'bg-warning/10 text-warning'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${iconStyles[confirmVariant]}`}>
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-text font-heading">{title}</h3>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 bg-background border border-outlineVariant/60 rounded-xl text-sm font-semibold text-text hover:bg-outlineVariant/20 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${confirmStyles[confirmVariant]}`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
