import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

interface DrawUnderlineProps {
  children: ReactNode
  color?: string
  delay?: number
}

export function DrawUnderline({ children, color = 'var(--color-accent-primary)', delay = 0 }: DrawUnderlineProps) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const reduce = usePrefersReducedMotion()

  return (
    <span ref={ref} className="relative inline-block">
      {children}
      <motion.span
        className="absolute left-0 bottom-[-2px] h-[2px] origin-left"
        style={{ background: color }}
        initial={reduce ? { scaleX: 1, width: '100%' } : { scaleX: 0, width: '0%' }}
        animate={inView ? { scaleX: 1, width: '100%' } : undefined}
        transition={{ duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  )
}
