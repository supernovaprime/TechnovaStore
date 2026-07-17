import { useState } from 'react'
import { Phone, Heart, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const footerGradients: Record<string, string> = {
  admin: 'from-primary-800 to-primary-800/40',
  manager: 'from-accent-800 to-accent-800/40',
  customer: 'from-secondary-800 to-secondary-800/40',
}

const footerLinkAccents: Record<string, string> = {
  admin: 'hover:text-primary group-hover/link:text-primary',
  manager: 'hover:text-accent group-hover/link:text-accent',
  customer: 'hover:text-secondary group-hover/link:text-secondary',
}

const footerBottomAccents: Record<string, string> = {
  admin: 'hover:text-primary',
  manager: 'hover:text-accent',
  customer: 'hover:text-secondary',
}

export default function Footer() {
  const [hasLiked, setHasLiked] = useState(() => {
    try { return localStorage.getItem('technova_footer_liked') === 'true' }
    catch { return false }
  })
  const [likeCount, setLikeCount] = useState(() => {
    try {
      const base = 4850
      const added = localStorage.getItem('technova_footer_liked') === 'true' ? 1 : 0
      return base + added
    } catch { return 4850 }
  })
  const { user } = useAuth()
  const role = user?.role || 'customer'
  const footerGrad = footerGradients[role] || footerGradients.customer
  const [linkAccent, chevronAccent] = (footerLinkAccents[role] || footerLinkAccents.customer).split(' ')
  const bottomAccent = footerBottomAccents[role] || footerBottomAccents.customer

  const handleLike = () => {
    if (hasLiked) {
      setLikeCount(prev => prev - 1)
      setHasLiked(false)
      localStorage.setItem('technova_footer_liked', 'false')
    } else {
      setLikeCount(prev => prev + 1)
      setHasLiked(true)
      localStorage.setItem('technova_footer_liked', 'true')
    }
  }

  return (
    <footer className="p-6">
      <div className={`bg-gradient-to-b ${footerGrad} backdrop-blur-xl rounded-2xl border border-outlineVariant/40 shadow-sm overflow-hidden`}>
          <div className="px-6 py-4 border-b border-outlineVariant/30">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white" />
              <h3 className="text-base font-bold text-white font-heading">TechNova Mobile Store</h3>
            </div>
            <p className="text-xs text-white/70 mt-0.5">Your premier source for premium smartphones, accessories, and automated diagnostics.</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors"
                    title={hasLiked ? 'Unlike store' : 'Show us some love!'}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-colors ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  </button>
                  <div className="text-[10px]">
                    <p className="font-bold text-white">{likeCount.toLocaleString()} Supported</p>
                    <p className="text-white/70 font-medium">Click the heart to join our verified community list</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest block mb-2">Fast Access</span>
                <div className="space-y-1">
                  {['Catalog Index', 'Orders Status', 'Staff Portal'].map((item) => (
                    <a key={item} href="#" className={`text-xs text-white/70 ${linkAccent} transition-colors font-semibold flex items-center gap-1 group/link`}>
                      <ChevronRight className={`w-3 h-3 text-white/30 ${chevronAccent} transition-colors`} />
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest block mb-2">Diagnostics</span>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-xs font-bold text-white">Tarkwa, Ghana Node Stable</span>
                  </div>
                  <div className="p-2 bg-white/10 border border-white/10 rounded-xl flex items-center justify-between">
                    <span className="text-[9px] font-bold text-white/70">Uptime:</span>
                    <span className="text-[9px] font-black text-emerald-400">99.98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-outlineVariant/30 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/70">&copy; {new Date().getFullYear()} TechNova Mobile Store. All rights reserved.</p>
            <div className="flex items-center gap-5">
              {['Privacy Policy', 'Terms of Service', 'Support Center'].map((item) => (
                <a key={item} href="#" className={`text-xs text-white/70 ${bottomAccent} transition-colors font-medium`}>{item}</a>
              ))}
            </div>
          </div>
        </div>
    </footer>
  )
}
