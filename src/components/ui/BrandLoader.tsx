import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { motionEase } from '@/lib/motion/presets'

const LOADER_DURATION_MS = 950

/**
 * Brief branded splash shown once per load before the hero reveals.
 * Skipped entirely under reduced motion rather than played in a shortened form —
 * there is nothing left worth showing once the motion is stripped.
 */
export function BrandLoader() {
  const reduce = usePrefersReducedMotion()
  const [visible, setVisible] = useState(!reduce)

  useEffect(() => {
    if (reduce) return
    const id = window.setTimeout(() => setVisible(false), LOADER_DURATION_MS)
    return () => window.clearTimeout(id)
  }, [reduce])

  if (reduce) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[var(--z-system)] flex items-center justify-center bg-[var(--color-bg-base)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: motionEase }}
          aria-hidden="true"
        >
          <motion.span
            className="font-[var(--font-display)] text-5xl tracking-[-0.01em] text-[#ff6b1a] sm:text-6xl"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: motionEase }}
          >
            YB
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
