import { useState, useEffect } from 'react'
import { User, Mail, Phone, Shield, MapPin, Save, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

interface ProfileData {
  name: string
  email: string
  role: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  createdAt: string
}

export default function ManagerProfilePage() {
  const { token, logout } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')

  useEffect(() => {
    if (!token) return
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/v1/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.status === 401) { logout(); return }
        if (res.ok) {
          const data = await res.json()
          const p = data.data || data
          setProfile(p)
          setName(p.name || '')
          setPhone(p.phone || '')
          setStreet(p.address?.street || '')
          setCity(p.address?.city || '')
          setState(p.address?.state || '')
          setZipCode(p.address?.zipCode || '')
          setCountry(p.address?.country || '')
        }
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetchProfile()
  }, [token])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: { street: street.trim(), city: city.trim(), state: state.trim(), zipCode: zipCode.trim(), country: country.trim() }
        })
      })
      if (!res.ok) throw new Error('Failed to update profile')
      const data = await res.json()
      setProfile(data.data || data)
      toast('success', 'Profile updated successfully')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to update profile')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-text-muted/20 animate-pulse" />
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-text-muted/10 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-6 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent-600 mx-auto flex items-center justify-center text-white font-bold text-2xl">
          {(profile?.name?.[0] || 'U').toUpperCase()}
        </div>
        <h3 className="text-lg font-bold text-text mt-4">{profile?.name || 'User'}</h3>
        <p className="text-xs text-text-muted mt-0.5">{profile?.email}</p>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-accent/10 text-accent border border-accent/20 mt-3 capitalize">
          <Shield className="w-3 h-3" />
          {profile?.role || 'manager'}
        </span>
        <p className="text-[10px] text-text-muted mt-4">Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-6 space-y-5 w-full">
        <div className="flex items-center gap-2 pb-3 border-b border-outlineVariant/30">
          <User className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-text">Personal Information</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted flex items-center gap-1">
              <User className="w-3 h-3" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-accent/10 focus:border-accent text-sm outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-4 py-2.5 bg-slate-100 border border-outlineVariant/60 rounded-xl text-sm outline-none text-text-muted cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted flex items-center gap-1">
              <Phone className="w-3 h-3" /> Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 XX XXX XXXX"
              className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-accent/10 focus:border-accent text-sm outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm p-6 space-y-5 w-full">
        <div className="flex items-center gap-2 pb-3 border-b border-outlineVariant/30">
          <MapPin className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-text">Address</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-text-muted">Street</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street address"
              className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-accent/10 focus:border-accent text-sm outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-accent/10 focus:border-accent text-sm outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-accent/10 focus:border-accent text-sm outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted">Zip Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Zip code"
              className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-accent/10 focus:border-accent text-sm outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-accent/10 focus:border-accent text-sm outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-600 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </div>
  )
}
