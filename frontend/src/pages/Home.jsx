import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Truck, ShieldCheck, Zap, Search, PackageX, Loader2, ChevronRight, ChevronLeft,
  Headphones, Watch, Keyboard, Smartphone, Flame, Timer, BadgePercent, Headset, RotateCcw,
  ArrowUp, SlidersHorizontal, Mail, Star, LayoutGrid, Rows3, Gift, CreditCard,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { fetchProducts } from '../services/api.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { fmt } from '../data/products.js'

/* ───────────── داده‌های ثابت ───────────── */

const CATEGORIES = [
  { id: 'all', label: 'همه محصولات', icon: Sparkles, color: 'from-purple-500 to-indigo-500' },
  { id: 'audio', label: 'صوتی', icon: Headphones, color: 'from-blue-500 to-cyan-500' },
  { id: 'wearable', label: 'پوشیدنی', icon: Watch, color: 'from-green-500 to-emerald-500' },
  { id: 'accessory', label: 'لوازم جانبی', icon: Keyboard, color: 'from-orange-500 to-red-500' },
]

const SORTS = [
  { id: 'new', label: 'جدیدترین' },
  { id: 'cheap', label: 'ارزان‌ترین' },
  { id: 'expensive', label: 'گران‌ترین' },
  { id: 'discount', label: 'بیشترین تخفیف' },
]

const PERKS = [
  { icon: Truck, title: 'ارسال سریع', text: 'تحویل در کمتر از ۴۸ ساعت' },
  { icon: ShieldCheck, title: 'ضمانت اصالت', text: 'همه کالاها با گارانتی معتبر' },
  { icon: CreditCard, title: 'پرداخت امن', text: 'درگاه پرداخت مطمئن' },
  { icon: RotateCcw, title: 'بازگشت کالا', text: 'تا ۷ روز ضمانت بازگشت' },
]

export default function Home() {
  usePageTitle()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('new')
  const [viewMode, setViewMode] = useState('grid') // grid | list
  
  // اسلایدر
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    fetchProducts()
      .then(data => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))

    // تشخیص اسکرول برای دکمه بالا
    const handleScroll = () => setShowScrollTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const featuredProducts = products.slice(0, 5)
  
  useEffect(() => {
    if (featuredProducts.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [featuredProducts.length])

  // فیلتر و مرتب‌سازی
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory
      const matchQuery = !query.trim() || p.name.toLowerCase().includes(query.toLowerCase()) || (p.tag && p.tag.toLowerCase().includes(query.toLowerCase()))
      return matchCategory && matchQuery
    })

    if (sortBy === 'cheap') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'expensive') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'discount') {
      result.sort((a, b) => {
        const discA = a.old_price ? (a.old_price - a.price) / a.old_price : 0
        const discB = b.old_price ? (b.old_price - b.price) / b.old_price : 0
        return discB - discA
      })
    }
    // 'new' حالت پیش‌فرض است چون API مرتب شده برمی‌گرداند

    return result
  }, [products, activeCategory, query, sortBy])

  const openChat = () => window.dispatchEvent(new CustomEvent('open-ai-chat'))

  return (
    <div className="space-y-16 pb-20 relative">
      
      {/* ۱. هدر بزرگ */}
      <section className="pt-16 pb-8 text-center md:pt-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            SMART <span className="text-gradient drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">SHOP</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
            تجربه‌ای متفاوت از خرید دیجیتال. سریع، دقیق و مجهز به هوش مصنوعی.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button onClick={openChat} className="btn-brand !px-8 !py-3 text-base shadow-xl shadow-brand/30">
              <Sparkles size={20} /> مشاوره هوشمند خرید
            </button>
          </div>
        </motion.div>
      </section>

      {/* ۲. اسلایدر محصولات ویژه */}
      {featuredProducts.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <Zap className="text-amber-500" size={24} /> پیشنهادهای ویژه
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)}
                className="p-2 rounded-full glass hover:bg-slate-200 dark:hover:bg-white/10 transition"
              ><ChevronRight size={20} /></button>
              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)}
                className="p-2 rounded-full glass hover:bg-slate-200 dark:hover:bg-white/10 transition"
              ><ChevronLeft size={20} /></button>
            </div>
          </div>
          
          <div className="relative h-[320px] md:h-[400px] w-full rounded-3xl overflow-hidden glass-strong border border-slate-200 dark:border-white/10 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-between p-8 md:p-16 bg-gradient-to-l from-brand/10 via-transparent to-transparent"
              >
                <div className="w-1/2 z-10 space-y-4">
                  <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    <Flame size={12} /> {featuredProducts[currentSlide].tag || 'ویژه'}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-extrabold leading-tight">{featuredProducts[currentSlide].name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 md:line-clamp-none">{featuredProducts[currentSlide].description}</p>
                  <div className="flex items-end gap-3">
                    <div className="text-2xl font-black text-brand-dark dark:text-brand-light">
                      {fmt(featuredProducts[currentSlide].price)} <span className="text-sm font-normal text-slate-500">تومان</span>
                    </div>
                    {featuredProducts[currentSlide].old_price && (
                      <div className="text-sm text-slate-400 line-through mb-1">
                        {fmt(featuredProducts[currentSlide].old_price)}
                      </div>
                    )}
                  </div>
                  <Link to={`/product/${featuredProducts[currentSlide].id}`} className="btn-brand inline-flex mt-4">مشاهده محصول</Link>
                </div>
                <div className="w-1/2 h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-brand/20 blur-[80px] rounded-full"></div>
                  <img src={featuredProducts[currentSlide].image} alt={featuredProducts[currentSlide].name} className="relative z-10 h-full w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {featuredProducts.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-brand' : 'w-2 bg-slate-400/50'}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ۳. دسته‌بندی‌ها */}
      <section className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`glass-card flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-300 ${
                  activeCategory === cat.id ? 'ring-2 ring-brand bg-brand/5' : 'hover:-translate-y-1'
                }`}
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-lg`}>
                  <Icon size={24} />
                </div>
                <span className="font-bold text-sm">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ۴. بخش محصولات با فیلتر و تغییر نمایش */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        
        {/* سایدبار فیلترها (فقط دسکتاپ) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6">
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold flex items-center gap-2"><SlidersHorizontal size={18} /> مرتب‌سازی</h3>
            <div className="space-y-2">
              {SORTS.map(s => (
                <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-brand transition-colors">
                  <input type="radio" name="sort" checked={sortBy === s.id} onChange={() => setSortBy(s.id)} className="accent-brand" />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-5 space-y-4 bg-brand/5 border-brand/20">
            <h3 className="font-bold flex items-center gap-2"><Gift size={18} className="text-brand" /> پیشنهاد شگفت‌انگیز</h3>
            <p className="text-xs text-slate-500">تخفیف‌های ویژه امروز رو از دست نده!</p>
            <div className="flex items-center gap-2 text-red-500 font-bold text-lg">
              <Timer size={20} />
              <span dir="ltr">۰۲:۱۵:۳۰</span>
            </div>
          </div>
        </aside>

        {/* لیست اصلی محصولات */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold">جدیدترین محصولات</h2>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو..."
                  className="w-full glass bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm outline-none focus:border-brand transition-colors dark:text-white"
                />
              </div>
              
              {/* دکمه تغییر حالت نمایش */}
              <div className="flex bg-slate-200 dark:bg-white/5 p-1 rounded-xl shrink-0">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white dark:bg-brand text-brand dark:text-white shadow-sm' : 'text-slate-500'}`}><LayoutGrid size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white dark:bg-brand text-brand dark:text-white shadow-sm' : 'text-slate-500'}`}><Rows3 size={18} /></button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-brand">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p className="text-slate-400">در حال دریافت محصولات...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass grid place-items-center gap-3 rounded-2xl py-20 text-center text-slate-400">
              <PackageX size={48} />
              <p className="text-lg">محصولی پیدا نشد.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {filteredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ۵. بخش ویژگی‌ها */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-10">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card flex flex-col items-center text-center gap-3 p-6"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                <Icon size={24} />
              </span>
              <div>
                <h3 className="font-bold text-sm">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* دکمه بازگشت به بالا */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 left-6 z-40 grid h-10 w-10 place-items-center rounded-full bg-slate-800 text-white shadow-lg hover:bg-slate-700 transition"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  )
}
