import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowLeft, Loader2, Sparkles, Fingerprint, ShieldCheck, Terminal, Wifi } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import usePageTitle from '../hooks/usePageTitle.js'

export default function Login() {
  usePageTitle('ورود امن به سیستم')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const cardRef = useRef(null)

  // افکت 3D Tilt (کج شدن کارت با موس)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // تشخیص Caps Lock
  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLock(e.getModifierState('CapsLock'))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        setError('دسترسی رد شد. نام کاربری یا رمز عبور اشتباه است.')
        // انیمیشن لرزش
        cardRef.current.animate(
          { transform: ['translateX(0)', 'translateX(-10px)', 'translateX(10px)', 'translateX(-10px)', 'translateX(10px)', 'translateX(0)'] },
          { duration: 400, easing: 'ease-in-out' }
        )
      }
    } catch (err) {
      setError('خطا در برقراری ارتباط با سرور امن.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#050814] transition-colors duration-500 py-10 px-4">
      
      {/* پس‌زمینه ماتریکسی (فقط تم تاریک) */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        {/* افکت نورهای نئونی */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center relative z-10">
        
        {/* ===== سمت چپ: بخش برندینگ ===== */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col justify-center space-y-8 pl-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/30 bg-brand/10 text-brand-light text-sm font-bold w-fit backdrop-blur-md">
            <ShieldCheck size={18} /> Secure Access Protocol
          </div>
          
          <h1 className="text-6xl xl:text-7xl font-black text-slate-800 dark:text-white leading-[1.1] tracking-tight">
            به آینده‌ی <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-indigo-400">خرید هوشمند</span> <br />
            خوش آمدید.
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            با ورود به پنل مدیریت، به تمام ابزارهای تحلیل داده، مدیریت فروشندگان و دستیار هوش مصنوعی دسترسی پیدا می‌کنید.
          </p>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Fingerprint size={20} className="text-brand" /> احراز هویت JWT
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Wifi size={20} className="text-brand" /> ارتباط Real-time
            </div>
          </div>
        </motion.div>

        {/* ===== سمت راست: فرم لاگین با افکت 3D ===== */}
        <div className="w-full flex justify-center perspective-[1000px]">
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="glass-strong w-full max-w-md p-8 sm:p-10 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative bg-white/80 dark:bg-[#0a0f25]/90 backdrop-blur-2xl"
          >
            {/* نوار نئونی بالای کارت */}
            <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-80 shadow-[0_0_10px_#8b5cf6]"></div>

            <div className="text-center mb-8" style={{ transform: "translateZ(50px)" }}>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand/40">
                <Lock className="text-white" size={28} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">ورود مدیر / فروشنده</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center gap-1">
                <Terminal size={12} /> اتصال شما رمزنگاری شده است
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" style={{ transform: "translateZ(30px)" }}>
              
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border-l-4 border-red-500 text-red-500 text-xs p-3 rounded-r-lg flex items-center gap-2">
                  <ShieldAlert size={16} /> {error}
                </motion.div>
              )}

              {/* نام کاربری */}
              <div className="relative group">
                <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors z-10" />
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="نام کاربری"
                  className="w-full bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3.5 pr-12 pl-4 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 dark:text-white transition-all relative z-0"
                  required
                  disabled={loading}
                />
              </div>

              {/* رمز عبور */}
              <div className="relative group">
                <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors z-10" />
                <input 
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="رمز عبور"
                  className="w-full bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3.5 pr-12 pl-12 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 dark:text-white transition-all relative z-0"
                  required
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand transition-colors z-10"
                  tabIndex="-1"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* هشدار Caps Lock */}
              {capsLock && (
                <p className="text-[11px] text-amber-500 flex items-center gap-1"><ShieldAlert size={12}/> توجه: کلید Caps Lock شما روشن است!</p>
              )}

              {/* دکمه ورود */}
              <button 
                type="submit" 
                disabled={loading || !username || !password}
                className="relative w-full py-4 mt-2 rounded-xl bg-brand-dark text-white font-bold text-sm overflow-hidden group shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* افکت نور رد شونده (Shimmer) */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <><Loader2 size={20} className="animate-spin" /> در حال احراز هویت...</>
                  ) : (
                    <>ورود به سیستم <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /></>
                  )}
                </span>
              </button>
            </form>

            {/* راهنمای تست */}
            <div className="mt-8 pt-5 border-t border-slate-200 dark:border-white/10 text-center" style={{ transform: "translateZ(20px)" }}>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                <Sparkles size={14} className="text-brand" />
                <span>تست: <code className="bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-800 dark:text-brand-light">admin</code> / <code className="bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-800 dark:text-brand-light">admin123</code></span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
