import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ThemeAccentContext } from '@/app/providers/themeAccentContext'
import type { ProjectId } from '@/config/project.types'
import { cssVarsForProject } from '@/lib/designDoc/buildProjectThemes'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

const globalAccentVars = {
  '--accent-primary': '#ff6b1a',
  '--accent-secondary': '#ffa64d',
  '--chart-a': '#ff6b1a',
  '--chart-b': '#ffa64d',
  '--chart-c': '#f5f5f0',
  '--chart-d': '#9a9a94',
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
