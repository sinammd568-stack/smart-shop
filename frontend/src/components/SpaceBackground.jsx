import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'

export default function SpaceBackground() {
  const starsRef = useRef([])

  // تولید ستاره‌ها با سایز، موقعیت و سرعت تصادفی (تنوع بالا)
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => {
      // سایز از ۰.۵ پیکسل تا ۳ پیکسل
      const size = Math.random() * 2.5 + 0.5
      return {
        id: i,
        left: Math.random() * 100, // درصد موقعیت افقی
        top: Math.random() * 100,  // درصد موقعیت عمودی
        size,
        duration: Math.random() * 3 + 2, // سرعت چشمک زدن
        delay: Math.random() * 2,
        driftDuration: Math.random() * 20 + 20, // سرعت شنا کردن آروم
      }
    })
  }, [])

  // منطق فرار کردن ستاره‌ها از موس
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX
      const mouseY = e.clientY
      const radius = 120 // شعاعی که ستاره‌ها حس می‌کنن موس نزدیکه
      const force = 40 // قدرت فرار کردن

      starsRef.current.forEach((star) => {
        if (!star) return
        const rect = star.getBoundingClientRect()
        const starX = rect.left + rect.width / 2
        const starY = rect.top + rect.height / 2

        // فاصله ستاره تا موس
        const dx = mouseX - starX
        const dy = mouseY - starY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < radius) {
          // محاسبه زاویه و شدت فرار
          const angle = Math.atan2(dy, dx)
          const strength = (radius - distance) / radius // هرچی نزدیک‌تر، قوی‌تر
          const moveX = Math.cos(angle) * strength * force * -1
          const moveY = Math.sin(angle) * strength * force * -1

          star.style.transform = `translate(${moveX}px, ${moveY}px)`
          star.style.transition = 'transform 0.1s ease-out'
        } else {
          // برگشت به حالت اول با یه انیمیشن نرم
          star.style.transform = `translate(0px, 0px)`
          star.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-slate-50 dark:bg-[#050814] transition-colors duration-500">
      
      {/* سحابی‌های رنگی و متحرک */}
      <motion.div
        className="absolute -left-[20%] -top-[20%] h-[600px] w-[600px] rounded-full bg-brand/20 blur-[120px] dark:bg-brand/30"
        animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.1, 0.9, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-[20%] top-[20%] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[100px] dark:bg-indigo-600/30"
        animate={{ x: [0, -40, 30, 0], y: [0, 50, -20, 0], scale: [1, 0.9, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[20%] h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[90px] dark:bg-purple-600/20"
        animate={{ x: [0, 30, -40, 0], y: [0, -50, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ستاره‌ها */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-1000">
        {stars.map((star, i) => (
          // لایه بیرونی: مسئول جابه‌جایی با موس
          <div
            key={star.id}
            ref={(el) => (starsRef.current[i] = el)}
            className="absolute"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
          >
            {/* لایه داخلی: مسئول چشمک زدن و شنا کردن آروم */}
            <motion.div
              className="rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]"
              style={{
                width: star.size,
                height: star.size,
              }}
              animate={{
                opacity: [0.1, 0.8, 0.1],
                scale: [1, 1.3, 1],
                y: [0, -15, 15, 0],
                x: [0, 15, -15, 0],
              }}
              transition={{
                opacity: { duration: star.duration, repeat: Infinity, delay: star.delay },
                scale: { duration: star.duration, repeat: Infinity, delay: star.delay },
                y: { duration: star.driftDuration, repeat: Infinity, ease: 'linear' },
                x: { duration: star.driftDuration, repeat: Infinity, ease: 'linear' },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
