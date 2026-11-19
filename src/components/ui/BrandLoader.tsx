import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { motionEase } from '@/lib/motion/presets'

const LOADER_DURATION_MS = 1500
const RING_RADIUS = 42
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

/**
 * Brief branded splash shown once per load before the hero reveals. The loading
 * state is carried entirely by an animated SVG mark — a progress ring that fills
 * as the page actually loads, a diamond glyph that draws itself on, and a slow
 * orbiting tick — rather than by text (a static or letter-staggered logotype
 * reads as decoration, not as something loading). Skipped entirely under reduced
 * motion rather than played in a shortened form — there is nothing left worth
 * showing once the motion driving it is stripped.
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

  const dashOffset = RING_CIRCUMFERENCE * (1 - percent / 100)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[var(--z-system)] flex flex-col items-center justify-center gap-5 bg-[var(--color-bg-base)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: motionEase, delay: 0.1 } }}
          aria-hidden="true"
        >
          <motion.div
            exit={{ scale: 0.88, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: motionEase }}
            className="relative h-28 w-28 sm:h-32 sm:w-32"
          >
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              {/* Track */}
              <circle
                cx="50"
                cy="50"
                r={RING_RADIUS}
                fill="none"
                stroke="var(--color-border-subtle)"
                strokeWidth="1.5"
              />
              {/* Progress — fills as the page actually loads, not on a loop */}
              <circle
                cx="50"
                cy="50"
                r={RING_RADIUS}
                fill="none"
                stroke="var(--color-accent-primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 120ms linear' }}
              />
              {/* A short orbiting tick, separate from the progress fill, so the ring
                  reads as actively working even while the fill itself moves slowly. */}
              <motion.g
                style={{ transformOrigin: '50px 50px' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              >
                <circle cx="50" cy={50 - RING_RADIUS} r="2.4" fill="var(--color-accent-primary)" />
              </motion.g>
            </svg>

            {/* Center glyph — a diamond that draws itself on once, then idles with a
                slow counter-rotation for a sense of a system coming online. */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 100 100" className="h-10 w-10 sm:h-11 sm:w-11">
                <motion.path
                  d="M50 22 L78 50 L50 78 L22 50 Z"
                  fill="none"
                  stroke="var(--color-text-primary)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: motionEase, delay: 0.15 }}
                />
              </svg>
            </motion.div>

            {/* Percentage readout, dead center, unaffected by the glyph's rotation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-[var(--font-mono)] text-xs tabular-nums text-[var(--color-text-primary)]/70">
                {percent}%
              </span>
            </div>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-[var(--color-accent-primary)]"
          >
            Initializing System
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
