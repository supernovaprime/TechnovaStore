import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, ChevronRight, PlayCircle, Shield, Truck, Star, ShoppingBag, ArrowUpRight, Heart, CheckCircle, Users } from 'lucide-react'
import appleImg from '@/images/Apple.jpg'
import s25UltraVideo from '@/images/Samsung Galaxy S25 Ultra - Samsung Latinoamérica y Caribe (1080p, h264, youtube).mp4'
import technovaVideo from '@/images/Technova.mp4'
import qledVideo from '@/images/2019 QLED 8K TV OFFICIAL INTRODUCTION-GHANA - Samsung Ghana (720p, h264, youtube).mp4'
import dellVideo from '@/images/Dell G15 Laptop  Dell G15 Gaming Laptop  Dell G15 Official Video Trailer  Dell G15 Laptop Review - 999 Gadgets (1080p, h264, youtube).mp4'

export default function LandingPage() {
  const [hasLikedStore, setHasLikedStore] = useState(() => {
    try { return localStorage.getItem('technova_landing_liked') === 'true' }
    catch { return false }
  })
  const [storeLikes, setStoreLikes] = useState(() => {
    try {
      const baseLikes = 12492
      const userAdded = localStorage.getItem('technova_landing_liked') === 'true' ? 1 : 0
      return baseLikes + userAdded
    } catch { return 12492 }
  })

  const handleStoreLike = () => {
    if (hasLikedStore) {
      setStoreLikes(prev => prev - 1)
      setHasLikedStore(false)
      localStorage.setItem('technova_landing_liked', 'false')
    } else {
      setStoreLikes(prev => prev + 1)
      setHasLikedStore(true)
      localStorage.setItem('technova_landing_liked', 'true')
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-6')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-700', 'ease-out')
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-outlineVariant/60 transition-all duration-300">
        <nav className="flex justify-between items-center px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="relative">
              <Phone className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -inset-1.5 bg-primary/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-lg font-bold text-primary font-heading tracking-tight">TechNova</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-text font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full border border-outlineVariant/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center relative">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/5 backdrop-blur-sm text-primary rounded-full mb-6 border border-primary/10 hover:border-primary/20 transition-all duration-300 cursor-default">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">New Arrivals 2026</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text mb-5 tracking-tight font-heading leading-none">
                The Future of{' '}
                <span className="text-primary relative inline-block">
                  Mobile Tech
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-primary/30" viewBox="0 0 200 9" fill="none">
                    <path d="M2.00025 6.99997C25.7501 3.49999 73.5 -2.20988 198 3.49999" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-text-secondary text-base max-w-xl mb-8 leading-relaxed font-medium">
                Discover premium smartphones and accessories from the world&apos;s leading brands.
                Shop the latest devices with secure payments, live support, and rapid nationwide delivery.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-7 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Start Shopping
                  <ShoppingBag className="w-4 h-4" />
                </Link>
                <button className="inline-flex items-center gap-2 bg-white text-text font-bold text-xs uppercase tracking-wider py-3.5 px-7 rounded-full border border-outlineVariant/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 hover:border-primary/30">
                  <PlayCircle className="w-4 h-4 text-text-secondary" />
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative mt-8 md:mt-0 group justify-self-center max-w-md w-full">
              <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-outlineVariant/60 relative transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/10">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover scale-110 transition-transform duration-700 group-hover:scale-100"
                >
                  <source src={technovaVideo} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent transition-opacity duration-500 group-hover:opacity-40" />
              </div>

              {/* Floating Card 1 */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-outlineVariant/60 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-text-muted">FREE SHIPPING</p>
                    <p className="text-xs font-bold text-emerald-600">ON ORDERS OVER $99</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-outlineVariant/60 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default hidden sm:block">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-text-muted">Over 12K+ Verified Orders</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full mb-3 border border-primary/10">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Store Benefits</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-text mb-4 font-heading tracking-tight">
                Why Shop at TechNova
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto text-xs font-medium">
                We offer the best mobile shopping experience with premium products, secure checkouts, and exceptional customer support structures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6">
              {/* Large Feature Card */}
              <div className="md:col-span-2 md:row-span-2 reveal bg-white border border-outlineVariant/60 p-8 rounded-3xl flex flex-col justify-between overflow-hidden relative group hover:shadow-2xl hover:border-primary/25 transition-all duration-500 cursor-default">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-all duration-700" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-3 font-heading tracking-tight">
                    Secure Shopping Gateway
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-xs font-medium">
                    Shop with total confidence using our bank-level encrypted checkout process.
                    Your personal credentials and transaction logs are permanently protected
                    using top-tier server-side encryption blocks.
                  </p>
                </div>
                <div className="mt-6 relative overflow-hidden rounded-2xl border border-outlineVariant/60 h-44">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  >
                    <source src={dellVideo} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Fast & Free Shipping */}
              <div className="md:col-span-2 reveal bg-primary-50/50 border border-outlineVariant/60 p-6 rounded-3xl flex items-center gap-6 hover:shadow-xl hover:border-primary/25 transition-all duration-300 cursor-default group">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text mb-1 font-heading tracking-tight">
                    Fast & Free Shipping
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">
                    Complementary shipping dispatched on all orders over $99. Fast track express logistics routes are automatically enabled for critical items.
                  </p>
                </div>
              </div>

              {/* Authentic Products */}
              <div className="reveal bg-white border border-outlineVariant/60 p-6 rounded-3xl hover:shadow-xl hover:border-primary/25 transition-all duration-300 cursor-default group flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text mb-1 font-heading tracking-tight">
                    Authentic Products
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">
                    100% genuine inventory items backed by official manufacturer warranties.
                  </p>
                </div>
              </div>

              {/* Community Likes Card */}
              <div className="reveal bg-white border border-outlineVariant/60 p-6 rounded-3xl hover:shadow-xl hover:border-rose-200 transition-all duration-300 cursor-default group flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[9px] font-bold bg-rose-50 border border-rose-100 text-rose-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Store Rating
                  </span>
                  <button 
                    onClick={handleStoreLike}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors"
                    title={hasLikedStore ? "Unlike store" : "Like TechNova"}
                  >
                    <Heart className={`w-4 h-4 transition-all ${hasLikedStore ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400 group-hover:text-rose-500'}`} />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-2xl font-black text-text tracking-tight">{storeLikes.toLocaleString()}</p>
                  <p className="text-xs font-bold text-text mb-1 font-heading tracking-tight">Community Verified Likes</p>
                  <p className="text-[11px] text-text-muted font-medium">Click the heart to join thousands of happy TechNova customers!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why TechNova */}
        <section className="py-20 bg-primary text-white relative overflow-hidden mb-16">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={s25UltraVideo} type="video/mp4" />
          </video>

          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 rounded-full mb-5 border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Why Customers Love Us</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-8 font-heading leading-tight tracking-tight">
                  High-Fidelity Operations
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: Shield,
                      title: 'Trusted Quality',
                      desc: 'Every product is sourced directly from authorized distributors with full manufacturer warranty.'
                    },
                    {
                      icon: Truck,
                      title: 'Fast Delivery',
                      desc: 'Same-day dispatch and nationwide delivery with real-time order tracking.'
                    },
                    {
                      icon: Star,
                      title: 'Top Rated Service',
                      desc: 'Join thousands of satisfied customers who trust us for their mobile needs.'
                    }
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold mb-1 font-heading">
                          {item.title}
                        </h4>
                        <p className="text-white/70 text-xs leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '50K+', label: 'Verified Shipments' },
                  { value: '4.9', label: 'Average Evaluation' },
                  { value: '500+', label: 'Active SKUs' },
                  { value: '24/7', label: 'Live Assistance' }
                ].map((stat, idx) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 reveal"
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <p className="text-3xl font-black text-secondary mb-1 tracking-tight">{stat.value}</p>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background relative overflow-hidden">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={qledVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
          <div className="max-w-4xl mx-auto px-6 text-center relative">
            <div className="bg-transparent mt-8 p-10 md:p-14 rounded-[2rem] border border-white/10 relative overflow-hidden hover:shadow-2xl transition-all duration-500 group">
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-primary/[0.04] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-secondary/[0.04] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/5 rounded-2xl mb-6 border border-primary/15">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>

                <p className="text-text-secondary text-xs mb-8 max-w-xl mx-auto leading-relaxed font-semibold">
                  Join thousands of customers who trust TechNova for premium smartphones and accessories. Free shipping is automatically initialized on orders over $99.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-7 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Start Shopping
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="#"
                    className="inline-flex items-center justify-center gap-2 bg-white text-text font-bold text-xs uppercase tracking-wider py-3.5 px-7 rounded-full border border-outlineVariant/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 hover:border-primary/30"
                  >
                    Contact Assistance
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white/85 backdrop-blur-md border-t border-outlineVariant/60">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Phone className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="text-base font-bold text-primary font-heading tracking-tight">TechNova</span>
          </div>
          <p className="text-xs text-text-secondary font-medium">
            &copy; {new Date().getFullYear()} TechNova Mobile Store. Fully audited.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Contact Support'].map((item) => (
              <Link
                key={item}
                to="#"
                className="relative text-xs text-text-secondary hover:text-primary transition-colors duration-300 group font-bold"
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
