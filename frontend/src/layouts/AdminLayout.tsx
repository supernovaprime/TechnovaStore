import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Boxes, Users, ShoppingCart, BarChart3, Settings, PanelLeftClose, PanelLeft, LogOut, Shield, UserCog, User } from 'lucide-react'
import Footer from '../pages/Footer'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'

const allNavItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/admin' },
  { icon: Boxes, label: 'Inventory', path: '/admin/inventory' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: User, label: 'Profile', path: '/admin/profile' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
]

const roleNavMap: Record<string, string[]> = {
  admin: ['Dashboard', 'Inventory', 'Users', 'Orders', 'Analytics', 'Profile', 'Settings'],
  manager: ['Dashboard', 'Inventory', 'Orders', 'Analytics', 'Profile'],
}

const roleGradients: Record<string, { sidebar: string; active: string; avatar: string }> = {
  admin: { sidebar: 'from-primary-600 to-primary-800', active: 'text-primary', avatar: 'from-primary to-primary' },
  manager: { sidebar: 'from-accent-600 to-accent-800', active: 'text-accent', avatar: 'from-accent to-accent' },
}

const roleIcons: Record<string, typeof Shield> = {
  admin: Shield,
  manager: UserCog,
}

const roleTitles: Record<string, string> = {
  admin: 'Admin Console',
  manager: 'Manager Console',
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const role = user?.role || 'admin'
  const allowedLabels = roleNavMap[role] || roleNavMap.admin
  const navItems = allNavItems.filter(item => allowedLabels.includes(item.label))
  const grad = roleGradients[role] || roleGradients.admin
  const RoleIcon = roleIcons[role] || Shield
  const title = roleTitles[role] || 'Admin Console'

  return (
    <div className="bg-background text-text min-h-screen flex">
      {/* SideNavBar */}
      <aside className={`h-screen fixed left-0 top-0 bg-gradient-to-b ${grad.sidebar} shadow-xl flex flex-col z-50 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className={`px-${sidebarOpen ? '6' : '4'} py-6 mb-6 flex items-center justify-between`}>
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/20">
                <RoleIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white font-heading leading-tight">TechNova</h1>
                <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">{title}</p>
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

        <nav className="flex-1 flex flex-col justify-evenly px-3">
          {navItems.map((item) => {
            const isActive = item.path !== '#' && location.pathname === item.path
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? grad.active : 'text-white/70 group-hover:text-white'}`} />
                {sidebarOpen && (
                  <span className={`text-sm transition-colors duration-200 ${isActive ? `font-bold ${grad.active}` : 'text-white/70 group-hover:text-white'}`}>{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 pt-5 pb-6 border-t border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center gap-1 p-1.5 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setLogoutOpen(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-error/20 text-red-200 hover:bg-error hover:text-white transition-all shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 flex-1 min-w-0 px-1">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad.avatar} overflow-hidden flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                  {(user?.name?.[0] || 'A').toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'Profile'}</p>
                  <p className="text-[11px] text-white/50 truncate capitalize">{role}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${grad.avatar} overflow-hidden flex items-center justify-center text-white font-bold text-xs`}>
                {(user?.name?.[0] || 'A').toUpperCase()}
              </div>
              <button
                onClick={() => setLogoutOpen(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-error/20 text-red-200 hover:bg-error hover:text-white transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <ConfirmModal
          open={logoutOpen}
          title="Sign Out"
          message="Are you sure you want to sign out of the admin console?"
          confirmLabel="Sign Out"
          confirmVariant="danger"
          loading={loggingOut}
          onConfirm={() => {
            setLoggingOut(true)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/login')
          }}
          onCancel={() => setLogoutOpen(false)}
        />
      </aside>

      {/* Main Content */}
      <main className={`flex-1 pt-20 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="min-h-[calc(100vh-8rem)] px-6 pb-6">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  )
}
