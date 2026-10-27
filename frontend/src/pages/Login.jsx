import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Lock, User, Eye, EyeOff, ShieldAlert, ArrowLeft, ArrowRight, Loader2, ShieldCheck, Terminal
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import usePageTitle from '../hooks/usePageTitle.js'

const REMEMBER_KEY = 'remembered-username'
const safeGet = (k) => { try { return localStorage.getItem(k) || '' } catch { return '' } }
const safeSet = (k, v) => { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k) } catch {} }

export default function Login() {
  usePageTitle('ورود به حساب کاربری')
  
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState(safeGet(REMEMBER_KEY))
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(!!safeGet(REMEMBER_KEY))
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  // ==========================================
  // افکت 3D (Liquid Glass)
  // ==========================================
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    x.set(mouseX / width - 0.5)
    y.set(mouseY / height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // ==========================================
  // منطق فرم
  // ==========================================
  const handleNextStep = (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setError('لطفاً نام کاربری خود را وارد کنید.')
      return
    }
    setError('')
    setStep(2)
  }

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
        if (rememberMe) safeSet(REMEMBER_KEY, username)
        else safeSet(REMEMBER_KEY, '')

        if (res.user.is_staff) navigate('/admin', { replace: true })
        else if (res.user.is_seller) navigate('/seller', { replace: true })
        else navigate('/', { replace: true })
      } else {
        setError('نام کاربری یا رمز عبور اشتباه است.')
        if (cardRef.current) {
          cardRef.current.animate(
            { transform: ['translateX(0)', 'translateX(-8px)', 'translateX(8px)', 'translateX(-8px)', 'translateX(8px)', 'translateX(0)'] },
            { duration: 400, easing: 'ease-in-out' }
          )
        }
      }
    } catch (err) {
      setError('خطا در برقراری ارتباط با سرور.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // 👈 پس‌زمینه صفحه کاملاً شفاف شد تا با فضا و ستاره‌های پشتش یکی بشه
    <div 
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-transparent py-10 px-4"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* ===== افکت نور پشت شیشه ===== */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* نور بنفش ملایم دقیقاً پشت کارت */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-brand/20 dark:bg-brand/30 blur-[120px] rounded-full animate-pulse"></div>
      </div>

      {/* ===== کارت اصلی (شیشه شفاف) ===== */}
      <div className="relative w-full max-w-sm z-10" style={{ perspective: '1200px' }}>
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          animate={{ y: [0, -6, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-full"
        >
          <div 
            // 👈 پس‌زمینه کارت صفر شد (bg-transparent) و فقط بلور قوی و حاشیه شیشه‌ای داره
            className="rounded-3xl border border-slate-300/30 dark:border-white/10 p-6 sm:p-8 flex flex-col justify-center bg-white/10 dark:bg-transparent backdrop-blur-2xl relative overflow-hidden min-h-[420px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(139,92,246,0.15)]"
          >
            {/* نوار نور بالای کارت */}
            <div className={`absolute top-0 left-10 right-10 h-[2px] transition-colors duration-500 ${
              step === 1 
                ? 'bg-gradient-to-r from-transparent via-brand to-transparent shadow-[0_0_15px_#8b5cf6]' 
                : 'bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_#10b981]'
            }`}></div>

            <AnimatePresence mode="wait">
              {/* ==================== مرحله ۱: نام کاربری ==================== */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full"
                  style={{ transform: "translateZ(40px)" }} 
                >
                  <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(139,92,246,0.6)]">
                      <User className="text-white" size={28} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">ورود به سیستم</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 flex items-center justify-center gap-1 font-medium">
                      <Terminal size={12} /> مرحله ۱: شناسایی کاربر
                    </p>
                  </div>

                  <form onSubmit={handleNextStep} className="space-y-6">
                    {error && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 text-xs p-3 rounded-r-lg flex items-center gap-2">
                        <ShieldAlert size={16} className="shrink-0" /> {error}
                      </motion.div>
                    )}

                    <div className="relative group">
                      <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-brand transition-colors z-10" />
                      <input 
                        type="text" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="نام کاربری"
                        className="w-full bg-white/50 dark:bg-black/40 border border-slate-300/50 dark:border-white/10 rounded-xl py-3.5 pr-12 pl-4 text-base sm:text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 text-slate-800 dark:text-white transition-all relative z-0 dir-ltr text-left placeholder:text-slate-400"
                        required
                        autoFocus
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={!username}
                      className="relative w-full py-3.5 rounded-xl bg-brand-dark text-white font-bold text-sm overflow-hidden group shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        ادامه <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ==================== مرحله ۲: رمز عبور ==================== */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(16,185,129,0.6)]">
                      <Lock className="text-white" size={28} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">رمز عبور</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 flex items-center justify-center gap-1 font-medium">
                      <ShieldCheck size={12} className="text-emerald-500" /> مرحله ۲: احراز هویت
                    </p>
                    <div className="mt-3 inline-block bg-white/60 dark:bg-black/40 border border-slate-300/50 dark:border-white/10 px-3 py-1 rounded-full text-xs font-mono text-slate-800 dark:text-slate-200 dir-ltr shadow-sm">
                      {username}
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 text-xs p-3 rounded-r-lg flex items-center gap-2">
                        <ShieldAlert size={16} className="shrink-0" /> {error}
                      </motion.div>
                    )}

                    <div className="relative group">
                      <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10" />
                      <input 
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/50 dark:bg-black/40 border border-slate-300/50 dark:border-white/10 rounded-xl py-3.5 pr-12 pl-12 text-base sm:text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-slate-800 dark:text-white transition-all relative z-0 dir-ltr text-left placeholder:text-slate-400"
                        required
                        autoFocus
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors z-10 p-1"
                        tabIndex="-1"
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer w-fit font-medium">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 accent-emerald-500" 
                      />
                      مرا به خاطر بسپار
                    </label>

                    <div className="flex flex-col gap-3 pt-2">
                      <button 
                        type="submit" 
                        disabled={loading || !password}
                        className="relative w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm overflow-hidden group shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative flex items-center justify-center gap-2">
                          {loading ? (
                            <><Loader2 size={18} className="animate-spin" /> در حال بررسی...</>
                          ) : (
                            <>تایید و ورود <ShieldCheck size={18} /></>
                          )}
                        </span>
                      </button>

                      <button 
                        type="button" 
                        onClick={() => { setStep(1); setError(''); setPassword('') }}
                        className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1 transition-colors py-1 font-medium"
                      >
                        <ArrowRight size={14} /> تغییر نام کاربری
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
