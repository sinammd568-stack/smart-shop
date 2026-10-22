import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import usePageTitle from '../hooks/usePageTitle.js'

export default function Login() {
  usePageTitle('ورود به پنل مدیریت')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // صفحه‌ای که کاربر می‌خواست بره (مثلاً /admin)
  const from = location.state?.from?.pathname || '/admin'

      const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await login(username, password)
    setLoading(false)

    if (res.success) {
      // 👈 هدایت بر اساس نقش
      if (res.user.is_staff) {
        navigate('/admin', { replace: true })
      } else if (res.user.is_seller) {
        navigate('/seller', { replace: true })
      } else {
        navigate('/', { replace: true }) // کاربر عادی
      }
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="glass-strong w-full max-w-md p-8 rounded-3xl relative overflow-hidden"
      >
        {/* افکت نور پس‌زمینه */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand/30 rounded-full blur-[60px]" />
        
        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto w-16 h-16 bg-brand/20 rounded-2xl flex items-center justify-center mb-4 border border-brand/30 shadow-lg shadow-brand/20">
            <Lock className="text-brand-light" size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">ورود مدیر</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">برای دسترسی به داشبورد، وارد شوید.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-3 rounded-xl flex items-center gap-2">
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">نام کاربری</label>
            <div className="relative">
              <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full glass bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-3 pr-10 pl-4 text-sm outline-none focus:border-brand transition-colors dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">رمز عبور</label>
            <div className="relative">
              <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-3 pr-10 pl-10 text-sm outline-none focus:border-brand transition-colors dark:text-white"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-brand w-full py-3 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'در حال بررسی...' : 'ورود به داشبورد'}
            {!loading && <ArrowLeft size={18} />}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 relative z-10">
          <p>برای تست: نام کاربری <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">admin</code> و رمز <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">admin123</code></p>
        </div>
      </motion.div>
    </div>
  )
}
