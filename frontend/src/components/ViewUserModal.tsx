import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, Mail, Shield, Calendar, Clock, Activity } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface ViewUserModalProps {
  userId: string | null
  onClose: () => void
}

interface UserDetail {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
  isEmailVerified: boolean
  phone?: string
  password?: string
  lastLogin?: string
  createdAt: string
  updatedAt?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
}

export default function ViewUserModal({ userId, onClose }: ViewUserModalProps) {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    if (!userId) return
    const fetchUser = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/v1/users/view/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.data)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userId, token])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!userId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-outlineVariant/30 flex items-center justify-between">
          <h3 className="text-base font-bold text-text font-heading">
            {loading ? 'Loading...' : 'User Details'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background text-text-muted hover:text-text transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-text-muted/10 animate-pulse" />
            ))}
          </div>
        ) : user ? (
          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(80vh-64px)]">
            <div className="flex items-center gap-3 pb-4 border-b border-outlineVariant/20">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/10">
                {user.name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-text">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    user.isActive
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-error/10 text-error border-error/20'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    user.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' :
                    user.role === 'manager' ? 'bg-accent/10 text-accent border-accent/20' :
                    'bg-secondary/10 text-secondary border-secondary/20'
                  }`}>
                    <Shield className="w-3 h-3" />
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Email Address</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-background border border-outlineVariant/40 rounded-xl text-xs text-text">
                  <Mail className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                  {user.isEmailVerified && (
                    <span className="text-[9px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded ml-auto flex-shrink-0">Verified</span>
                  )}
                </div>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Password Hash</label>
                <div className="relative">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-background border border-outlineVariant/40 rounded-xl text-xs text-text font-mono">
                    <span className="truncate">
                      {showPassword ? (user.password || '••••••••') : '••••••••'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white text-text-muted hover:text-text transition-colors"
                    title={showPassword ? 'Hide' : 'Show'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Role</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-background border border-outlineVariant/40 rounded-xl text-xs text-text">
                  <Shield className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                  {user.role}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Phone</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-background border border-outlineVariant/40 rounded-xl text-xs text-text">
                  {user.phone || '—'}
                </div>
              </div>

              {user.lastLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Last Login</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-background border border-outlineVariant/40 rounded-xl text-xs text-text">
                    <Clock className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                    {new Date(user.lastLogin).toLocaleString()}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Created</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-background border border-outlineVariant/40 rounded-xl text-xs text-text">
                  <Calendar className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              {user.updatedAt && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Last Updated</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-background border border-outlineVariant/40 rounded-xl text-xs text-text">
                    <Activity className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              )}

              {user.address && (user.address.street || user.address.city) && (
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Address</label>
                  <div className="px-3 py-2.5 bg-background border border-outlineVariant/40 rounded-xl text-xs text-text">
                    {[user.address.street, user.address.city, user.address.state, user.address.zipCode, user.address.country].filter(Boolean).join(', ') || '—'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-text-muted text-sm">Failed to load user details</div>
        )}
      </div>
    </div>
  )
}
