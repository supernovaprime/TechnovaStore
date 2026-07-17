import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, HelpCircle, Search, Gauge, Boxes, Users, ShoppingCart, BarChart3, Settings, ArrowRight, Wallet, UserPlus, Pencil, Shield, CheckCircle, PanelLeftClose, PanelLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState<{
    totalProducts: number
    totalOrders: number
    totalUsers: number
    totalRevenue: number
    inventoryValue: number
    recentOrders: any[]
    lowStockProducts: any[]
    pendingOrders: number
    recentActivities: any[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/v1/analytics/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.status === 401) {
          logout()
          navigate('/login', { replace: true })
          return
        }

        if (!response.ok) {
          const text = await response.text()
          throw new Error(text || 'Failed to fetch dashboard stats')
        }

        const data = await response.json()
        setStats(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchStats()
    } else {
      setLoading(false)
    }
  }, [token, logout, navigate])

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* SideNavBar */}
      <aside className={`h-screen fixed left-0 top-0 bg-secondary shadow-xl flex flex-col z-50 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'} rounded-3xl`}>
        <div className="px-6 py-6 mb-6 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/20">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-headline-md text-headline-md font-bold text-white leading-tight">TechNova</h1>
                <p className="text-label-sm text-white/70 uppercase tracking-widest">Admin Console</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
          >
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-evenly px-4">
          {[
            { icon: BarChart3, label: 'Dashboard', active: true },
            { icon: Boxes, label: 'Inventory', active: false },
            { icon: Users, label: 'Users', active: false },
            { icon: ShoppingCart, label: 'Orders', active: false },
            { icon: BarChart3, label: 'Analytics', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item) => (
            <Link
              key={item.label}
              to="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                item.active
                  ? 'bg-white text-secondary shadow-lg'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${item.active ? 'text-secondary' : 'text-white/80 group-hover:text-white'}`} />
              {sidebarOpen && (
                <span className={`font-body-md transition-colors duration-200 ${item.active ? 'font-bold text-secondary' : 'text-white/80 group-hover:text-white'}`}>{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="px-4 pt-6 border-t border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="overflow-hidden">
                <p className="font-label-md text-white truncate">Admin Profile</p>
                <p className="text-xs text-white/70 truncate">Master Admin</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* TopNavBar */}
      <header className={`fixed top-4 right-4 bg-white/80 backdrop-blur-xl border border-outline-variant/60 rounded-2xl z-40 h-16 flex items-center px-6 justify-between transition-all duration-300 shadow-lg shadow-black/5 ${sidebarOpen ? 'left-72' : 'left-24'}`}>
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors duration-200" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary/20 text-body-sm transition-all"
              placeholder="Search administrative records..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-all duration-200 relative group">
            <Bell className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors duration-200" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary-container rounded-full border-2 border-white animate-pulse" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-all duration-200 group">
            <HelpCircle className="w-5 h-5 text-on-surface-variant group-hover:text-secondary transition-colors duration-200" />
          </button>
          <div className="h-8 w-px bg-outline-variant/60 mx-1" />
          <button className="w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all duration-200">
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`pt-24 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="space-y-6">
          {/* System Overview Section */}
          <section className="px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">System Overview</h2>
              <span className="text-label-sm text-outline">Last updated: Just now</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-white/50 flex flex-col gap-2">
                    <div className="h-5 w-5 rounded bg-outline/20 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-outline/20 animate-pulse" />
                    <div className="h-6 w-16 rounded bg-outline/20 animate-pulse" />
                  </div>
                ))
              ) : error ? (
                <div className="col-span-full text-error text-sm">{error}</div>
              ) : stats ? (
                <>
                  {/* Stat Card 1 */}
                  <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-xl shadow-primary/5 flex flex-col gap-2 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                    <div className="flex items-center justify-between text-primary">
                      <span className="bg-primary/10 p-2 rounded-lg"><Wallet className="w-5 h-5" /></span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Live</span>
                    </div>
                    <p className="text-label-sm text-outline-variant">Total Inventory Value</p>
                     <p className="text-headline-md font-bold text-on-surface">GHS {stats.inventoryValue.toLocaleString()}</p>
                  </div>
                  {/* Stat Card 2 */}
                  <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-xl shadow-primary/5 flex flex-col gap-2 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                    <div className="flex items-center justify-between text-secondary">
                      <span className="bg-secondary/10 p-2 rounded-lg"><Users className="w-5 h-5" /></span>
                      <span className="text-xs font-bold text-primary bg-primary-fixed-dim/20 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-label-sm text-outline-variant">Active Users</p>
                    <p className="text-headline-md font-bold text-on-surface">{stats.totalUsers}</p>
                  </div>
                  {/* Stat Card 3 */}
                  <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-xl shadow-primary/5 flex flex-col gap-2 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                    <div className="flex items-center justify-between text-tertiary-container">
                      <span className="bg-tertiary-container/10 p-2 rounded-lg text-tertiary-container"><ShoppingCart className="w-5 h-5" /></span>
                      <span className="text-xs font-bold text-white bg-tertiary-container px-2 py-1 rounded-full">Total</span>
                    </div>
                    <p className="text-label-sm text-outline-variant">Total Orders Placed</p>
                    <p className="text-headline-md font-bold text-on-surface">{stats.totalOrders}</p>
                  </div>
                  {/* Stat Card 4 */}
                  <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-xl shadow-primary/5 flex flex-col gap-2 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                    <div className="flex items-center justify-between text-green-600">
                      <span className="bg-green-50 p-2 rounded-lg text-green-600"><CheckCircle className="w-5 h-5" /></span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Stable</span>
                    </div>
                    <p className="text-label-sm text-outline-variant">System Status</p>
                    <p className="text-headline-md font-bold text-on-surface">{stats.pendingOrders} pending</p>
                  </div>
                </>
              ) : null}
            </div>
          </section>

          {/* Recent Administrative Activity */}
          <div className="w-full">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-primary/5 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300">
              <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
                <h3 className="font-headline-sm text-on-surface">Recent Administrative Activity</h3>
                <button className="text-primary text-label-sm font-bold hover:underline">View All Logs</button>
              </div>
              <div className="p-6">
                {stats?.recentActivities?.length ? (
                  <div className="space-y-4">
                    {stats.recentActivities.map((activity: any) => {
                      const isSuccess = activity.status === 'success'
                      const isLogin = activity.action === 'login'
                      const isRegister = activity.action === 'register'
                      const statusColor = isSuccess
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      const statusLabel = isSuccess ? 'Success' : 'Failed'
                      const iconColor = isLogin ? 'text-primary' : isRegister ? 'text-secondary' : 'text-tertiary-container'
                      const bgColor = isLogin ? 'bg-primary/5' : isRegister ? 'bg-secondary/5' : 'bg-tertiary-container/5'
                      const activityText = isLogin ? 'Login attempt' : isRegister ? 'New registration' : activity.action
                      const subText = activity.email
                      const adminText = activity.role ? activity.role.charAt(0).toUpperCase() + activity.role.slice(1) : 'System'
                      const IconComponent = isLogin ? Shield : isRegister ? UserPlus : Pencil

                      return (
                        <div key={activity._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-outline-variant/10 hover:bg-white/80 transition-colors">
                          <div className="flex items-center gap-4">
                            <span className={`${bgColor} p-3 rounded-xl ${iconColor}`}><IconComponent className="w-5 h-5" /></span>
                            <div>
                              <p className="font-label-md text-on-surface">{activityText}</p>
                              <p className="text-xs text-outline-variant">{subText}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-outline-variant">{adminText}</p>
                            <p className="text-xs text-outline-variant">
                              {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : ''}
                            </p>
                          </div>
                          <span className={`px-3 py-1 ${statusColor} rounded-full text-xs font-bold`}>{statusLabel}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-outline-variant text-sm">No recent activity</div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Meta */}
          <div className="pt-8 px-6 flex flex-col md:flex-row items-center justify-between text-label-sm text-outline gap-4">
            <p>© 2024 TechNova Mobile Store. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Support Center</a>
            </div>
          </div>
        </div>
      </main>

      {/* Contextual Floating Utility */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50">
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  )
}

