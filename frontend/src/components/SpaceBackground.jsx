import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function SpaceBackground() {
  // تولید ستاره‌های تصادفی
  const stars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }))
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-slate-50 dark:bg-[#050814] transition-colors duration-500">
      
      {/* ستاره‌ها (فقط توی تم تاریک پررنگ میشن) */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-1000">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          />
        ))}
      </div>

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
    </div>
  )
}
