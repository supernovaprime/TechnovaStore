import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Gauge, Boxes, Users, ShoppingCart, BarChart3, Settings, Command, ArrowRight } from 'lucide-react'

const pages = [
  { icon: Gauge, label: 'Dashboard', path: '/admin' },
  { icon: Boxes, label: 'Inventory', path: '/admin/inventory' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const filtered = query.trim()
    ? pages.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
    : pages

  const handleSelect = useCallback((path: string) => {
    setOpen(false)
    setQuery('')
    navigate(path)
  }, [navigate])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (open) {
      setActiveIndex(0)
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      handleSelect(filtered[activeIndex].path)
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 h-9 bg-white border border-outlineVariant/60 rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-200 group w-56"
      >
        <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors shrink-0" />
        <span className="text-xs text-text-muted/70 group-hover:text-text-muted transition-colors">Quick search...</span>
        <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-background border border-outlineVariant/30 shrink-0">
          <Command className="w-2.5 h-2.5 text-text-muted/50" />
          <span className="text-[9px] font-bold text-text-muted/50">K</span>
        </div>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setOpen(false); setQuery('') }} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-outlineVariant/40 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-outlineVariant/30">
              <Search className="w-4 h-4 text-text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages..."
                className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted/50"
              />
              <span className="text-[10px] text-text-muted/40 font-semibold bg-background px-1.5 py-0.5 rounded border border-outlineVariant/30">ESC</span>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-text-muted py-8">No results found</p>
              ) : (
                filtered.map((page, index) => {
                  const isActive = location.pathname === page.path
                  return (
                    <button
                      key={page.path}
                      onClick={() => handleSelect(page.path)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                        index === activeIndex
                          ? 'bg-primary/10 text-primary'
                          : 'text-text hover:bg-background'
                      }`}
                    >
                      <page.icon className={`w-4 h-4 shrink-0 ${index === activeIndex ? 'text-primary' : 'text-text-muted'}`} />
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-sm font-medium">{page.label}</span>
                        {isActive && <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase tracking-wider">Current</span>}
                      </div>
                      {index === activeIndex && <ArrowRight className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  )
                })
              )}
            </div>

            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-outlineVariant/30 bg-background/50">
              <span className="text-[10px] text-text-muted/60 font-medium"><ArrowRight className="w-2.5 h-2.5 inline mr-1" />navigate</span>
              <span className="text-[10px] text-text-muted/60 font-medium"><ArrowRight className="w-2.5 h-2.5 inline mr-1 rotate-180" />move</span>
              <span className="text-[10px] text-text-muted/60 font-medium">esc<span className="ml-1">close</span></span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
