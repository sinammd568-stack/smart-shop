import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShoppingCart, Sparkles, X, Sun, Moon } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { fmt } from '../data/products.js'
import CartDrawer from './CartDrawer.jsx'

const NAV = [
  { to: '/', label: 'خانه' },
  { to: '/#products', label: 'محصولات' },
  { to: '/cart', label: 'سبد خرید' },
]

export default function Header() {
  const { count } = useCart()
  const { isDark, toggleTheme } = useTheme()
  const { pathname, hash } = useLocation()
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // بستن منوی موبایل با تغییر مسیر یا کلید Escape
  useEffect(() => setMenuOpen(false), [pathname, hash])
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <header className="sticky top-0 z-30 glass border-x-0 border-t-0">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand shadow-lg shadow-brand/40 text-white">
              <Sparkles size={18} />
            </span>
            <span>
              فروشگاه <span className="text-gradient">هوشمند</span>
            </span>
          </Link>

          <nav aria-label="منوی اصلی" className="hidden gap-6 text-sm text-slate-600 dark:text-slate-300 md:flex">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="hover:text-brand-dark dark:hover:text-white transition-colors">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* دکمه تغییر تم */}
            <button 
              onClick={toggleTheme} 
              className="btn-ghost !px-3" 
              aria-label="تغییر تم"
              title="تغییر تم تاریک/روشن"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* دکمه سبد خرید */}
            <button
              onClick={() => setCartOpen(true)}
              className="btn-ghost relative !px-3"
              aria-label={count > 0 ? `سبد خرید، ${fmt(count)} کالا` : 'سبد خرید'}
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">سبد خرید</span>
              {count > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -left-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-brand-dark px-1 text-[11px] font-bold text-white"
                >
                  {fmt(count)}
                </span>
              )}
            </button>

            {/* دکمه منوی موبایل */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="btn-ghost !px-3 md:hidden"
              aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-menu"
              aria-label="منوی موبایل"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-strong absolute inset-x-0 top-16 flex flex-col p-2 md:hidden"
            >
              {NAV.map((n) => (
                <Link 
                  key={n.to} 
                  to={n.to} 
                  className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
