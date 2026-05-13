import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

const ROLES = [
  'AI/ML Engineer',
  'Full-Stack Builder',
  'Problem Solver',
  'Thesis Researcher',
] as const

export function RoleRotator() {
  const reduce = usePrefersReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduce) return
    const t = window.setInterval(() => setI((n) => (n + 1) % ROLES.length), 3200)
    return () => clearInterval(t)
  }, [reduce])

  const label = ROLES[reduce ? 0 : i]!

  return (
    <div className="min-h-[2.5rem] text-lg text-[var(--accent-primary)] md:text-xl">
      {reduce ? (
        <span className="font-medium">{label}</span>
      ) : (
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="block font-medium"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  )
}
