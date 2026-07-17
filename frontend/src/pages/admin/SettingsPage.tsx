import { useState, useEffect } from 'react'
import { User, Shield, Globe, Lock, Loader2, Eye, EyeOff, AlertTriangle, Check } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

interface ProfileData {
  name: string
  email: string
  phone: string
  role: string
  preferences: {
    newsletter: boolean
    notifications: boolean
    language: string
    currency: string
  }
  createdAt: string
}

const sections = [
  { id: 'profile', label: 'Profile', icon: User, description: 'Personal identity info' },
  { id: 'security', label: 'Security', icon: Lock, description: 'Credentials and safety' },
  { id: 'preferences', label: 'Preferences', icon: Globe, description: 'Languages and regionals' },
  { id: 'system', label: 'System', icon: Shield, description: 'Application diagnostic stats' }
]

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [newsletter, setNewsletter] = useState(true)
  const [language, setLanguage] = useState('en')
  const [currency, setCurrency] = useState('USD')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')
  const { token, logout } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/v1/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.status === 401) { logout(); return }
        if (!response.ok) throw new Error('Failed to fetch profile')
        const result = await response.json()
        const data = result.data || result
        setProfile(data)
        setName(data.name || '')
        setPhone(data.phone || '')
        setNotifications(data.preferences?.notifications ?? true)
        setNewsletter(data.preferences?.newsletter ?? true)
        setLanguage(data.preferences?.language || 'en')
        setCurrency(data.preferences?.currency || 'USD')
      } catch {
        toast('error', 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchProfile()
    else setLoading(false)
  }, [token])

  const handleSaveProfile = async () => {
    setSaving('profile')
    try {
      const response = await fetch('/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          preferences: { notifications, newsletter, language, currency }
        })
      })
      if (!response.ok) throw new Error('Failed to update profile')
      toast('success', 'Profile and preferences updated successfully')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(null)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast('error', 'All password fields are required')
      return
    }
    if (newPassword.length < 8) {
      toast('error', 'New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast('error', 'New passwords do not match')
      return
    }
    setSaving('password')
    try {
      const response = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || data.message || 'Failed to change password')
      }
      toast('success', 'Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setSaving(null)
    }
  }

  if (loading) return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-text font-heading tracking-tight">Settings</h2>
        <p className="text-xs text-text-muted mt-0.5">Please wait while the system queries diagnostics...</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-pulse">
        <div className="lg:col-span-1 h-48 bg-white/40 rounded-3xl border border-white/50" />
        <div className="lg:col-span-3 h-96 bg-white/40 rounded-3xl border border-white/50" />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-text font-heading tracking-tight">System Settings</h2>
          <p className="text-xs text-text-muted mt-0.5">Configure authorization permissions and user platform parameters</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Horizontal Category Directory */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5 overflow-hidden">
          <div className="p-4 border-b border-outlineVariant/20 bg-slate-50/50">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Category Directory</span>
          </div>
          <div className="p-3 flex flex-wrap gap-2">
            {sections.map(s => {
              const Icon = s.icon
              return (
                <button 
                  key={s.id} 
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    activeSection === s.id 
                      ? 'bg-primary text-white shadow-md shadow-primary/10' 
                      : 'text-text-muted hover:text-primary hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-bold">{s.label}</p>
                    <p className={`text-[9px] ${activeSection === s.id ? 'text-white/70' : 'text-text-muted/70'} font-medium whitespace-nowrap`}>{s.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          
          {activeSection === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5 flex flex-col justify-between items-center text-center">
                <div className="space-y-4 w-full flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-extrabold text-3xl shadow-lg shadow-primary/10">
                      {profile?.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <span className="absolute -bottom-1.5 -right-1.5 p-1 bg-emerald-500 text-white rounded-lg border-2 border-white">
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">{profile?.name || 'Admin'}</h4>
                    <p className="text-[10px] text-text-muted font-medium mt-0.5">{profile?.email || 'admin@technova.com'}</p>
                  </div>
                </div>

                <div className="w-full pt-4 border-t border-outlineVariant/15 mt-4 space-y-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 capitalize">
                    <Shield className="w-3.5 h-3.5" />
                    Role: {profile?.role || 'admin'}
                  </span>
                  <p className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">Account ID Verified</p>
                </div>
              </div>

              <div className="md:col-span-2 bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary" />
                    Identity Parameters
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Full Legal Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs outline-none transition-all font-semibold" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Security Access Level</label>
                      <input 
                        type="text" 
                        value={profile?.role || 'admin'} 
                        disabled
                        className="w-full px-4 py-2.5 bg-slate-50 border border-outlineVariant/40 rounded-xl text-xs font-bold outline-none opacity-60 cursor-not-allowed capitalize text-text" 
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-outlineVariant/15">
                  <p className="text-[10px] text-text-muted font-semibold">Updates will propagate across active diagnostic sessions</p>
                </div>
              </div>

              <div className="col-span-1 md:col-span-3 bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Network Contact Registry</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">System Verified Email</label>
                    <input 
                      type="email" 
                      value={profile?.email || ''} 
                      disabled
                      className="w-full px-4 py-2.5 bg-slate-50 border border-outlineVariant/40 rounded-xl text-xs outline-none opacity-60 cursor-not-allowed text-text-muted font-semibold" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Gateway Phone Contact</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+233 50 000 0000"
                      className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs outline-none transition-all font-semibold" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-5 mt-5 border-t border-outlineVariant/15">
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={saving === 'profile'}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving === 'profile' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {saving === 'profile' ? 'Saving changes...' : 'Save Profile Details'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5">
              <div className="px-6 py-4 border-b border-outlineVariant/30">
                <h3 className="text-sm font-bold text-text font-heading flex items-center gap-2 uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-primary" />
                  Access Credentials
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={currentPassword} 
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="Enter current master credentials"
                      className="w-full px-4 py-2.5 pr-11 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs outline-none transition-all font-semibold" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded text-text-muted hover:text-text transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">New Secure Password</label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? 'text' : 'password'} 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Min. 8 alphanumeric characters"
                        className="w-full px-4 py-2.5 pr-11 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs outline-none transition-all font-semibold" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded text-text-muted hover:text-text transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Confirm New Password</label>
                    <div className="relative">
                      <input 
                        type={showConfirm ? 'text' : 'password'} 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new secure credentials"
                        className="w-full px-4 py-2.5 pr-11 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs outline-none transition-all font-semibold" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded text-text-muted hover:text-text transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-3 border-t border-outlineVariant/15 mt-4">
                  <button 
                    onClick={handleChangePassword} 
                    disabled={saving === 'password'}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving === 'password' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {saving === 'password' ? 'Updating credentials...' : 'Update Gateway Credentials'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5">
              <div className="px-6 py-4 border-b border-outlineVariant/30">
                <h3 className="text-sm font-bold text-text font-heading flex items-center gap-2 uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-primary" />
                  Regional Settings
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">System Language</label>
                    <select 
                      value={language} 
                      onChange={e => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer text-text"
                    >
                      <option value="en">English (US)</option>
                      <option value="fr">French (FR)</option>
                      <option value="es">Spanish (ES)</option>
                      <option value="ar">Arabic (AE)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Standard Currency</label>
                    <select 
                      value={currency} 
                      onChange={e => setCurrency(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer text-text"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="GHS">GHS (GH₵)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="NGN">NGN (₦)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-outlineVariant/15">
                  <p className="text-xs font-bold text-text uppercase tracking-wider">Automated Notification Tunnels</p>
                  
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-background hover:bg-slate-50 transition-colors cursor-pointer border border-outlineVariant/15">
                    <div>
                      <p className="text-xs font-bold text-text">Critical Push Email Notifications</p>
                      <p className="text-[10px] text-text-muted mt-0.5 font-medium">Forward order dispatches, stock alerts, and infrastructure health notifications</p>
                    </div>
                    <div 
                      onClick={() => setNotifications(!notifications)} 
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex items-center ${
                        notifications ? 'bg-primary' : 'bg-slate-200'
                      }`}
                    >
                      <div 
                        className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all absolute ${
                          notifications ? 'left-[22px]' : 'left-1'
                        }`} 
                        style={{ width: '18px', height: '18px' }} 
                      />
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-background hover:bg-slate-50 transition-colors cursor-pointer border border-outlineVariant/15">
                    <div>
                      <p className="text-xs font-bold text-text">Marketing & Weekly Digest Newsletter</p>
                      <p className="text-[10px] text-text-muted mt-0.5 font-medium">Monthly catalog reports, analytics summaries, and vendor stock opportunities</p>
                    </div>
                    <div 
                      onClick={() => setNewsletter(!newsletter)} 
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex items-center ${
                        newsletter ? 'bg-primary' : 'bg-slate-200'
                      }`}
                    >
                      <div 
                        className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all absolute ${
                          newsletter ? 'left-[22px]' : 'left-1'
                        }`} 
                        style={{ width: '18px', height: '18px' }} 
                      />
                    </div>
                  </label>
                </div>

                <div className="flex justify-end pt-3 border-t border-outlineVariant/15">
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={saving === 'profile'}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving === 'profile' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {saving === 'profile' ? 'Saving settings...' : 'Commit System Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'system' && (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-outlineVariant/40 shadow-xl shadow-primary/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-outlineVariant/30">
                <h3 className="text-sm font-bold text-text font-heading flex items-center gap-2 uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-primary" />
                  System Diagnostics
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-background border border-outlineVariant/30 hover:border-primary/25 transition-all">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Application Platform Release</p>
                    <p className="text-xs font-black text-text mt-1">TechNova Administration Engine v1.0.0</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-background border border-outlineVariant/30 hover:border-primary/25 transition-all">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Virtual Node Environment</p>
                    <p className="text-xs font-black text-text mt-1 capitalize">{import.meta.env.MODE || 'development'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-background border border-outlineVariant/30 hover:border-primary/25 transition-all">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Authorization Session Registered</p>
                    <p className="text-xs font-black text-text mt-1">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-background border border-outlineVariant/30 hover:border-primary/25 transition-all">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Active Credentials Role</p>
                    <p className="text-xs font-black text-primary mt-1 capitalize">{profile?.role || 'admin'}</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-warning/5 border border-warning/15 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-text">Root Authorization Active</p>
                    <p className="text-[11px] text-text-muted mt-0.5">Your admin account belongs to the master directory and is authorized to execute API schema overrides, product purging sequences, and access logs auditing.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
