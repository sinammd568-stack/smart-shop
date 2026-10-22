import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Star, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { fmt } from '../data/products.js'

export default function ProductCard({ product, index = 0, viewMode = 'grid' }) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAdd = () => {
    addItem(product)
    toast('به سبد خرید اضافه شد')
  }

  const discountPercent = product.old_price 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100) 
    : null

  // حالت لیست (افقی)
  if (viewMode === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="glass-card group flex flex-row items-center gap-4 p-4 relative overflow-hidden"
      >
        <Link to={`/product/${product.id}`} className="w-32 h-32 shrink-0 relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          {discountPercent && (
            <span className="absolute right-1 top-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-lg">{fmt(discountPercent)}٪</span>
          )}
        </Link>
        
        <div className="flex-1 flex flex-col justify-between h-32 py-1">
          <div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-base font-bold group-hover:text-brand transition-colors line-clamp-1">{product.name}</h3>
            </Link>
            <p className="text-xs text-slate-500 mt-2 line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <Star size={14} fill="currentColor" />
              <span className="text-slate-600 dark:text-slate-300">{product.rating?.toLocaleString('fa-IR') || '۴.۵'}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                {product.old_price && <span className="text-[10px] text-slate-400 line-through">{fmt(product.old_price)}</span>}
                <span className="text-lg font-extrabold text-slate-800 dark:text-white">{fmt(product.price)} <span className="text-[10px] font-normal text-slate-500">تومان</span></span>
              </div>
              <button onClick={handleAdd} className="btn-brand !rounded-xl !px-4 !py-2 shadow-brand/30">
                <ShoppingBag size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    )
  }

  // حالت گرید (عمودی)
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 4) * 0.08 }}
      className="glass-card group flex flex-col p-3 relative overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
          {discountPercent && (
            <span className="absolute right-2 top-2 rounded-lg bg-red-500 px-2 py-1 text-[11px] font-bold text-white shadow-lg">{fmt(discountPercent)}٪ تخفیف</span>
          )}
          <span className="absolute left-2 top-2 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white border border-white/10">{product.tag}</span>
        </div>
        <h3 className="mt-4 line-clamp-2 min-h-[3rem] text-sm font-bold leading-6 group-hover:text-brand-dark dark:group-hover:text-brand-light transition-colors">{product.name}</h3>
        <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
          <Star size={14} fill="currentColor" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">{product.rating?.toLocaleString('fa-IR') || '۴.۵'}</span>
          <span className="text-slate-400 text-[10px] mr-1">(امتیاز کاربران)</span>
        </div>
      </Link>
      <div className="mt-auto flex items-end justify-between pt-4">
        <div className="flex flex-col">
          {product.old_price && <span className="text-xs text-slate-400 line-through decoration-red-400/50">{fmt(product.old_price)}</span>}
          <div className="flex items-center gap-1">
            <span className="text-lg font-extrabold text-slate-800 dark:text-white">{fmt(product.price)}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">تومان</span>
          </div>
        </div>
        <button onClick={handleAdd} className="btn-brand !rounded-xl !px-3 !py-2.5 shadow-brand/30 group/btn" aria-label={`افزودن ${product.name} به سبد`}>
          <ShoppingBag size={18} className="group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>
    </motion.article>
  )
}
