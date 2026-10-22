import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Store, Loader2, UserPlus } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import { getSellerStats, createSeller } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { fmt } from '../data/products.js'

const salesData = [
  { name: 'شنبه', sales: 4000000 }, { name: 'یکشنبه', sales: 3000000 },
  { name: 'دوشنبه', sales: 5500000 }, { name: 'سه‌شنبه', sales: 4500000 },
  { name: 'چهارشنبه', sales: 6000000 }, { name: 'پنجشنبه', sales: 7000000 },
  { name: 'جمعه', sales: 8500000 },
]

export default function AdminDashboard() {
  usePageTitle('پنل مدیریت')
  const { toast } = useToast()
  
  const [sellers, setSellers] = useState([])
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [loading, setLoading] = useState(true)

  // استیت فرم ساخت فروشنده
  const [newSeller, setNewSeller] = useState({ username: '', password: '', email: '' })
  const [isCreating, setIsCreating] = useState(false)

  const loadStats = () => {
    getSellerStats()
      .then(data => {
        setSellers(data)
        if (data.length > 0) setSelectedSeller(data[0])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleCreateSeller = async (e) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      await createSeller(newSeller)
      toast('فروشنده با موفقیت ساخته شد!')
      setNewSeller({ username: '', password: '', email: '' })
      loadStats() // لیست رو رفرش کن
    } catch (err) {
      toast(err.message || 'خطا در ساخت فروشنده')
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand" size={40} /></div>
  }

  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">داشبورد مدیریت</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">مدیریت فروشندگان و تحلیل فروش.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* ستون سمت راست: لیست فروشنده‌ها و فرم ساخت */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* فرم ساخت فروشنده */}
          <div className="glass-card p-5">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 text-sm">
              <UserPlus size={16} className="text-brand" /> افزودن فروشنده جدید
            </h3>
            <form onSubmit={handleCreateSeller} className="space-y-3">
              <input required placeholder="نام کاربری" value={newSeller.username} onChange={e => setNewSeller({...newSeller, username: e.target.value})} className="w-full glass px-3 py-2 rounded-lg text-sm dark:text-white" />
              <input required type="email" placeholder="ایمیل" value={newSeller.email} onChange={e => setNewSeller({...newSeller, email: e.target.value})} className="w-full glass px-3 py-2 rounded-lg text-sm dark:text-white" />
              <input required type="password" placeholder="رمز عبور" value={newSeller.password} onChange={e => setNewSeller({...newSeller, password: e.target.value})} className="w-full glass px-3 py-2 rounded-lg text-sm dark:text-white" />
              <button type="submit" disabled={isCreating} className="btn-brand w-full !py-2 text-xs">
                {isCreating ? 'در حال ساخت...' : 'ساخت فروشنده'}
              </button>
            </form>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Store size={18} className="text-brand" /> لیست فروشندگان
            </h3>
            {sellers.length === 0 && <p className="text-xs text-slate-500">فروشنده‌ای یافت نشد.</p>}
            {sellers.map(seller => (
              <button
                key={seller.id}
                onClick={() => setSelectedSeller(seller)}
                className={`w-full text-right p-3 rounded-xl transition-all ${
                  selectedSeller?.id === seller.id 
                    ? 'bg-brand text-white shadow-lg shadow-brand/30' 
                    : 'glass hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <p className="font-bold text-sm">{seller.username}</p>
                <p className={`text-xs mt-1 ${selectedSeller?.id === seller.id ? 'text-white/80' : 'text-slate-500'}`}>
                  {seller.product_count} محصول
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ستون‌های اصلی: آمار و نمودار */}
        <div className="lg:col-span-3 space-y-6">
          {selectedSeller ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">فروش کل {selectedSeller.username}</p>
                  <h3 className="text-2xl font-extrabold text-emerald-500 mt-1">
                    {selectedSeller.total_sales.toLocaleString('fa-IR')} <span className="text-xs">تومان</span>
                  </h3>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">تعداد محصولات</p>
                  <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{selectedSeller.product_count}</h3>
                </motion.div>
              </div>

              <div className="glass-card p-5">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6">نمودار فروش (شبیه‌سازی شده)</h3>
                <div className="h-72 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000000}M`} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Area type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card flex h-64 items-center justify-center text-slate-500">
              فروشنده‌ای برای نمایش انتخاب کنید یا یکی بسازید.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
