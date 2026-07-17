import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let nextId = 0

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
}

const styles: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: { bg: 'bg-white', border: 'border-l-4 border-success', icon: 'text-success', text: 'text-text' },
  error: { bg: 'bg-white', border: 'border-l-4 border-error', icon: 'text-error', text: 'text-text' },
  warning: { bg: 'bg-white', border: 'border-l-4 border-warning', icon: 'text-warning', text: 'text-text' },
  info: { bg: 'bg-white', border: 'border-l-4 border-primary', icon: 'text-primary', text: 'text-text' }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((type: ToastType, message: string) => {
    const id = nextId++
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => removeToast(id), 5000)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(t => {
          const Icon = icons[t.type]
          const s = styles[t.type]
          return (
            <div key={t.id} className={`${s.bg} ${s.border} rounded-xl shadow-xl border border-outlineVariant/40 pointer-events-auto animate-slide-in`}>
              <div className="flex items-start gap-3 p-4">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${s.icon}`} />
                <p className={`text-sm font-medium flex-1 ${s.text}`}>{t.message}</p>
                <button onClick={() => removeToast(t.id)} className="p-0.5 rounded hover:bg-background transition-colors">
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
