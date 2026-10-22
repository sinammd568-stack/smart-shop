import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowLeft, ArrowRight, Loader2, Sparkles, Terminal, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import usePageTitle from '../hooks/usePageTitle.js'

export default function Login() {
  usePageTitle('ورود امن به سیستم')
  const [step, setStep] = useState(1) // 👈 مرحله ۱: نام کاربری، مرحله ۲: رمز عبور
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  // رفتن به مرحله رمز عبور
  const handleNextStep = (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setError('لطفاً نام کاربری خود را وارد کنید.')
      return
    }
    setError('')
    setStep(2)
  }

  // ارسال نهایی و لاگین
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!password) {
      setError('لطفاً رمز عبور را وارد کنید.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await login(username, password)
      
      if (res.success) {
        if (res.user.is_staff) {
          navigate('/admin', { replace: true })
        } else if (res.user.is_seller) {
          navigate('/seller', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      } else {
        setError('نام کاربری یا رمز عبور اشتباه است.')
        // لرزش کارت در صورت خطا
        const card = document.getElementById('login-card')
        if (card) {
          card.animate(
            { transform: ['translateX(0)', 'translateX(-10px)', 'translateX(10px)', 'translateX(-10px)', 'translateX(10px)', 'translateX(0)'] },
            { duration: 400, easing: 'ease-in-out' }
          )
        }
      }
    } catch (err) {
      setError('خطا در برقراری ارتباط با سرور امن.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#050814] transition-colors duration-500 py-10 px-4">
      
      {/* افکت‌های پس‌زمینه نئونی */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 dark:bg-brand/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* کانتینر اصلی کارت با افکت پرسپکتیو */}
      <div className="relative w-full max-w-sm h-[420px] z-10" style={{ perspective: '1500px' }}>
        
        <motion.div
          id="login-card"
          animate={{ rotateY: step === 2 ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ==================== روی کارت (مرحله نام کاربری) ==================== */}
          <div 
            className="absolute inset-0 glass-strong rounded-[2rem] border border-white/10 shadow-2xl p-8 flex flex-col justify-center bg-white/90 dark:bg-[#0a0f25]/90 backdrop-blur-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* نوار نور بالای کارت */}
            <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-80 shadow-[0_0_10px_#8b5cf6]"></div>

            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand/40">
                <User className="text-white" size={28} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">ورود به سیستم</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center gap-1">
                <Terminal size={12} /> مرحله ۱ از ۲: شناسایی کاربر
              </p>
            </div>

            <form onSubmit={handleNextStep} className="space-y-6">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border-l-4 border-red-500 text-red-500 text-xs p-3 rounded-r-lg flex items-center gap-2">
                  <ShieldAlert size={16} /> {error}
                </motion.div>
              )}

              <div className="relative group">
                <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors z-10" />
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="نام کاربری خود را وارد کنید"
                  className="w-full bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3.5 pr-12 pl-4 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 dark:text-white transition-all relative z-0 dir-ltr text-left"
                  required
                  autoFocus
                />
              </div>

              <button 
                type="submit" 
                disabled={!username}
                className="relative w-full py-3.5 rounded-xl bg-brand-dark text-white font-bold text-sm overflow-hidden group shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative flex items-center justify-center gap-2">
                  ادامه <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </span>
              </button>
            </form>
          </div>

          {/* ==================== پشت کارت (مرحله رمز عبور) ==================== */}
          <div 
            className="absolute inset-0 glass-strong rounded-[2rem] border border-white/10 shadow-2xl p-8 flex flex-col justify-center bg-white/90 dark:bg-[#0a0f25]/90 backdrop-blur-2xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-80 shadow-[0_0_10px_#10b981]"></div>

            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/40">
                <Lock className="text-white" size={28} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">رمز عبور</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" /> مرحله ۲ از ۲: احراز هویت
              </p>
              {/* نمایش نام کاربری که در مرحله قبل وارد شد */}
              <div className="mt-3 inline-block bg-slate-200 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-slate-600 dark:text-slate-300 dir-ltr">
                {username}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border-l-4 border-red-500 text-red-500 text-xs p-3 rounded-r-lg flex items-center gap-2">
                  <ShieldAlert size={16} /> {error}
                </motion.div>
              )}

              <div className="relative group">
                <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10" />
                <input 
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3.5 pr-12 pl-12 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 dark:text-white transition-all relative z-0 dir-ltr text-left"
                  required
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors z-10"
                  tabIndex="-1"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  type="submit" 
                  disabled={loading || !password}
                  className="relative w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm overflow-hidden group shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <><Loader2 size={20} className="animate-spin" /> در حال بررسی...</>
                    ) : (
                      <>تایید و ورود <ShieldCheck size={18} /></>
                    )}
                  </span>
                </button>

                {/* دکمه بازگشت به مرحله قبل */}
                <button 
                  type="button" 
                  onClick={() => { setStep(1); setError(''); }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center gap-1 transition-colors"
                >
                  <ArrowRight size={14} /> تغییر نام کاربری
                </button>
              </div>
            </form>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
