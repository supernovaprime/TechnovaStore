import { useNavigate } from 'react-router-dom'
import { ShieldOff, ArrowLeft } from 'lucide-react'

export default function DeactivatedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-2xl bg-error/10 mx-auto mb-6 flex items-center justify-center border border-error/20">
          <ShieldOff className="w-10 h-10 text-error" />
        </div>
        <h1 className="text-4xl font-black text-text font-heading mb-2">404</h1>
        <p className="text-lg font-bold text-text mb-2">Page Not Found</p>
        <p className="text-sm text-text-muted mb-8 max-w-sm mx-auto">
          The page you requested could not be found. It may have been moved, deleted, or you may not have the required permissions.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-xl border border-outlineVariant/40 text-text hover:text-primary text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-sm active:scale-[0.98]"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
