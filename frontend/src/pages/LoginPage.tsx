import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import appleBg from '@/images/Apple.jpg'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { useAuth } from '@/contexts/AuthContext'

type AuthMode = 'login' | 'register'

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
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
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative overflow-hidden">
      {/* Global Background Elements */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${appleBg})` }}
        />
        <div className="absolute inset-0 bg-white/40" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-container/10 rounded-full blur-[120px] -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-container/10 rounded-full blur-[100px] -ml-64 -mb-64" />
      </div>

      {/* Main Navigation */}
      <header className="relative z-10 w-full px-4 md:px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="text-xl">📦</span>
          </div>
          <span className="font-headline-sm text-headline-sm font-extrabold tracking-tight text-primary">
            TechNova
          </span>
        </div>
        <div className="hidden md:flex gap-4">
          <span className="text-on-surface-variant font-label-md text-label-md">
            Premium Mobile Store
          </span>
        </div>
      </header>

      {/* Login/Signup Section */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[480px] bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl transition-all duration-300">
          {/* Tabs */}
          <div className="flex border-b border-outline-variant/30">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-4 font-label-md text-label-md transition-all border-b-2 ${
                mode === 'login'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-4 font-label-md text-label-md transition-all border-b-2 ${
                mode === 'register'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* Welcome Title */}
            <div className={`mb-8 ${mode === 'login' ? 'text-center md:text-left' : 'text-center md:text-left'}`}>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                {mode === 'login' ? 'Welcome back' : 'Create Account'}
              </h1>
              <p className="text-on-surface-variant font-body-md text-body-md mt-2">
                {mode === 'login'
                  ? 'Access your precision inventory dashboard.'
                  : 'Join 2,500+ enterprises managing logistics at scale.'}
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  className="font-label-md text-label-md text-on-surface flex justify-between"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-hover:text-primary group-focus-within:text-primary transition-colors duration-200" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-lg hover:border-primary/60 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body-md text-body-md outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="font-label-md text-label-md text-on-surface"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  {mode === 'login' && (
                    <a
                      href="#"
                      className="text-secondary font-label-sm text-label-sm hover:underline"
                    >
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-hover:text-secondary group-focus-within:text-secondary transition-colors duration-200" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-white border border-outline-variant rounded-lg hover:border-secondary/60 focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all duration-200 font-body-md text-body-md outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-secondary transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <>
                  <div className="space-y-2">
                    <label
                      className="font-label-md text-label-md text-on-surface"
                      htmlFor="name"
                    >
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-hover:text-primary group-focus-within:text-primary transition-colors duration-200" />
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-lg hover:border-primary/60 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body-md text-body-md outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="font-label-md text-label-md text-on-surface"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-hover:text-secondary group-focus-within:text-secondary transition-colors duration-200" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 bg-white border border-outline-variant rounded-lg hover:border-secondary/60 focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all duration-200 font-body-md text-body-md outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-secondary transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Remember Me */}
              <div className="flex items-center gap-3">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20"
                />
                <label
                  className="font-body-sm text-body-sm text-on-surface-variant select-none cursor-pointer"
                  htmlFor="remember"
                >
                  Remember this device for 30 days
                </label>
              </div>

              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-container text-white rounded-lg font-label-md text-label-md font-bold hover:bg-primary transition-all active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <span className="text-[18px]">→</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/50" />
              </div>
              <span className="relative px-4 bg-transparent font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                Or continue with
              </span>
            </div>

            {/* SSO Options */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-outline-variant rounded-lg hover:border-primary/60 hover:bg-primary/5 transition-all duration-200 active:scale-95"
              >
                <FontAwesomeIcon icon={faGoogle} className="text-primary text-lg" />
                <span className="font-label-md text-label-md text-on-surface">
                  Google
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-outline-variant rounded-lg hover:border-secondary/60 hover:bg-secondary/5 transition-all duration-200 active:scale-95"
              >
                <FontAwesomeIcon icon={faMicrosoft} className="text-secondary text-lg" />
                <span className="font-label-md text-label-md text-on-surface">
                  Microsoft
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Disclaimer */}
          <div className="px-6 md:px-8 py-4 bg-surface-container-low/50 rounded-b-2xl text-center">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              By continuing, you agree to TechNova's{' '}
              <a href="#" className="text-secondary font-bold hover:underline">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low/30">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          © 2024 TechNova Mobile Store. All rights reserved.
        </span>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Help Center'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-on-surface-variant font-label-sm text-label-sm hover:text-secondary transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
