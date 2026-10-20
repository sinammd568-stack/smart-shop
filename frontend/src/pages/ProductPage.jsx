import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Minus, Plus, ShoppingCart, Sparkles, Star, ShieldCheck, Truck } from 'lucide-react'
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

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  
  // محاسبه درصد تخفیف
  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : null

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
      <Link to="/#products" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-dark dark:text-slate-400 dark:hover:text-white transition-colors">
        <ArrowRight size={16} /> بازگشت به محصولات
      </Link>

      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-8 md:grid-cols-2"
      >
        {/* بخش عکس محصول */}
        <div className="glass-card relative grid h-72 place-items-center overflow-hidden bg-slate-100 dark:bg-slate-800 md:h-full md:min-h-[28rem]">
          <img 
            src={product.image} 
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <span className="absolute right-4 top-4 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/10">
            {product.tag}
          </span>
          
          {discountPercent && (
            <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              {fmt(discountPercent)}٪ تخفیف
            </span>
          )}
        </div>

        {/* بخش اطلاعات محصول */}
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-extrabold leading-9 text-slate-800 dark:text-white md:text-3xl">{product.name}</h1>
          
          <div className="mt-3 flex items-center gap-1.5 text-amber-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm text-slate-600 dark:text-slate-300">{product.rating.toLocaleString('fa-IR')} از ۵</span>
            <span className="text-xs text-slate-400 mr-2">(۱۲۴ دیدگاه)</span>
          </div>

          <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand/15 text-brand-dark dark:bg-brand/25 dark:text-brand-light">
                  <Check size={12} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* بخش قیمت */}
          <div className="mt-7 flex items-end gap-3">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-white">
              {fmt(product.price * qty)} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">تومان</span>
            </div>
            {product.oldPrice && (
              <div className="text-base text-slate-400 line-through decoration-red-400/50 mb-1">
                {fmt(product.oldPrice * qty)}
              </div>
            )}
          </div>

          {/* دکمه‌ها و تعداد */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="glass flex items-center gap-3 rounded-xl px-2 py-1.5 border border-slate-200 dark:border-white/10">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="rounded-lg p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors" aria-label="کم کردن">
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-bold text-slate-800 dark:text-white">{fmt(qty)}</span>
              <button onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className="rounded-lg p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors" aria-label="زیاد کردن">
                <Plus size={16} />
              </button>
            </div>
            
            <button onClick={handleAdd} className="btn-brand flex-1 sm:flex-none shadow-lg shadow-brand/30">
              <ShoppingCart size={18} /> افزودن به سبد خرید
            </button>
            
            <button onClick={askAI} className="btn-ghost">
              <Sparkles size={16} /> از دستیار بپرس
            </button>
          </div>

          {/* بخش اعتمادسازی */}
          <div className="mt-8 flex items-center gap-6 border-t border-slate-200 dark:border-white/10 pt-5 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><Truck size={16} /> ارسال سریع</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} /> ضمانت اصالت</span>
          </div>

        </div>
      </motion.div>

      {/* محصولات مشابه */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-xl font-extrabold text-slate-800 dark:text-white">
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
