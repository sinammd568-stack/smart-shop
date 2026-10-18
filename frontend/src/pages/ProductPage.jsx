import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Minus, Plus, ShoppingCart, Sparkles, Star } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { MAX_QTY, PRODUCTS, fmt, getProduct } from '../data/products.js'
import usePageTitle from '../hooks/usePageTitle.js'
import NotFound from './NotFound.jsx'

export default function ProductPage() {
  const { id } = useParams()
  const product = getProduct(id)
  const { addItem } = useCart()
  const { toast } = useToast()
  const [qty, setQty] = useState(1)
  usePageTitle(product ? product.name : 'صفحه پیدا نشد')

  if (!product) return <NotFound />

  const Icon = product.icon
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAdd = () => {
    addItem(product, qty)
    toast(`${fmt(qty)} عدد به سبد خرید اضافه شد`)
  }

  const askAI = () =>
    window.dispatchEvent(
      new CustomEvent('open-ai-chat', {
        detail: { prompt: `درباره «${product.name}» توضیح بده و بگو چه جایگزین‌هایی دارد؟` },
      })
    )

  return (
    <div className="py-8">
      <Link to="/#products" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
        <ArrowRight size={16} /> بازگشت به محصولات
      </Link>

      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-8 md:grid-cols-2"
      >
        <div className="glass-card relative grid h-72 place-items-center overflow-hidden bg-gradient-to-br from-brand/30 via-indigo-500/10 to-transparent md:h-full md:min-h-[24rem]">
          <Icon size={120} className="text-brand-light" strokeWidth={1.2} />
          <span className="absolute right-4 top-4 rounded-full bg-brand/80 px-3 py-1 text-xs font-bold">
            {product.tag}
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold leading-9 md:text-3xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-1.5 text-amber-400">
            <Star size={16} fill="currentColor" />
            <span className="text-sm text-slate-300">{product.rating.toLocaleString('fa-IR')} از ۵</span>
          </div>

          <p className="mt-5 leading-8 text-slate-300">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand/25 text-brand-light">
                  <Check size={12} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-7 text-2xl font-extrabold">
            {fmt(product.price * qty)} <span className="text-sm font-normal text-slate-400">تومان</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="glass flex items-center gap-3 rounded-xl px-2 py-1.5">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="کم کردن">
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-bold">{fmt(qty)}</span>
              <button onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="زیاد کردن">
                <Plus size={16} />
              </button>
            </div>
            <button onClick={handleAdd} className="btn-brand flex-1 sm:flex-none">
              <ShoppingCart size={16} /> افزودن به سبد خرید
            </button>
            <button onClick={askAI} className="btn-ghost">
              <Sparkles size={16} /> از دستیار بپرس
            </button>
          </div>
        </div>
      </motion.div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-extrabold">
            محصولات <span className="text-gradient">مشابه</span>
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
