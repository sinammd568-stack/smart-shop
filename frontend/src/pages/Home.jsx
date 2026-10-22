import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Truck, ShieldCheck, Zap, Search, PackageX, Loader2, ChevronRight, ChevronLeft, Headphones, Watch, Keyboard, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { fetchProducts } from '../services/api.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { fmt } from '../data/products.js'

const CATEGORIES = [
  { id: 'all', label: 'همه محصولات', icon: <Sparkles size={24} />, color: 'from-purple-500 to-indigo-500' },
  { id: 'audio', label: 'صوتی', icon: <Headphones size={24} />, color: 'from-blue-500 to-cyan-500' },
  { id: 'wearable', label: 'پوشیدنی', icon: <Watch size={24} />, color: 'from-green-500 to-emerald-500' },
  { id: 'accessory', label: 'لوازم جانبی', icon: <Keyboard size={24} />, color: 'from-orange-500 to-red-500' },
]

export default function Home() {
  usePageTitle()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  
  // اسلایدر
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetchProducts()
      .then(data => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // اسلایدر خودکار برای محصولات ویژه
  const featuredProducts = products.slice(0, 5) // ۵ محصول اول رو برای اسلایدر بذار
  
  useEffect(() => {
    if (featuredProducts.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
    }, 4000) // هر ۴ ثانیه
    return () => clearInterval(timer)
  }, [featuredProducts.length])

  // فیلتر محصولات
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory
      const matchQuery = !q || p.name.toLowerCase().includes(q) || (p.tag && p.tag.toLowerCase().includes(q))
      return matchCategory && matchQuery
    })
  }, [products, activeCategory, query])

  const openChat = () => window.dispatchEvent(new CustomEvent('open-ai-chat'))

  return (
    <div className="space-y-16 pb-20">
      
      {/* ۱. بخش هیرو (اسم بزرگ فروشگاه) */}
      <section className="pt-16 pb-8 text-center md:pt-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            فروشگاه <span className="text-gradient drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">هوشمند</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
            تجربه‌ای متفاوت از خرید دیجیتال. سریع، دقیق و مجهز به هوش مصنوعی که دقیقاً همونی که می‌خوای رو پیدا می‌کنه.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button onClick={openChat} className="btn-brand !px-8 !py-3 text-base shadow-xl shadow-brand/30">
              <Sparkles size={20} /> مشاوره هوشمند خرید
            </button>
          </div>
        </motion.div>
      </section>

      {/* ۲. اسلایدر قطاری محصولات ویژه */}
      {featuredProducts.length > 0 && (
        <section className="relative z-10 max-w-6xl mx-auto px-4">
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
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: index === currentSlide ? 1 : 0, 
                  x: index === currentSlide ? 0 : (index > currentSlide ? 100 : -100),
                  zIndex: index === currentSlide ? 10 : 0
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-between p-8 md:p-16 bg-gradient-to-l from-brand/10 via-transparent to-transparent"
              >
                <div className="w-1/2 z-10 space-y-4">
                  <span className="inline-block bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">{product.tag || 'ویژه'}</span>
                  <h3 className="text-2xl md:text-4xl font-extrabold leading-tight">{product.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 md:line-clamp-none">{product.description}</p>
                  <div className="text-2xl font-black text-brand-dark dark:text-brand-light">
                    {fmt(product.price)} <span className="text-sm font-normal text-slate-500">تومان</span>
                  </div>
                  <Link to={`/product/${product.id}`} className="btn-brand inline-flex mt-4">مشاهده محصول</Link>
                </div>
                <div className="w-1/2 h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-brand/20 blur-[80px] rounded-full"></div>
                  <img src={product.image} alt={product.name} className="relative z-10 h-full w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                </div>
              </motion.div>
            ))}
            
            {/* نقطه‌های پایین اسلایدر */}
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

      {/* ۳. دسته‌بندی‌ها (مثل دیجی‌کالا) */}
      <section className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold">دسته‌بندی‌ها</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`glass-card flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-300 ${
                activeCategory === cat.id ? 'ring-2 ring-brand bg-brand/5' : 'hover:-translate-y-1'
              }`}
            >
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-lg`}>
                {cat.icon}
              </div>
              <span className="font-bold text-sm">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ۴. لیست محصولات */}
      <section className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-extrabold">جدیدترین محصولات</h2>
          
          <div className="w-full md:w-96 relative">
            <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی محصول..."
              className="w-full glass bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pr-12 pl-4 text-sm outline-none focus:border-brand transition-colors dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-brand">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="text-slate-400">در حال دریافت محصولات از سرور...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass grid place-items-center gap-3 rounded-2xl py-20 text-center text-slate-400">
            <PackageX size={48} />
            <p className="text-lg">محصولی با این مشخصات پیدا نشد.</p>
            <button onClick={openChat} className="btn-brand mt-4">
              <Sparkles size={16} /> از دستیار هوشمند بپرس
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ۵. بخش ویژگی‌ها */}
      <section className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Truck, title: 'ارسال سریع', text: 'تحویل در کمتر از ۴۸ ساعت' },
            { icon: ShieldCheck, title: 'ضمانت اصالت', text: 'همه کالاها با گارانتی معتبر' },
            { icon: Zap, title: 'مشاور هوشمند', text: 'خرید بر اساس بودجه و نیاز شما' },
          ].map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card flex items-center gap-4 p-6"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand">
                <Icon size={28} />
              </span>
              <div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  )
}
