import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { DollarSign, Users, ShoppingBag, TrendingUp, ArrowUpRight, Loader2, Store } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import { getSellerStats } from '../services/api.js' // 👈 تابع جدید رو ایمپورت کردیم

const salesData = [
  { name: 'شنبه', sales: 4000000, users: 240 },
  { name: 'یکشنبه', sales: 3000000, users: 198 },
  { name: 'دوشنبه', sales: 5500000, users: 380 },
  { name: 'سه‌شنبه', sales: 4500000, users: 308 },
  { name: 'چهارشنبه', sales: 6000000, users: 420 },
  { name: 'پنجشنبه', sales: 7000000, users: 500 },
  { name: 'جمعه', sales: 8500000, users: 650 },
]

export default function AdminDashboard() {
  usePageTitle('پنل مدیریت')
  const [sellers, setSellers] = useState([])
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // گرفتن آمار فروشنده‌ها از بک‌اند
    getSellerStats()
      .then(data => {
        setSellers(data)
        if (data.length > 0) setSelectedSeller(data[0])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand" size={40} /></div>
  }

  // اگه فروشنده‌ای نبود، یه دیتای تستی نشون بده تا داشبورد خالی نمونه
  const displaySellers = sellers.length > 0 ? sellers : [
    { id: 1, username: 'فروشنده تستی ۱', total_sales: 12500000, product_count: 3 },
    { id: 2, username: 'فروشنده تستی ۲', total_sales: 8500000, product_count: 5 },
  ]

  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">داشبورد مدیریت</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">مدیریت فروشندگان و تحلیل فروش.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* لیست فروشنده‌ها (ستون سمت راست) */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Store size={18} className="text-brand" /> لیست فروشندگان
          </h3>
          {displaySellers.map(seller => (
            <button
              key={seller.id}
              onClick={() => setSelectedSeller(seller)}
              className={`w-full text-right p-4 rounded-xl transition-all ${
                selectedSeller?.id === seller.id 
                  ? 'bg-brand text-white shadow-lg shadow-brand/30' 
                  : 'glass hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <p className="font-bold">{seller.username}</p>
              <p className={`text-xs mt-1 ${selectedSeller?.id === seller.id ? 'text-white/80' : 'text-slate-500'}`}>
                {seller.product_count} محصول
              </p>
            </button>
          ))}
        </div>

        {/* آمار و نمودارها (ستون‌های باقی‌مانده) */}
        <div className="lg:col-span-3 space-y-6">
          {/* کارت‌های آماری فروشنده انتخاب شده */}
          <div className="grid gap-4 sm:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
              <p className="text-xs text-slate-500 dark:text-slate-400">فروش کل {selectedSeller?.username}</p>
              <h3 className="text-2xl font-extrabold text-emerald-500 mt-1">
                {selectedSeller?.total_sales?.toLocaleString('fa-IR') || 0} <span className="text-xs">تومان</span>
              </h3>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
              <p className="text-xs text-slate-500 dark:text-slate-400">تعداد محصولات</p>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
                {selectedSeller?.product_count || 0}
              </h3>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
              <p className="text-xs text-slate-500 dark:text-slate-400">وضعیت</p>
              <h3 className="text-xl font-bold text-brand mt-1">فعال</h3>
            </motion.div>
          </div>

          {/* نمودار فروش */}
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
        </div>
      </div>
    </div>
  )
}
