import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Smartphone, ShoppingCart, Package, Heart, User, Gauge, PanelLeftClose, PanelLeft, LogOut, Bell, HelpCircle } from 'lucide-react'
import Footer from '../pages/Footer'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { icon: Gauge, label: 'Dashboard', path: '/customer' },
  { icon: Smartphone, label: 'Products', path: '/customer/products' },
  { icon: Package, label: 'My Orders', path: '/customer/orders' },
  { icon: ShoppingCart, label: 'Cart', path: '/customer/cart' },
  { icon: Heart, label: 'Wishlist', path: '/customer/wishlist' },
  { icon: User, label: 'Profile', path: '/customer/profile' },
]

export default function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="bg-background text-text min-h-screen flex">
      <aside className={`h-screen fixed left-0 top-0 bg-gradient-to-b from-secondary to-secondary-800 shadow-xl flex-col z-50 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'} hidden md:flex`}>
        <div className={`px-${sidebarOpen ? '6' : '4'} py-6 mb-6 flex items-center justify-between`}>
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white font-heading leading-tight">TechNova</h1>
                <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">Customer Portal</p>
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
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-white text-secondary shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-secondary' : 'text-white/70 group-hover:text-white'}`} />
                {sidebarOpen && (
                  <span className={`text-sm transition-colors duration-200 ${isActive ? 'font-bold text-secondary' : 'text-white/70 group-hover:text-white'}`}>{item.label}</span>
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {(user?.name?.[0] || 'U').toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-white/50 truncate">Customer</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden flex items-center justify-center text-white font-bold text-xs">
                {(user?.name?.[0] || 'U').toUpperCase()}
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
          message="Are you sure you want to sign out of your customer account?"
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

      <header className={`fixed top-4 right-4 bg-white/80 backdrop-blur-xl border border-outlineVariant/60 rounded-2xl z-40 h-14 flex items-center px-4 justify-between transition-all duration-300 shadow-lg shadow-black/5 ${sidebarOpen ? 'left-72' : 'left-24'} hidden md:flex`}>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-background transition-all duration-200 relative group">
            <Bell className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors duration-200" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-error rounded-full border-2 border-white" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-background transition-all duration-200 group">
            <HelpCircle className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors duration-200" />
          </button>
          <div className="h-6 w-px bg-outlineVariant/60 mx-1" />
          <button className="w-9 h-9 rounded-full overflow-hidden hover:ring-2 hover:ring-secondary/30 transition-all duration-200">
              <div className="w-full h-full bg-gradient-to-br from-secondary to-secondary-600 flex items-center justify-center text-white font-bold text-xs">
              {(user?.name?.[0] || 'U').toUpperCase()}
            </div>
          </button>
        </div>
      </header>

      <main className={`flex-1 pt-20 transition-all duration-300 md:ml-64`}>
        <div className="min-h-[calc(100vh-8rem)] px-4 md:px-6 pb-6">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  )
}
