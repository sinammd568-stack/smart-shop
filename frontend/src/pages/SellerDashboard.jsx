import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Image as ImageIcon, Loader2, Store } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import { createProduct, fetchProducts } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { fmt } from '../data/products.js'

export default function SellerDashboard() {
  usePageTitle('پنل فروشنده')
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // فرم
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', old_price: '', category: 'audio', image: '', tag: ''
  })

  const loadMyProducts = () => {
    fetchProducts().then(data => {
      // فیلتر محصولاتی که مال این فروشنده هست
      const myProducts = data.filter(p => p.seller_name === user?.username)
      setProducts(myProducts)
    }).finally(() => setLoading(false))
  }

  useEffect(() => {
    loadMyProducts()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createProduct({
        ...formData,
        price: parseInt(formData.price),
        old_price: formData.old_price ? parseInt(formData.old_price) : null,
        seller: user.id // بک‌اند خودش این رو هندل میکنه ولی برای اطمینان می‌فرستیم
      })
      toast('محصول با موفقیت اضافه شد!')
      setFormData({ name: '', description: '', price: '', old_price: '', category: 'audio', image: '', tag: '' })
      loadMyProducts() // لیست رو رفرش کن
    } catch (err) {
      toast('خطا در اضافه کردن محصول')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-6">
        <span className="p-3 bg-brand/10 rounded-2xl text-brand">
          <Store size={28} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">پنل فروشنده</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">خوش آمدید {user?.username}، از اینجا می‌تونید محصولاتتون رو مدیریت کنید.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* فرم اضافه کردن محصول */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4 sticky top-24">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <PlusCircle size={18} className="text-brand" /> افزودن محصول جدید
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">نام محصول</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full glass px-3 py-2 rounded-lg text-sm dark:text-white" placeholder="مثلا: هدفون بی‌سیم" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">قیمت (تومان)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full glass px-3 py-2 rounded-lg text-sm dark:text-white" placeholder="1500000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">قیمت قبلی (اختیاری)</label>
                <input type="number" value={formData.old_price} onChange={e => setFormData({...formData, old_price: e.target.value})} className="w-full glass px-3 py-2 rounded-lg text-sm dark:text-white" placeholder="2000000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">دسته‌بندی</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full glass px-3 py-2 rounded-lg text-sm dark:text-white">
                  <option value="audio" className="dark:bg-slate-800">صوتی</option>
                  <option value="wearable" className="dark:bg-slate-800">پوشیدنی</option>
                  <option value="accessory" className="dark:bg-slate-800">لوازم جانبی</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">برچسب (مثلا: پرفروش)</label>
                <input value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full glass px-3 py-2 rounded-lg text-sm dark:text-white" placeholder="جدید" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">لینک عکس</label>
              <div className="relative">
                <ImageIcon size={16} className="absolute right-3 top-2.5 text-slate-400" />
                <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full glass pl-3 pr-9 py-2 rounded-lg text-sm dark:text-white" placeholder="https://..." />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">توضیحات</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full glass px-3 py-2 rounded-lg text-sm dark:text-white" placeholder="ویژگی‌های محصول..."></textarea>
            </div>

            <button type="submit" disabled={submitting} className="btn-brand w-full py-3">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'ثبت محصول'}
            </button>
          </form>
        </div>

        {/* لیست محصولات فروشنده */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white">محصولات من ({products.length})</h3>
          
          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand" /></div>
          ) : products.length === 0 ? (
            <div className="glass p-10 text-center text-slate-500 rounded-2xl">هنوز محصولی ثبت نکردید.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {products.map(p => (
                <div key={p.id} className="glass-card flex gap-4 p-3 items-center">
                  <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate text-slate-800 dark:text-white">{p.name}</h4>
                    <p className="text-xs text-brand font-bold mt-1">{fmt(p.price)} تومان</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
