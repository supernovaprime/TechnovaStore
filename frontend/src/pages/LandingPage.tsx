import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone, ChevronRight, PlayCircle, Shield, Truck, Headphones, Star } from 'lucide-react'

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-4')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.bento-card').forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700')
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-outline-variant/60 transition-all duration-300">
        <nav className="flex justify-between items-center px-4 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <Phone className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -inset-1 bg-primary/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-bold text-primary font-heading tracking-tight">TechNova</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:block text-text-secondary font-medium px-4 py-2 rounded-full hover:bg-primary/5 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="btn-primary flex items-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50/80 backdrop-blur-sm text-primary rounded-full mb-6 border border-primary/10 hover:border-primary/20 transition-all duration-300 cursor-default">
                <Star className="w-4 h-4" />
                <span className="font-label-caps text-label-caps uppercase">New Arrivals 2024</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tight font-heading">
                The Future of{' '}
                <span className="text-secondary relative inline-block">
                  Mobile Technology
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary/30" viewBox="0 0 200 9" fill="none">
                    <path d="M2.00025 6.99997C25.7501 3.49999 73.5 -2.20988 198 3.49999" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-text-secondary max-w-xl mb-8 leading-relaxed">
                Discover premium smartphones and accessories from the world&apos;s leading brands.
                Shop the latest devices with secure payments and fast delivery.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="btn-primary flex items-center gap-2 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started
                  <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <button className="btn-secondary flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                  <PlayCircle className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative mt-10 md:mt-0 group">
              <div className="aspect-square bg-primary-50/50 rounded-3xl overflow-hidden border border-outline-variant/60 relative transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbarHQeb3zEt2XD-JkMF_DfcF-GufTLXqUVRh5XDPa3cs6sZ8ZVZ9-dYiVw1uHmGqmzhoVg9T_XaYH-8cN8IpEL70d8d996IQPPkj51b1MqrB2wIF8NUrQ4xVYpc5Shc68UHlTcq10dEF1hTfWIvkzcQ94gnex4tUiGZ1Z-l5nhb81AnDXqToAbxOJI_K6flQcXReMcABjzGOB6LXJWEpEZFU5hUePawmvqukyfUl2BQSmcEpZNMB66ocKHzSbo66nd_SS-SDoqx0"
                  alt="Premium smartphone showcase"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent transition-opacity duration-500 group-hover:opacity-70" />
              </div>

              {/* Floating Data Card */}
              <div className="absolute -bottom-4 -left-4 md:left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-outline-variant/60 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-text-muted">FREE SHIPPING</p>
                    <p className="font-data-mono text-data-mono text-primary font-semibold">ORDERS OVER $99</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-heading">
                Why Shop at TechNova
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                We offer the best mobile shopping experience with premium products,
                secure checkout, and exceptional customer service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4">
              {/* Large Feature Card */}
              <div className="md:col-span-2 md:row-span-2 bento-card bg-gradient-to-br from-background to-white border border-outline-variant/60 p-8 rounded-3xl flex flex-col justify-between overflow-hidden relative group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-default">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3 font-heading">
                    Secure Shopping
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Shop with confidence using our encrypted checkout process.
                    Your personal information and payment details are always protected
                    with bank-level security.
                  </p>
                </div>
                <div className="mt-6 relative">
                  <img
                    className="rounded-2xl border border-outline-variant/60 w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbhiHLms6ehypxC7pEUqe6GuZ2VhKsdR4q1_mwuEtPeDJv8wD3vmSQ6lzlxMFxzgPacXkKC0IwyJw7UCznB66-SrrEEEcW1EN9YeOoFzdh624ZDNn5tfYZiLQDVSOdMsQ92at0n_gVqz_8yTXKwuOI54sNox5SF_pcLzDA_XgtwmkxvHU7QvkBcBa3rvkt869RxCF2eCXiiyomORvn3vc-EhlT1WhAcIXq8eXOp9yxylz8J2owfFOHoL6XTQfn40_HYB8pTDFMiOI"
                    alt="Secure checkout visualization"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Medium Card 1 */}
              <div className="md:col-span-2 bento-card bg-primary-50/50 border border-outline-variant/60 p-6 rounded-3xl flex items-center gap-6 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-default group">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Truck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1 font-heading">
                    Fast & Free Shipping
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Free delivery on orders over $99. Express shipping available
                    for urgent purchases.
                  </p>
                </div>
              </div>

              {/* Small Card 1 */}
              <div className="bento-card bg-white border border-outline-variant/60 p-6 rounded-3xl hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-default group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2 font-heading">
                  Authentic Products
                </h3>
                <p className="text-sm text-text-secondary">
                  100% genuine devices with official warranty and support.
                </p>
              </div>

              {/* Small Card 2 */}
              <div className="bento-card bg-white border border-outline-variant/60 p-6 rounded-3xl hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-default group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <Headphones className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2 font-heading">
                  24/7 Support
                </h3>
                <p className="text-sm text-text-secondary">
                  Round-the-clock customer service for all your inquiries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why TechNova */}
        <section className="py-24 bg-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-8 font-heading">
                  Why Customers Choose TechNova
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
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1 font-heading">
                          {item.title}
                        </h4>
                        <p className="text-primary-100">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '50K+', label: 'Happy Customers', delay: 'delay-100' },
                  { value: '4.9', label: 'Average Rating', delay: 'delay-200' },
                  { value: '500+', label: 'Products', delay: 'delay-300' },
                  { value: '24/7', label: 'Support', delay: 'delay-400' }
                ].map((stat, _idx) => (
                  <div key={stat.label} className={`bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 ${stat.delay}`}>
                    <p className="text-3xl font-bold text-secondary mb-1">{stat.value}</p>
                    <p className="text-sm text-primary-100 uppercase tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="max-w-5xl mx-auto px-4 text-center relative">
            <div className="bg-white/80 backdrop-blur-md p-12 rounded-[2rem] border border-outline-variant/60 relative overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-heading">
                  Ready to upgrade your mobile experience?
                </h2>
                <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
                  Join thousands of customers who trust TechNova for premium
                  smartphones and accessories. Free shipping on orders over $99.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login"
                    className="btn-primary flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
                  >
                    Start Shopping
                  </Link>
                  <Link
                    to="#contact"
                    className="btn-secondary flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white/80 backdrop-blur-md border-t border-outline-variant/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Phone className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xl font-bold text-primary font-heading">TechNova</span>
          </div>
          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} TechNova Mobile Store. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Contact Support'].map((item) => (
              <Link
                key={item}
                to="#"
                className="relative text-sm text-text-secondary hover:text-primary transition-colors duration-300 group"
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
