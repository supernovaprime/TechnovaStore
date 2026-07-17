import { useState } from 'react'
import { X, CreditCard, Banknote, Smartphone, Loader2, MapPin, Phone } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'

const mobileProviders = [
  { value: 'MTN MoMo', label: 'MTN MoMo' },
  { value: 'Telecel Cash', label: 'Telecel Cash' },
  { value: 'AirtelTigo Money', label: 'AirtelTigo Money' },
]

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  items: { product: string; quantity: number; price: number }[]
  prefilledPhone?: string
}

export default function CheckoutModal({ open, onClose, onSuccess, items, prefilledPhone }: CheckoutModalProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const fullName = user?.name || ''
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'mobile_money'>('cash_on_delivery')
  const [mobileProvider, setMobileProvider] = useState('MTN MoMo')
  const [phone, setPhone] = useState(prefilledPhone || '')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleSubmit = async () => {
    setError('')

    if (!fullName.trim()) {
      setError('Full name is required')
      return
    }
    if (!deliveryAddress.trim()) {
      setError('Delivery address is required')
      return
    }
    if (paymentMethod === 'mobile_money') {
      if (!phone.trim()) {
        setError('Mobile number is required for Mobile Money')
        return
      }
      if (!/^\+?[\d\s-]{7,15}$/.test(phone.trim())) {
        setError('Please enter a valid phone number')
        return
      }
    }

    setSubmitting(true)
    try {
      const body: any = {
        items,
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim() || 'N/A',
          email: 'customer@technova.com',
          street: deliveryAddress.trim(),
          city: 'Tarkwa',
          state: 'Western',
          zipCode: '00000',
          country: 'Ghana',
        },
        paymentMethod,
      }

      if (paymentMethod === 'mobile_money') {
        body.paymentDetails = { paymentGateway: mobileProvider }
      }

      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to create order')
      }

      toast('success', 'Order placed successfully!')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order')
      toast('error', err instanceof Error ? err.message : 'Failed to create order')
    }
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outlineVariant/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text font-heading">Checkout</h3>
              <p className="text-xs text-text-muted">Complete your order</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background transition-colors">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-text flex items-center gap-2">
              <MapPin className="w-4 h-4 text-text-muted" />
              Delivery Details
            </label>
            <input
              type="text"
              value={fullName}
              readOnly
              placeholder="Full name"
              className="w-full px-4 py-2.5 bg-slate-100 border border-outlineVariant/60 rounded-xl text-sm outline-none text-text-muted cursor-not-allowed"
            />
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Delivery address (street, area)"
              className="w-full px-4 py-2.5 bg-background border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-text flex items-center gap-2">
              <Banknote className="w-4 h-4 text-text-muted" />
              Payment Method
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outlineVariant/40 bg-white text-text-muted hover:border-primary/40'
                }`}
              >
                <Banknote className={`w-5 h-5 ${paymentMethod === 'cash_on_delivery' ? 'text-primary' : 'text-text-muted'}`} />
                <span className="text-sm font-semibold">Cash on Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('mobile_money')}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === 'mobile_money'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outlineVariant/40 bg-white text-text-muted hover:border-primary/40'
                }`}
              >
                <Smartphone className={`w-5 h-5 ${paymentMethod === 'mobile_money' ? 'text-primary' : 'text-text-muted'}`} />
                <span className="text-sm font-semibold">Mobile Money</span>
              </button>
            </div>

            {paymentMethod === 'mobile_money' && (
              <div className="space-y-4 p-4 bg-background rounded-xl border border-outlineVariant/40">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Select Provider</p>
                <div className="space-y-2">
                  {mobileProviders.map((p) => (
                    <label
                      key={p.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        mobileProvider === p.value
                          ? 'border-primary bg-primary/5'
                          : 'border-outlineVariant/40 bg-white hover:border-primary/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mobileProvider"
                        value={p.value}
                        checked={mobileProvider === p.value}
                        onChange={() => setMobileProvider(p.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-text">{p.label}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-muted flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 024XXXXXXX"
                    className="w-full px-4 py-2.5 bg-white border border-outlineVariant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm outline-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-background border border-outlineVariant/60 rounded-xl text-sm font-semibold text-text hover:bg-outlineVariant/20 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
