import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Truck, ShieldCheck, Zap, Search, PackageX } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { CATEGORIES, PRODUCTS } from '../data/products.js'
import usePageTitle from '../hooks/usePageTitle.js'

const FEATURES = [
  { icon: Truck, title: 'ارسال سریع', text: 'تحویل در کمتر از ۴۸ ساعت' },
  { icon: ShieldCheck, title: 'ضمانت اصالت', text: 'همه کالاها با گارانتی معتبر' },
  { icon: Zap, title: 'مشاور هوشمند', text: 'خرید بر اساس بودجه و نیاز شما' },
]

const SORTS = [
  { id: 'default', label: 'پیش‌فرض' },
  { id: 'cheap', label: 'ارزان‌ترین' },
  { id: 'expensive', label: 'گران‌ترین' },
  { id: 'rating', label: 'بیشترین امتیاز' },
]

export default function Home() {
  usePageTitle()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('default')

  const openChat = () => window.dispatchEvent(new CustomEvent('open-ai-chat'))

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = PRODUCTS.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.tag.includes(q))
    )
    if (sort === 'cheap') return [...list].sort((a, b) => a.price - b.price)
    if (sort === 'expensive') return [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') return [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [query, category, sort])

  return (
    <>
      {/* Hero */}
      <section className="py-16 text-center md:py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-brand-light">
            <Sparkles size={14} /> مجهز به دستیار خرید هوش مصنوعی
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            خرید هوشمند، <span className="text-gradient">سریع‌تر و دقیق‌تر</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-slate-400 md:text-lg">
            بودجه و نیازت را بگو؛ دستیار هوشمند ما بهترین گزینه‌ها را در چند ثانیه پیشنهاد می‌دهد.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={openChat} className="btn-brand">
              <Sparkles size={16} /> از دستیار بپرس
            </button>
            <a href="#products" className="btn-ghost">مشاهده محصولات</a>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="grid gap-4 pb-14 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card flex items-center gap-4 p-5"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/20 text-brand-light">
              <Icon size={22} />
            </span>
            <div>
              <h3 className="font-bold">{title}</h3>
              <p className="text-sm text-slate-400">{text}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Products */}
      <section id="products" className="scroll-mt-20 pb-16">
        <h2 className="mb-6 text-2xl font-extrabold md:text-3xl">
          محصولات <span className="text-gradient">منتخب</span>
        </h2>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <label className="glass flex flex-1 items-center gap-2 rounded-xl px-3.5 py-2.5 focus-within:border-brand">
            <Search size={16} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی محصول…"
              className="w-full bg-transparent text-base outline-none sm:text-sm placeholder:text-slate-400"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="glass rounded-xl px-3.5 py-2.5 text-sm outline-none"
            aria-label="مرتب‌سازی"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                category === c.id ? 'bg-brand font-bold text-white' : 'glass text-slate-300 hover:bg-white/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="glass grid place-items-center gap-3 rounded-2xl py-16 text-center text-slate-400">
            <PackageX size={36} />
            <p>محصولی با این مشخصات پیدا نشد.</p>
            <button onClick={openChat} className="btn-brand">
              <Sparkles size={16} /> از دستیار هوشمند کمک بگیر
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
