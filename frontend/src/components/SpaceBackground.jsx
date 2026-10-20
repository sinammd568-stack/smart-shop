import { motion } from 'framer-motion'

const ORBS = [
  { size: 400, x: '-10%', y: '-10%', color: 'bg-brand/20 dark:bg-brand/15' },
  { size: 350, x: '80%', y: '10%', color: 'bg-indigo-500/20 dark:bg-indigo-500/15' },
  { size: 250, x: '30%', y: '60%', color: 'bg-purple-500/20 dark:bg-purple-500/15' },
]

export default function SpaceBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[100px] ${orb.color}`}
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
