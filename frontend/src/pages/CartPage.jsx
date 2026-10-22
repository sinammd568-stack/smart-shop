import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2, Truck, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { MAX_QTY, fmt } from '../data/products.js'
import usePageTitle from '../hooks/usePageTitle.js'
import ClearCartButton from '../components/ClearCartButton.jsx'

const FREE_SHIPPING_FROM = 3000000
const SHIPPING_FEE = 80000

export default function CartPage() {
  const { items, total, addItem, decrease, removeItem } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate() // 👈 برای هدایت به صفحه پرداخت
  usePageTitle('سبد خرید')

  if (items.length === 0) {
    return (
      <div className="grid place-items-center gap-4 py-24 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-brand/20 text-brand-light">
          <ShoppingBag size={36} />
        </span>
        <h1 className="text-2xl font-extrabold">سبد خرید شما خالی است</h1>
        <p className="text-slate-400">از بین محصولات انتخاب کنید یا از دستیار هوشمند کمک بگیرید.</p>
        <Link to="/#products" className="btn-brand">مشاهده محصولات</Link>
      </div>
    )
  }

  const shipping = total >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
  const progress = Math.min(100, Math.round((total / FREE_SHIPPING_FROM) * 100))

  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-extrabold">سبد خرید</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((it) => (
            <div key={it.id} className="glass-card flex flex-wrap items-center gap-4 p-4">
              {it.image && (
                <img src={it.image} alt={it.name} className="h-16 w-16 rounded-lg object-cover bg-slate-200" />
              )}
              <div className="min-w-0 flex-1">
                <Link to={`/product/${it.id}`} className="font-bold hover:text-brand-light transition-colors">
                  {it.name}
                </Link>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{fmt(it.price)} تومان</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => decrease(it.id)} className="rounded-lg bg-slate-200 dark:bg-white/10 p-2 hover:bg-slate-300 dark:hover:bg-white/20 transition" aria-label={`کم کردن ${it.name}`}>
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-bold">{fmt(it.qty)}</span>
                <button
                  onClick={() => addItem(it)}
                  disabled={it.qty >= MAX_QTY}
                  className="rounded-lg bg-slate-200 dark:bg-white/10 p-2 hover:bg-slate-300 dark:hover:bg-white/20 transition disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`زیاد کردن ${it.name}`}
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="w-32 text-left font-bold">{fmt(it.price * it.qty)}</div>
              <button onClick={() => removeItem(it.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition" aria-label={`حذف ${it.name}`}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <ClearCartButton className="text-sm text-slate-400 hover:text-red-400">خالی کردن سبد خرید</ClearCartButton>
        </div>

        <aside className="glass-card h-fit space-y-4 p-5 sticky top-24">
          <h2 className="font-extrabold">خلاصه سفارش</h2>

          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Truck size={14} className="text-brand-light" />
              {shipping === 0
                ? 'ارسال رایگان برای شما فعال است 🎉'
                : `${fmt(FREE_SHIPPING_FROM - total)} تومان تا ارسال رایگان`}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">جمع کالاها</dt>
              <dd>{fmt(total)} تومان</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">هزینه ارسال</dt>
              <dd>{shipping === 0 ? 'رایگان' : `${fmt(shipping)} تومان`}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-3 text-base font-extrabold">
              <dt>مبلغ قابل پرداخت</dt>
              <dd>{fmt(total + shipping)} تومان</dd>
            </div>
          </dl>

          <button 
            className="btn-brand w-full shadow-lg shadow-brand/30 flex items-center justify-center gap-2" 
            onClick={() => navigate('/checkout')} // 👈 هدایت به صفحه ثبت سفارش
          >
            ادامه و ثبت سفارش <ArrowLeft size={18} />
          </button>
        </aside>
      </div>
    </div>
  )
}
