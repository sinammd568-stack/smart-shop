import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { fmt } from '../data/products.js'

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const Icon = product.icon

  const handleAdd = () => {
    addItem(product)
    toast('به سبد خرید اضافه شد')
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 4) * 0.08 }}
      className="glass-card flex flex-col p-4"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative grid h-36 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand/30 via-indigo-500/10 to-transparent">
          <Icon size={56} className="text-brand-light" strokeWidth={1.4} />
          <span className="absolute right-2 top-2 rounded-full bg-brand/80 px-2.5 py-0.5 text-[11px] font-bold">
            {product.tag}
          </span>
        </div>
        <h3 className="mt-4 line-clamp-2 min-h-[3rem] text-sm font-bold leading-6">{product.name}</h3>
        <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
          <Star size={14} fill="currentColor" />
          <span className="text-slate-300">{product.rating.toLocaleString('fa-IR')}</span>
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between pt-4">
        <div>
          <span className="font-extrabold">{fmt(product.price)}</span>{' '}
          <span className="text-xs text-slate-400">تومان</span>
        </div>
        <button onClick={handleAdd} className="btn-brand !px-3 !py-2" aria-label={`افزودن ${product.name} به سبد`}>
          <Plus size={16} />
        </button>
      </div>
    </motion.article>
  )
}
