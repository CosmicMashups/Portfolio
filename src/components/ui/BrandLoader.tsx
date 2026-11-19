import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { motionEase } from '@/lib/motion/presets'

const LOADER_DURATION_MS = 1500
const WORDMARK = 'YURI BROWN'

const letterVariants = {
  hidden: { y: '110%' },
  show: (i: number) => ({
    y: '0%',
    transition: { duration: 0.6, ease: motionEase, delay: 0.08 + i * 0.028 },
  }),
}

/**
 * Brief branded splash shown once per load before the hero reveals. Reads as an
 * actual loading sequence — a staggered wordmark reveal, a filling progress rule,
 * and a counting percentage readout, all synced to LOADER_DURATION_MS — rather
 * than a static logo fading in. Skipped entirely under reduced motion rather than
 * played in a shortened form — there is nothing left worth showing once the
 * motion driving it is stripped.
 */
export function BrandLoader() {
  const reduce = usePrefersReducedMotion()
  const [visible, setVisible] = useState(!reduce)
  const [percent, setPercent] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduce) return
    let frame: number
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      setPercent(Math.min(100, Math.round((elapsed / LOADER_DURATION_MS) * 100)))
      if (elapsed < LOADER_DURATION_MS) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const id = window.setTimeout(() => setVisible(false), LOADER_DURATION_MS)
    return () => {
      window.clearTimeout(id)
      cancelAnimationFrame(frame)
    }
  }, [reduce])

  if (reduce) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[var(--z-system)] flex flex-col items-center justify-center gap-6 bg-[var(--color-bg-base)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: motionEase, delay: 0.1 } }}
          aria-hidden="true"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-[var(--color-accent-primary)]"
          >
            Initializing System
          </motion.span>

          <motion.div
            exit={{ scale: 0.94, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: motionEase }}
            className="flex overflow-hidden"
          >
            {WORDMARK.split('').map((char, i) => (
              <span key={`${char}-${i}`} className="inline-block overflow-hidden">
                <motion.span
                  custom={i}
                  initial="hidden"
                  animate="show"
                  variants={letterVariants}
                  className="inline-block font-[var(--font-display)] text-5xl uppercase leading-[0.9] tracking-[-0.01em] text-[var(--color-text-primary)] sm:text-6xl"
                >
                  {char === ' ' ? ' ' : char}
                </motion.span>
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex w-40 items-center gap-3 sm:w-56"
          >
            <div className="relative h-px flex-1 overflow-hidden bg-[var(--color-border-subtle)]">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[var(--color-accent-primary)]"
                initial={{ width: '0%' }}
                animate={{ width: `${percent}%` }}
                transition={{ ease: 'linear', duration: 0.1 }}
              />
            </div>
            <span className="w-9 shrink-0 font-[var(--font-mono)] text-[11px] tabular-nums text-[var(--color-text-primary)]/60">
              {percent}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
