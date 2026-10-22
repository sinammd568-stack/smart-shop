import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Store, Loader2, UserPlus, Users, ShoppingBag, DollarSign, Package } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import { getSellerStats, createSeller, getOrders, getUsers } from '../services/api.js'
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
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview') // overview, orders, users

  // فرم ساخت فروشنده
  const [newSeller, setNewSeller] = useState({ username: '', password: '', email: '' })
  const [isCreating, setIsCreating] = useState(false)

  const loadAllData = () => {
    setLoading(true)
    Promise.all([getSellerStats(), getOrders(), getUsers()])
      .then(([sellersData, ordersData, usersData]) => {
        setSellers(sellersData)
        setOrders(ordersData)
        setUsers(usersData)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const handleCreateSeller = async (e) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      await createSeller(newSeller)
      toast('فروشنده با موفقیت ساخته شد!')
      setNewSeller({ username: '', password: '', email: '' })
      loadAllData()
    } catch (err) {
      toast(err.message || 'خطا در ساخت فروشنده (شاید نام کاربری تکراری است)')
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand" size={40} /></div>
  }

  // محاسبات کلی
  const totalRevenue = sellers.reduce((acc, curr) => acc + curr.total_sales, 0)

  return (
    <div className="py-8 space-y-6">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">داشبورد مدیریت</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">مدیریت کامل فروشگاه و کاربران.</p>
        </div>
        
        {/* تب‌ها */}
        <div className="flex gap-2 bg-slate-200 dark:bg-white/5 p-1 rounded-xl">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-brand text-brand dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>نمای کلی</button>
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-brand text-brand dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>سفارشات</button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white dark:bg-brand text-brand dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>کاربران</button>
        </div>
      </div>

      {/* ------------------ تب نمای کلی ------------------ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* کارت‌های آماری */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><DollarSign size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">درآمد کل</p>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{fmt(totalRevenue)} <span className="text-xs">تومان</span></h3>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><ShoppingBag size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">سفارشات کل</p>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{fmt(orders.length)}</h3>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 flex items-center gap-4">
              <div className="p-3 bg-brand/10 text-brand rounded-xl"><Users size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">کل کاربران</p>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{fmt(users.length)}</h3>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Store size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">فروشندگان</p>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{fmt(sellers.length)}</h3>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* نمودار */}
            <div className="glass-card p-5 lg:col-span-2">
              <h3 className="font-bold text-slate-800 dark:text-white mb-6">روند فروش هفتگی (تومان)</h3>
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

            {/* ساخت فروشنده */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                <UserPlus size={18} className="text-brand" /> افزودن فروشنده جدید
              </h3>
              <form onSubmit={handleCreateSeller} className="space-y-3">
                <input required placeholder="نام کاربری" value={newSeller.username} onChange={e => setNewSeller({...newSeller, username: e.target.value})} className="w-full glass px-3 py-2.5 rounded-lg text-sm dark:text-white" />
                <input required type="email" placeholder="ایمیل" value={newSeller.email} onChange={e => setNewSeller({...newSeller, email: e.target.value})} className="w-full glass px-3 py-2.5 rounded-lg text-sm dark:text-white" />
                <input required type="password" placeholder="رمز عبور" value={newSeller.password} onChange={e => setNewSeller({...newSeller, password: e.target.value})} className="w-full glass px-3 py-2.5 rounded-lg text-sm dark:text-white" />
                <button type="submit" disabled={isCreating} className="btn-brand w-full !py-2.5">
                  {isCreating ? 'در حال ساخت...' : 'ساخت فروشنده'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ تب سفارشات ------------------ */}
      {activeTab === 'orders' && (
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-white/10">
            <h3 className="font-bold text-slate-800 dark:text-white">لیست سفارشات</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5">
                <tr>
                  <th className="px-5 py-3 font-medium">شماره</th>
                  <th className="px-5 py-3 font-medium">مشتری</th>
                  <th className="px-5 py-3 font-medium">مبلغ</th>
                  <th className="px-5 py-3 font-medium">وضعیت</th>
                  <th className="px-5 py-3 font-medium">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {orders.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-slate-500">سفارشی ثبت نشده است.</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs">#{order.id}</td>
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">{order.first_name || 'مهمان'}</td>
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{fmt(order.total_price)} <span className="text-[10px] font-normal text-slate-500">تومان</span></td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                        order.status === 'canceled' ? 'bg-red-500/10 text-red-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {order.status === 'pending' ? 'در انتظار' : order.status === 'delivered' ? 'تحویل شده' : 'در حال پردازش'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{new Date(order.created_at).toLocaleDateString('fa-IR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------ تب کاربران ------------------ */}
      {activeTab === 'users' && (
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white">لیست کاربران و فروشندگان</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5">
                <tr>
                  <th className="px-5 py-3 font-medium">نام کاربری</th>
                  <th className="px-5 py-3 font-medium">ایمیل</th>
                  <th className="px-5 py-3 font-medium">نقش</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      {u.username}
                      {u.is_staff && <span className="bg-red-500/10 text-red-500 text-[10px] px-1.5 py-0.5 rounded">ادمین</span>}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{u.email || 'ندارد'}</td>
                    <td className="px-5 py-4">
                      {u.is_seller ? (
                         <span className="bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-md text-[11px] font-bold">فروشنده</span>
                      ) : u.is_staff ? (
                        <span className="bg-purple-500/10 text-purple-500 px-2.5 py-1 rounded-md text-[11px] font-bold">مدیر</span>
                      ) : (
                        <span className="bg-slate-500/10 text-slate-500 px-2.5 py-1 rounded-md text-[11px] font-bold">کاربر عادی</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
