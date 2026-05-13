import { type RefObject, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import readingTime from 'reading-time/lib/reading-time'

interface ReadingProgressProps {
  content: string
  postRef: RefObject<HTMLElement>
}

export function ReadingProgress({ content, postRef }: ReadingProgressProps) {
  const stats = useMemo(() => readingTime(content), [content])
  const { scrollYProgress } = useScroll({ target: postRef, offset: ['start start', 'end end'] })
  const circumference = 2 * Math.PI * 16
  const dashOffset = useTransform(scrollYProgress, [0, 1], [circumference, 0])

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-3 py-2">
      <span className="text-xs text-[var(--color-text-secondary)]">{Math.max(1, Math.ceil(stats.minutes))} min read</span>
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-border-default)" strokeWidth="2" />
        <motion.circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="var(--color-accent-primary)"
          strokeWidth="2"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
          transform="rotate(-90 18 18)"
        />
      </svg>
    </div>
  )
}
