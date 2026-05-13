import { createContext } from 'react'
import type { ProjectId } from '@/config/project.types'

export interface ThemeAccentContextValue {
  activeProjectId: ProjectId | null
  setActiveProjectId: (id: ProjectId | null) => void
}

export const ThemeAccentContext = createContext<ThemeAccentContextValue | null>(null)
