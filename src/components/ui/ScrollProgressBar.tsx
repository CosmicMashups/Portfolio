import { motion, useScroll } from 'framer-motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9997] h-[2px]">
      <motion.div
        className="relative h-full origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary))',
        }}
      >
        <span
          className="absolute right-0 top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full"
          style={{
            background: 'var(--color-accent-primary)',
            boxShadow: '0 0 8px var(--color-accent-primary)',
          }}
        />
      </motion.div>
    </div>
  )
}
