import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { MAX_QTY, fmt } from '../data/products.js'
import useDialog from '../hooks/useDialog.js'
import ClearCartButton from './ClearCartButton.jsx'

export default function CartDrawer({ open, onClose }) {
  const { items, total, addItem, decrease, removeItem } = useCart()
  const panelRef = useRef(null)
  useDialog(open, onClose, panelRef)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="سبد خرید"
            tabIndex={-1}
            className="glass-strong fixed bottom-0 left-0 top-0 z-50 flex w-full max-w-sm flex-col outline-none"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h2 className="font-extrabold">سبد خرید</h2>
              <button onClick={onClose} aria-label="بستن سبد خرید" className="rounded-lg p-1 hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <div className="chat-scroll flex-1 space-y-3 overflow-y-auto p-4">
              {items.length === 0 && (
                <p className="mt-10 text-center text-sm text-slate-400">سبد خرید شما خالی است.</p>
              )}
              {items.map((it) => (
                <div key={it.id} className="glass flex items-center gap-3 rounded-xl p-3">
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${it.id}`} onClick={onClose} className="block truncate text-sm font-bold hover:text-brand-light">
                      {it.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-400">{fmt(it.price)} تومان</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => decrease(it.id)} className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20" aria-label={`کم کردن ${it.name}`}>
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center text-sm" aria-label={`تعداد ${fmt(it.qty)}`}>{fmt(it.qty)}</span>
                    <button
                      onClick={() => addItem(it)}
                      disabled={it.qty >= MAX_QTY}
                      className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`زیاد کردن ${it.name}`}
                    >
                      <Plus size={14} />
                    </button>
                    <button onClick={() => removeItem(it.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10" aria-label={`حذف ${it.name}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="space-y-3 border-t border-white/10 p-4">
                <div className="flex items-center justify-between font-bold">
                  <span>جمع کل</span>
                  <span>{fmt(total)} تومان</span>
                </div>
                <Link to="/cart" onClick={onClose} className="btn-brand w-full">
                  مشاهده سبد و ادامه خرید
                </Link>
                <ClearCartButton className="btn-ghost w-full" />
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
