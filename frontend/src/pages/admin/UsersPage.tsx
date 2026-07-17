import { useState, useEffect } from 'react'
import { Search, Users, Shield, UserCog, Trash2, ChevronDown, SlidersHorizontal, Mail, Clock, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import ConfirmModal from '../../components/ConfirmModal'
import AddStaffModal from './AddStaffModal'
import ViewUserModal from '../../components/ViewUserModal'

interface UserData {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
  isEmailVerified: boolean
  lastLogin?: string
  createdAt: string
  avatar?: string
}

const roleIcons: Record<string, typeof Shield> = {
  admin: Shield,
  manager: UserCog,
  customer: Users
}

const roleStyles: Record<string, string> = {
  admin: 'bg-primary/10 text-primary border-primary/20',
  manager: 'bg-accent/10 text-accent border-accent/20',
  customer: 'bg-secondary/10 text-secondary border-secondary/20'
}

const roleAvatarStyles: Record<string, string> = {
  admin: 'from-primary/10 to-primary/20 text-primary border-primary/10',
  manager: 'from-accent/10 to-accent/20 text-accent border-accent/10',
  customer: 'from-secondary/10 to-secondary/20 text-secondary border-secondary/10'
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [viewUserId, setViewUserId] = useState<string | null>(null)
  const { token, logout, user: currentUser } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const fetchUsers = async (searchTerm?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: '20' })
      const term = searchTerm ?? search
      if (term) params.append('search', term)
      if (roleFilter) params.append('role', roleFilter)

      const response = await fetch(`/api/v1/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 401) {
        logout()
        navigate('/login', { replace: true })
        return
      }

      if (!response.ok) throw new Error('Failed to fetch users')

      const result = await response.json()
      setUsers(result.data || [])
      setTotalPages(result.pagination?.total ? Math.ceil(result.pagination.total / 20) : 1)
      setTotalUsers(result.pagination?.total || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchUsers()
    else setLoading(false)
  }, [token, page, roleFilter])

  useEffect(() => {
    setPage(1)
  }, [search, roleFilter])

  useEffect(() => {
    if (!token) return
    const timer = setTimeout(() => fetchUsers(), 400)
    return () => clearTimeout(timer)
  }, [search])

  const handleToggleStatus = async (user: UserData) => {
    try {
      const response = await fetch(`/api/v1/users/${user._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !user.isActive })
      })
      if (!response.ok) throw new Error('Failed to update status')
      toast('success', `"${user.name}" ${user.isActive ? 'deactivated' : 'activated'} successfully`)
      fetchUsers()
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const response = await fetch(`/api/v1/users/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Failed to delete user')
      toast('success', `"${deleteTarget.name}" deleted successfully`)
      setDeleteTarget(null)
      fetchUsers()
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  const activeCount = users.filter(u => u.isActive).length
  const inactiveCount = users.filter(u => !u.isActive).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text font-heading">Users</h2>
          <p className="text-sm text-text-muted mt-0.5">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
        >
          <Users className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-outlineVariant/40 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Registered</p>
            <p className="text-2xl font-black text-text">{totalUsers} {totalUsers === 1 ? 'user' : 'users'}</p>
            <p className="text-[10px] text-text-muted/80">All accounts</p>
          </div>
          <span className="p-3 bg-primary/10 text-primary rounded-xl"><Users className="w-5 h-5" /></span>
        </div>

        <div className="p-5 rounded-2xl border border-outlineVariant/40 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Active Accounts</p>
            <p className="text-2xl font-black text-success">{activeCount} {activeCount === 1 ? 'user' : 'users'}</p>
            <p className="text-[10px] text-text-muted/80">Currently active</p>
          </div>
          <span className="p-3 bg-success/10 text-success rounded-xl"><CheckCircle className="w-5 h-5" /></span>
        </div>

        <div className="p-5 rounded-2xl border border-outlineVariant/40 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Inactive Accounts</p>
            <p className="text-2xl font-black text-error">{inactiveCount} {inactiveCount === 1 ? 'user' : 'users'}</p>
            <p className="text-[10px] text-text-muted/80">Disabled or suspended</p>
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
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm transition-all outline-none"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 bg-background border border-outlineVariant/60 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="customer">Customer</option>
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
            {roleFilter && (
              <button onClick={() => setRoleFilter('')} className="px-2.5 py-1 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors font-medium">
                Clear role filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Users List */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outlineVariant/30">
          <h3 className="text-base font-bold text-text font-heading">Account Registry</h3>
          <p className="text-xs text-text-muted mt-0.5">User accounts and access control</p>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-background/50">
                <div className="w-10 h-10 rounded-full bg-text-muted/20 animate-pulse" />
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
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <p className="text-text-muted font-medium">No users found</p>
            <p className="text-sm text-text-muted/70 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            {users.map((user) => {
              const RoleIcon = roleIcons[user.role] || Users
              const isCurrentUser = currentUser?.id === user._id

              return (
                <div
                  key={user._id}
                  className={`relative overflow-hidden rounded-xl border transition-all duration-200 group ${
                    user.isActive
                      ? 'bg-gradient-to-r from-success/5 via-white to-success/[0.02] border-success/15'
                      : 'bg-gradient-to-r from-error/5 via-white to-error/[0.02] border-error/15'
                  }`}
                >
                  <div className={`absolute inset-0 opacity-[0.03] ${
                    user.isActive
                      ? 'bg-gradient-to-br from-success via-transparent to-transparent'
                      : 'bg-gradient-to-br from-error via-transparent to-transparent'
                  }`} />
                  <div className="relative flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${roleAvatarStyles[user.role] || 'from-primary/10 to-primary/20 text-primary border-primary/10'} flex items-center justify-center font-bold text-sm flex-shrink-0 border`}>
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.name[0]?.toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-text truncate">{user.name}</p>
                          {isCurrentUser && (
                            <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 font-bold">You</span>
                          )}
                          {!user.isActive && (
                            <AlertTriangle className="w-3.5 h-3.5 text-error flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-text-muted truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </span>
                          <span className="text-[10px] text-text-muted/40">|</span>
                          <span className="text-[10px] text-text-muted truncate flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <div className="flex flex-col items-center gap-0.5 min-w-[80px]">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap border ${roleStyles[user.role] || 'bg-background text-text-muted border-outlineVariant/40'}`}>
                          <RoleIcon className="w-3 h-3" />
                          {user.role}
                        </span>
                        <span className={`text-[8px] font-bold tracking-wider uppercase ${user.isActive ? 'text-success' : 'text-error'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1">
                        <button
                          onClick={() => setViewUserId(user._id)}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-all duration-200"
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            user.isActive
                              ? 'hover:bg-warning/10 text-text-muted hover:text-warning'
                              : 'hover:bg-success/10 text-text-muted hover:text-success'
                          }`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          disabled={isCurrentUser}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            isCurrentUser
                              ? 'text-text-muted/20 cursor-not-allowed'
                              : 'hover:bg-error/10 text-text-muted hover:text-error'
                          }`}
                          title={isCurrentUser ? 'Cannot delete yourself' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-outlineVariant/20 bg-background/50">
            <p className="text-[10px] text-text-muted">
              Page {page} of {totalPages} &middot; {totalUsers} total {totalUsers === 1 ? 'account' : 'accounts'}
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

      <AddStaffModal open={showAddUser} onClose={() => setShowAddUser(false)} onSuccess={fetchUsers} />
      <ViewUserModal userId={viewUserId} onClose={() => setViewUserId(null)} />
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete User"
        message={`Permanently delete "${deleteTarget?.name}"? This will remove their account and all associated data.`}
        confirmLabel="Delete User"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
