import { motion } from 'framer-motion'
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts'
import { DollarSign, Users, ShoppingBag, TrendingUp, ArrowUpRight } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'

// داده‌های تستی برای نمودارها (بعداً به دیتابیس وصل میشن)
const salesData = [
  { name: 'شنبه', sales: 4000000, users: 240 },
  { name: 'یکشنبه', sales: 3000000, users: 198 },
  { name: 'دوشنبه', sales: 5500000, users: 380 },
  { name: 'سه‌شنبه', sales: 4500000, users: 308 },
  { name: 'چهارشنبه', sales: 6000000, users: 420 },
  { name: 'پنجشنبه', sales: 7000000, users: 500 },
  { name: 'جمعه', sales: 8500000, users: 650 },
]

const recentOrders = [
  { id: 'ORD-1042', customer: 'علی محمدی', product: 'هدفون Aura ANC', price: '۱,۸۵۰,۰۰۰', status: 'در حال ارسال' },
  { id: 'ORD-1041', customer: 'سارا احمدی', product: 'ساعت Nova Fit 2', price: '۳,۹۰۰,۰۰۰', status: 'تحویل شده' },
  { id: 'ORD-1040', customer: 'رضا کریمی', product: 'کیبورد مکانیکال', price: '۲,۱۰۰,۰۰۰', status: 'در انتظار پرداخت' },
]

export default function AdminDashboard() {
  usePageTitle('پنل مدیریت')
  
  return (
    <div className="py-8 space-y-6">
      {/* هدر داشبورد */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">داشبورد مدیریت</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">به پنل کنترل فروشگاه هوشمند خوش آمدید.</p>
        </div>
        <div className="text-xs font-bold text-brand-dark dark:text-brand-light bg-brand/10 px-3 py-1.5 rounded-full">
          آخرین بروزرسانی: همین الان
        </div>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'درآمد کل', value: '۳۸,۵۰۰,۰۰۰', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'کاربران فعال', value: '۲,۴۵۰', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'سفارشات', value: '۱۸۲', icon: ShoppingBag, color: 'text-brand', bg: 'bg-brand/10' },
          { title: 'نرخ تبدیل', value: '۳.۲٪', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.title}</p>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* بخش نمودارها */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* نمودار فروش (Area) */}
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
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#a78bfa' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار کاربران (Bar) */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">بازدیدکنندگان</h3>
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* جدول سفارشات اخیر */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white">سفارشات اخیر</h3>
          <button className="text-sm text-brand hover:text-brand-dark dark:hover:text-brand-light flex items-center gap-1 transition-colors">
            مشاهده همه <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5">
              <tr>
                <th className="px-5 py-3 font-medium">شماره سفارش</th>
                <th className="px-5 py-3 font-medium">مشتری</th>
                <th className="px-5 py-3 font-medium">محصول</th>
                <th className="px-5 py-3 font-medium">مبلغ</th>
                <th className="px-5 py-3 font-medium">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {recentOrders.map((order, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs">{order.id}</td>
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">{order.customer}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{order.product}</td>
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{order.price} <span className="text-[10px] font-normal text-slate-500">تومان</span></td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      order.status === 'تحویل شده' ? 'bg-emerald-500/10 text-emerald-500' :
                      order.status === 'در حال ارسال' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
