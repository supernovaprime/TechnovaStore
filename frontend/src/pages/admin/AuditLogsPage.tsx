import { useState, useEffect } from 'react'
import { Search, Shield, ChevronDown, SlidersHorizontal, Clock, CheckCircle, XCircle, Filter } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface AuditLog {
  _id: string
  action: string
  email?: string
  role?: string
  ip?: string
  userAgent?: string
  status: string
  failureReason?: string
  createdAt: string
}

const actionLabels: Record<string, string> = {
  login: 'Login attempt',
  register: 'New registration',
  logout: 'Logout',
  password_change: 'Password change',
  profile_update: 'Profile update',
  admin_action: 'Admin action'
}

const actionIcons: Record<string, string> = {
  login: 'bg-primary/10 text-primary',
  register: 'bg-secondary/10 text-secondary',
  logout: 'bg-accent/10 text-accent',
  password_change: 'bg-warning/10 text-warning',
  profile_update: 'bg-info/10 text-info',
  admin_action: 'bg-error/10 text-error'
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)
  const [actionFilter, setActionFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: '25' })
      if (actionFilter) params.append('action', actionFilter)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/v1/audit?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 401) {
        logout()
        navigate('/login', { replace: true })
        return
      }

      if (!response.ok) throw new Error('Failed to fetch audit logs')

      const result = await response.json()
      setLogs(result.data?.logs || [])
      setTotalPages(result.data?.pagination?.pages || 1)
      setTotalLogs(result.data?.pagination?.total || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchLogs()
    else setLoading(false)
  }, [token, page, actionFilter, statusFilter])

  useEffect(() => {
    setPage(1)
  }, [actionFilter, statusFilter])

  useEffect(() => {
    if (!token) return
    const timer = setTimeout(() => fetchLogs(), 400)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text font-heading">Audit Logs</h2>
          <p className="text-sm text-text-muted mt-0.5">Complete security event history</p>
        </div>
        {totalLogs > 0 && (
          <span className="text-[11px] bg-background border border-outlineVariant/40 px-3 py-1.5 rounded-lg font-semibold text-text-muted">
            {totalLogs.toLocaleString()} total entries
          </span>
        )}
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or IP..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm transition-all outline-none"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 bg-background border border-outlineVariant/60 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer min-w-[140px]"
              >
                <option value="">All Actions</option>
                <option value="login">Login</option>
                <option value="register">Register</option>
                <option value="logout">Logout</option>
                <option value="password_change">Password Change</option>
                <option value="profile_update">Profile Update</option>
                <option value="admin_action">Admin Action</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 bg-background border border-outlineVariant/60 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer min-w-[120px]"
              >
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
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
            <Filter className="w-3.5 h-3.5" />
            {actionFilter && (
              <button onClick={() => setActionFilter('')} className="px-2.5 py-1 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors font-medium">
                Clear action filter
              </button>
            )}
            {statusFilter && (
              <button onClick={() => setStatusFilter('')} className="px-2.5 py-1 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors font-medium">
                Clear status filter
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outlineVariant/30">
          <h3 className="text-base font-bold text-text font-heading">Event Log</h3>
          <p className="text-xs text-text-muted mt-0.5">Full audit trail from the database</p>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, idx) => (
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
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <p className="text-text-muted font-medium">No audit logs found</p>
            <p className="text-sm text-text-muted/70 mt-1">No events match your current filters</p>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            {logs.map((log) => {
              const isSuccess = log.status === 'success'
              const label = actionLabels[log.action] || log.action

              return (
                <div
                  key={log._id}
                  className={`relative overflow-hidden rounded-xl border transition-all duration-200 ${
                    isSuccess
                      ? 'bg-gradient-to-r from-success/5 via-white to-success/[0.02] border-success/15'
                      : 'bg-gradient-to-r from-error/5 via-white to-error/[0.02] border-error/15'
                  }`}
                >
                  <div className={`absolute inset-0 opacity-[0.03] ${
                    isSuccess
                      ? 'bg-gradient-to-br from-success via-transparent to-transparent'
                      : 'bg-gradient-to-br from-error via-transparent to-transparent'
                  }`} />
                  <div className="relative flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`p-2 rounded-xl flex-shrink-0 ${actionIcons[log.action] || 'bg-text-muted/10 text-text-muted'}`}>
                        <Shield className="w-4 h-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-text truncate">{label}</p>
                          {log.role && (
                            <span className="text-[9px] font-bold uppercase bg-background border border-outlineVariant/30 px-1.5 py-0.5 rounded text-text-muted">
                              {log.role}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {log.email && (
                            <span className="text-xs text-text-muted truncate">{log.email}</span>
                          )}
                          {log.ip && (
                            <>
                              <span className="text-[10px] text-text-muted/40">|</span>
                              <span className="text-[10px] text-text-muted font-mono">{log.ip}</span>
                            </>
                          )}
                        </div>
                        {log.failureReason && (
                          <p className="text-[10px] text-error mt-0.5">{log.failureReason}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSuccess ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}>
                        {isSuccess ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {isSuccess ? 'Success' : 'Failed'}
                      </span>
                      <span className="text-[10px] text-text-muted flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : ''}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-outlineVariant/20 bg-background/50">
            <p className="text-[10px] text-text-muted">
              Page {page} of {totalPages} &middot; {totalLogs.toLocaleString()} events logged
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
    </div>
  )
}
