import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ThemeAccentContext } from '@/app/providers/themeAccentContext'
import type { ProjectId } from '@/config/project.types'
import { cssVarsForProject } from '@/lib/designDoc/buildProjectThemes'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

const globalAccentVars = {
  '--accent-primary': '#22c55e',
  '--accent-secondary': '#38bdf8',
  '--surface-tint': 'rgba(17, 24, 39, 0.92)',
  '--chart-a': '#10b981',
  '--chart-b': '#f43f5e',
  '--chart-c': '#3b82f6',
  '--chart-d': '#f59e0b',
} as const

export function ThemeAccentProvider({ children }: { children: ReactNode }) {
  const [activeProjectId, setActiveProjectId] = useState<ProjectId | null>(null)
  const reduceMotion = usePrefersReducedMotion()

  const value = useMemo(
    () => ({ activeProjectId, setActiveProjectId }),
    [activeProjectId],
  )

  const animateVars = useMemo(() => {
    if (!activeProjectId) return { ...globalAccentVars }
    return { ...globalAccentVars, ...cssVarsForProject(activeProjectId) }
  }, [activeProjectId])

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <ThemeAccentContext.Provider value={value}>
      <motion.div
        className="min-h-svh"
        initial={false}
        animate={animateVars as Record<string, string | number>}
        transition={transition}
      >
        {children}
      </motion.div>
    </ThemeAccentContext.Provider>
  )
}
