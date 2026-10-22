import { useState, useEffect, useRef } from 'react'
import { PlusCircle, Image as ImageIcon, Loader2, Store, X, CheckCircle2 } from 'lucide-react'
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
  const [imagePreview, setImagePreview] = useState(null)
  
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', old_price: '', category: 'audio', tag: ''
  })
  const [imageFile, setImageFile] = useState(null)

  const loadMyProducts = () => {
    fetchProducts().then(data => {
      const myProducts = data.filter(p => p.seller_name === user?.username)
      setProducts(myProducts)
    }).finally(() => setLoading(false))
  }

  useEffect(() => {
    loadMyProducts()
  }, [user])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile) {
      toast('لطفاً عکسی برای محصول انتخاب کنید')
      return
    }

    setSubmitting(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('category', formData.category)
      data.append('tag', formData.tag)
      if (formData.old_price) data.append('old_price', formData.old_price)
      data.append('image', imageFile)

      await createProduct(data)
      toast('محصول با موفقیت اضافه شد!')
      
      setFormData({ name: '', description: '', price: '', old_price: '', category: 'audio', tag: '' })
      setImageFile(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      
      loadMyProducts() 
    } catch (err) {
      toast(err.message || 'خطا در اضافه کردن محصول')
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
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4 sticky top-24">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <PlusCircle size={18} className="text-brand" /> افزودن محصول جدید
            </h3>
            
            {/* آپلود عکس */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">عکس محصول</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors overflow-hidden relative"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }} 
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    ><X size={14} /></button>
                  </>
                ) : (
                  <>
                    <ImageIcon size={32} className="text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500">برای انتخاب عکس کلیک کنید</span>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>

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
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">برچسب</label>
                <input value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full glass px-3 py-2 rounded-lg text-sm dark:text-white" placeholder="جدید" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">توضیحات و مشخصات</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" className="w-full glass px-3 py-2 rounded-lg text-sm dark:text-white" placeholder="مشخصات فنی و ویژگی‌های محصول..."></textarea>
            </div>

            <button type="submit" disabled={submitting} className="btn-brand w-full py-3">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'ثبت محصول'}
            </button>
          </form>
        </div>

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
                  <img src={p.image} alt={p.name} className="w-20 h-20 rounded-lg object-cover bg-slate-200" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate text-slate-800 dark:text-white">{p.name}</h4>
                    <p className="text-xs text-brand font-bold mt-1">{fmt(p.price)} تومان</p>
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500"/> موجود در فروشگاه</p>
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
