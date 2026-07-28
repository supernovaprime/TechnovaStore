import technovaVideo from '@/images/Technova.mp4'

export default function LimeshCard() {
  return (
    <div
      className="group relative w-full max-w-sm rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/[0.06] shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-52 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-110 transition-transform duration-700 group-hover:scale-100"
        >
          <source src={technovaVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent transition-opacity duration-500 group-hover:opacity-40" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border"
            style={{
              background: 'rgba(25, 230, 145, 0.1)',
              borderColor: 'rgba(25, 230, 145, 0.2)',
              color: '#19E691'
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#19E691' }} />
            Enterprise
          </span>
        </div>
      </div>

      <div className="relative p-5 space-y-4" style={{ background: '#0a0a0a' }}>
        <div className="space-y-1.5">
          <h3 className="text-lg font-black tracking-tight" style={{ color: '#fff' }}>
            LimesH <span style={{ color: '#19E691' }}>Enterprise</span>
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            The all-in-one e-commerce platform built for modern businesses — manage products, track inventory assets, and reward customer loyalty with ease.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2">
          {[
            { label: 'Products', value: '15K+' },
            { label: 'Accuracy', value: '99.9%' },
            { label: 'Customers', value: '50K+' }
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-sm font-black" style={{ color: '#19E691' }}>{s.value}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2.5">
          {[
            {
              title: 'Smart Inventory',
              desc: 'Real-time stock tracking, low-stock alerts, and automated reorder suggestions.'
            },
            {
              title: 'Loyalty Rewards',
              desc: 'Earn points with every purchase — redeem discount vouchers and unlock tiered benefits.'
            },
            {
              title: 'Advanced Analytics',
              desc: 'Deep insights into sales trends, customer behavior, and asset performance.'
            }
          ].map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: '#19E691' }}
              />
              <div>
                <p className="text-xs font-bold" style={{ color: '#fff' }}>{f.title}</p>
                <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="w-full py-2.5 rounded-xl text-sm font-bold border transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #19E691, #0A5C36)',
            borderColor: 'transparent',
            color: '#0a0a0a'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
