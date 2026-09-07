import { motion, useScroll } from 'framer-motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9997] h-[2px] bg-[var(--color-border-subtle)]">
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'var(--color-accent-primary)',
        }}
      />
    </div>
  )
}
