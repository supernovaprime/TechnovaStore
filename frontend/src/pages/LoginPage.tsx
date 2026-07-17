import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import appleBg from '@/images/Apple.jpg'
import { Mail, Lock, User, Eye, EyeOff, Phone, ChevronRight, Star, Heart, ShieldCheck, Truck, Sparkles, MessageSquare, ArrowLeft } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

type AuthMode = 'login' | 'register'

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(1424)
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLikeToggle = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          toast('error', 'Passwords do not match')
          setLoading(false)
          return
        }

        const response = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role: 'customer' }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        navigate('/')
        return
      }

      await login(email, password)
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        if (parsed.role === 'customer') {
          navigate('/customer')
        } else {
          navigate('/admin')
        }
      } else {
        navigate('/admin')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      if (message.toLowerCase().includes('deactivated')) {
        navigate('/deactivated')
        return
      }
      toast('error', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Global Backdrop */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105" style={{ backgroundImage: `url(${appleBg})` }} />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -ml-64 -mb-64" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-20 w-full px-6 py-4 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-primary font-heading tracking-tight">TechNova</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm text-primary rounded-full border border-primary/10 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Premium Mobile Hub</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-sm border border-primary/10 shadow-sm text-primary hover:bg-primary hover:text-white transition-all duration-200 hover:scale-105"
            title="Back to landing page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">

          {/* Left Bento Grid */}
          <section className="hidden lg:grid lg:col-span-6 gap-4 grid-cols-2">
            {/* Featured Product */}
            <div className="col-span-2 bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-outlineVariant/50 shadow-lg shadow-black/5 flex justify-between items-center group relative overflow-hidden">
              <div className="space-y-2 max-w-[70%]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Weekly Favorite
                </span>
                <h3 className="font-extrabold text-lg text-text tracking-tight">iPhone 15 Pro Max Titanium</h3>
                <p className="text-xs text-text-muted">Space-grade titanium with advanced 5x Telephoto lenses now in inventory.</p>
                <div className="flex items-center gap-1.5 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[10px] text-text-muted font-bold ml-1">(4.9 out of 5)</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white/90 border border-outlineVariant/40 p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <button onClick={handleLikeToggle} className="p-2.5 rounded-full bg-rose-50 hover:bg-rose-100 transition-all duration-200 hover:scale-110 active:scale-95">
                  <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-text-muted/40'}`} />
                </button>
                <span className="text-[10px] font-black text-text tracking-tight">{likeCount.toLocaleString()}</span>
                <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Likes</span>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-outlineVariant/50 shadow-lg shadow-black/5 flex gap-4 items-center">
              <span className="p-3.5 bg-success/10 text-success rounded-2xl"><Truck className="w-5 h-5" /></span>
              <div>
                <h4 className="font-bold text-sm text-text">Swift Dispatch</h4>
                <p className="text-xs text-text-muted mt-0.5">Nationwide next-day express delivery.</p>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-outlineVariant/50 shadow-lg shadow-black/5 flex gap-4 items-center">
              <span className="p-3.5 bg-primary/10 text-primary rounded-2xl"><MessageSquare className="w-5 h-5" /></span>
              <div>
                <h4 className="font-bold text-sm text-text">Live Support</h4>
                <p className="text-xs text-text-muted mt-0.5">Agents available around-the-clock.</p>
              </div>
            </div>

            {/* Security */}
            <div className="col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-md p-5 rounded-3xl border border-primary/10 shadow-lg shadow-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                <p className="text-xs font-bold text-text">Encrypted gateway secures every transaction</p>
              </div>
              <span className="text-[10px] font-bold text-primary bg-white/80 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">Verified</span>
            </div>
          </section>

          {/* Right Auth Form */}
          <div className="col-span-1 lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-3xl border border-outlineVariant/60 shadow-xl shadow-primary/5 overflow-hidden transition-all duration-300">
              {/* Tabs */}
              <div className="flex border-b border-outlineVariant/30">
                <button type="button" onClick={() => { setMode('login') }}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${mode === 'login' ? 'border-primary text-primary bg-primary/[0.02]' : 'border-transparent text-text-muted hover:text-text'}`}
                >Sign In</button>
                <button type="button" onClick={() => { setMode('register') }}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${mode === 'register' ? 'border-primary text-primary bg-primary/[0.02]' : 'border-transparent text-text-muted hover:text-text'}`}
                >Create Account</button>
              </div>

              <div className="p-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {mode === 'register' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider" htmlFor="name">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors duration-200" />
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-outlineVariant/60 rounded-xl hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 text-xs outline-none" required />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider" htmlFor="email">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors duration-200" />
                      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-outlineVariant/60 rounded-xl hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 text-xs outline-none" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider" htmlFor="password">Password</label>
                      {mode === 'login' && (
                        <a href="#" className="text-[11px] text-secondary hover:underline font-bold">Forgot Password?</a>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors duration-200" />
                      <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-outlineVariant/60 rounded-xl hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 text-xs outline-none" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors duration-200" tabIndex={-1}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider" htmlFor="confirmPassword">Confirm Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors duration-200" />
                        <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 bg-white border border-outlineVariant/60 rounded-xl hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 text-xs outline-none" required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors duration-200" tabIndex={-1}>
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Toggle */}
                  <div className="flex items-center gap-3 py-1">
                    <button type="button" role="switch" aria-checked={remember} onClick={() => setRemember(!remember)}
                      className={`relative w-9 h-[22px] rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${remember ? 'bg-primary' : 'bg-outlineVariant'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200 ${remember ? 'translate-x-[18px]' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-xs text-text-secondary select-none cursor-pointer font-medium" onClick={() => setRemember(!remember)}>
                      Remember this device for 30 days
                    </span>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3 bg-primary hover:bg-primary-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Authenticating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        {mode === 'login' ? 'Sign In Securely' : 'Finalize Registration'}
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                </form>

                {/* SSO Divider */}
                <div className="relative my-5 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outlineVariant/50" />
                  </div>
                  <span className="relative px-3 bg-white text-[10px] text-text-muted uppercase tracking-widest font-bold">Alternative Methods</span>
                </div>

                {/* SSO Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button type="button"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-outlineVariant/80 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 active:scale-95 text-xs font-semibold text-text">
                    <FontAwesomeIcon icon={faGoogle} className="text-base text-rose-500" />
                    Google
                  </button>
                  <button type="button"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-outlineVariant/80 rounded-xl hover:border-secondary/40 hover:bg-secondary/5 transition-all duration-200 active:scale-95 text-xs font-semibold text-text">
                    <FontAwesomeIcon icon={faMicrosoft} className="text-base text-blue-500" />
                    Microsoft
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="px-6 py-4 bg-background/50 border-t border-outlineVariant/30 text-center">
                <p className="text-[10px] text-text-muted font-medium">
                  By continuing, you agree to TechNova's{' '}
                  <a href="#" className="text-secondary font-bold hover:underline">Terms of Service</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-3 border-t border-outlineVariant/30 bg-white/50 backdrop-blur-md mt-auto">
        <span className="text-[11px] text-text-muted font-medium">&copy; {new Date().getFullYear()} TechNova Mobile Store. All rights reserved.</span>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Help Center'].map((item) => (
            <a key={item} href="#" className="text-[11px] text-text-muted hover:text-primary transition-colors font-semibold">{item}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
