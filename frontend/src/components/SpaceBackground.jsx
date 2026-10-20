import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'

export default function SpaceBackground() {
  const starsRef = useRef([])

  // تعداد ستاره‌ها رو از ۱۵۰ به ۶۰ کاهش دادیم تا سبک بشه
  const stars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      delay: Math.random() * 3, // تاخیر برای چشمک زدن
    }))
  }, [])

  useEffect(() => {
    let animationFrameId
    const handleMouseMove = (e) => {
      // استفاده از requestAnimationFrame برای جلوگیری از لگ
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(() => {
        const mouseX = e.clientX
        const mouseY = e.clientY
        const radius = 120
        const force = 30

        starsRef.current.forEach((star) => {
          if (!star) return
          const rect = star.getBoundingClientRect()
          const starX = rect.left + rect.width / 2
          const starY = rect.top + rect.height / 2
          const dx = mouseX - starX
          const dy = mouseY - starY
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < radius) {
            const angle = Math.atan2(dy, dx)
            const strength = (radius - distance) / radius
            star.style.transform = `translate(${Math.cos(angle) * strength * force * -1}px, ${Math.sin(angle) * strength * force * -1}px)`
            star.style.transition = 'transform 0.1s ease-out'
          } else {
            star.style.transform = `translate(0px, 0px)`
            star.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
          }
        })
      })
    }

    // فقط روی دستگاه‌هایی که موس دارن فعال میشه (موبایل درگیر نشه)
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', handleMouseMove)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-slate-50 dark:bg-[#050814] transition-colors duration-500">
      
      {/* سحابی‌ها (استفاده از filter به جای backdrop-filter برای سبک‌تر شدن) */}
      <motion.div
        className="absolute -left-[20%] -top-[20%] h-[500px] w-[500px] rounded-full bg-brand/20 blur-[80px] dark:bg-brand/25"
        animate={{ x: [0, 40, -20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-[20%] top-[20%] h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[70px] dark:bg-indigo-600/25"
        animate={{ x: [0, -30, 20, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ستاره‌ها با انیمیشن CSS */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-1000">
        {stars.map((star, i) => (
          <div
            key={star.id}
            ref={(el) => (starsRef.current[i] = el)}
            className="absolute"
            style={{ left: `${star.left}%`, top: `${star.top}%` }}
          >
            <div
              className="rounded-full bg-white shadow-[0_0_3px_rgba(255,255,255,0.8)] animate-twinkle"
              style={{
                width: star.size,
                height: star.size,
                animationDelay: `${star.delay}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
