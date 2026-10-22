import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, User, Phone, MapPin, Loader2, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { createOrder } from '../services/api.js'
import { fmt } from '../data/products.js'
import usePageTitle from '../hooks/usePageTitle.js'

export default function Checkout() {
  usePageTitle('ثبت سفارش')
  const { items, total, clear } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', address: ''
  })

  // اگه سبد خالی بود و سفارش ثبت نشده بود، برگرد به خونه
  if (items.length === 0 && !success) {
    navigate('/cart')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const orderData = {
        ...form,
        total_price: total,
        items: items.map(i => ({ id: i.id, price: i.price, quantity: i.qty }))
      }
      
      await createOrder(orderData)
      setSuccess(true)
      clear() // سبد خرید رو خالی کن
      toast('سفارش شما با موفقیت ثبت شد!')
    } catch (err) {
      toast(err.message || 'خطا در ثبت سفارش')
    } finally {
      setLoading(false)
    }
  }

  // صفحه موفقیت
  if (success) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="glass-card p-10 max-w-md w-full text-center space-y-6"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-emerald-500/20 text-emerald-500"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">سفارش شما ثبت شد!</h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            از خرید شما سپاسگزاریم. کارشناسان ما به زودی برای هماهنگی ارسال با شما تماس خواهند گرفت.
          </p>
          <button onClick={() => navigate('/')} className="btn-brand w-full py-3">
            بازگشت به فروشگاه
          </button>
        </motion.div>
      </div>
    )
  }

  // صفحه فرم
  return (
    <div className="py-10 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-extrabold mb-8 flex items-center gap-2">
        <ShieldCheck className="text-brand" /> تکمیل اطلاعات و ثبت سفارش
      </h1>

      <div className="grid gap-8 md:grid-cols-5">
        {/* فرم اطلاعات */}
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5 glass-card p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">نام</label>
              <div className="relative">
                <User size={16} className="absolute right-3 top-3 text-slate-400" />
                <input required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="w-full glass pr-9 pl-3 py-2.5 rounded-xl text-sm outline-none focus:border-brand dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">نام خانوادگی</label>
              <input required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full glass px-3 py-2.5 rounded-xl text-sm outline-none focus:border-brand dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">شماره تماس</label>
            <div className="relative">
              <Phone size={16} className="absolute right-3 top-3 text-slate-400" />
              <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full glass pr-9 pl-3 py-2.5 rounded-xl text-sm outline-none focus:border-brand dark:text-white" placeholder="0912..." />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">آدرس کامل</label>
            <div className="relative">
              <MapPin size={16} className="absolute right-3 top-3 text-slate-400" />
              <textarea required rows="3" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full glass pr-9 pl-3 py-2.5 rounded-xl text-sm outline-none focus:border-brand dark:text-white" placeholder="استان، شهر، خیابان، پلاک..."></textarea>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-brand w-full py-3.5 text-base shadow-lg shadow-brand/30">
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'ثبت نهایی سفارش'}
          </button>
        </form>

        {/* خلاصه سفارش */}
        <div className="md:col-span-2 space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">خلاصه سفارش</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto chat-scroll pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-white/10 pb-2">
                  <div className="flex flex-col">
                    <span className="font-bold truncate w-40">{item.name}</span>
                    <span className="text-xs text-slate-500">تعداد: {fmt(item.qty)}</span>
                  </div>
                  <span className="font-bold">{fmt(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between font-extrabold text-lg">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-brand-dark dark:text-brand-light">{fmt(total)} <span className="text-xs">تومان</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
