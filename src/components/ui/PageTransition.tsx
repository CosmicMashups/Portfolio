import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const reduce = usePrefersReducedMotion()
  const routeName = location.pathname === '/' ? 'HOME' : location.pathname.split('/')[1]?.toUpperCase() ?? 'PAGE'

  if (reduce) return <>{children}</>

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div
          className="fixed inset-0 z-[9996] flex items-center justify-center bg-[var(--color-bg-base)]"
          initial={{ y: '100%' }}
          animate={{ y: '-100%' }}
          exit={{ y: '0%' }}
          transition={{ duration: 0.4, ease: [0.87, 0, 0.13, 1], delay: 0.1 }}
        >
          <span
            className="font-[var(--font-display)] text-[var(--color-text-muted)]"
            style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', opacity: 0.1 }}
          >
            {routeName}
          </span>
        </motion.div>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
