import { designDocRaw } from './importDocs'
import { mergeTheme, themeToCssVars, type ThemeAccentBundle } from './mergeTheme'
import { parseDesignDoc } from './parseDesignDoc'
import type { ProjectId } from '@/config/project.types'
import type { ThemeOverrides } from './mergeTheme'
import { PROJECTS } from '@/config/projects.registry'

const registryOverrides: Partial<Record<ProjectId, ThemeOverrides>> = {
  arimarket: {
    accentPrimary: '#10B981',
    accentSecondary: '#F43F5E',
    chartA: '#10B981',
    chartB: '#F43F5E',
    chartC: '#3B82F6',
    chartD: '#F59E0B',
    density: 'high',
    radius: 'sm',
  },
  pocketpt: {
    accentPrimary: '#8B2E2E',
    accentSecondary: '#C24A4A',
    chartA: '#10B981',
    chartB: '#F59E0B',
    chartC: '#EF4444',
    chartD: '#8B2E2E',
    density: 'low',
    radius: 'lg',
  },
  mashhub: {
    accentPrimary: '#4da6ff',
    accentSecondary: '#8b5cf6',
    chartA: '#4da6ff',
    chartB: '#06ffa5',
    chartC: '#6366f1',
    chartD: '#f59e0b',
    density: 'high',
    radius: 'sm',
  },
  expens_io: {
    accentPrimary: '#0099FF',
    accentSecondary: '#00E0D3',
    chartA: '#0099FF',
    chartB: '#00E0D3',
    chartC: '#22C55E',
    chartD: '#EF4444',
    density: 'medium',
    radius: 'md',
  },
  registrar: {
    accentPrimary: '#2ECC71',
    accentSecondary: '#2b7582',
    surfaceTint: 'color-mix(in oklab, rgba(69, 97, 102, 0.35) 40%, var(--global-surface) 60%)',
    chartA: '#2ECC71',
    chartB: '#2b7582',
    chartC: '#456166',
    chartD: '#FA8072',
    density: 'medium',
    radius: 'md',
  },
  // No dedicated design-system doc yet — overrides stand in directly.
  expens_io_business: {
    accentPrimary: '#0099FF',
    accentSecondary: '#00E0D3',
    chartA: '#0099FF',
    chartB: '#00E0D3',
    chartC: '#22C55E',
    chartD: '#EF4444',
    density: 'high',
    radius: 'md',
  },
  schedul_io: {
    accentPrimary: '#2b7582',
    accentSecondary: '#698e79',
    chartA: '#2b7582',
    chartB: '#698e79',
    chartC: '#9f995b',
    chartD: '#c24a4a',
    density: 'medium',
    radius: 'md',
  },
  sell_io: {
    accentPrimary: '#EC0000',
    accentSecondary: '#1D2434',
    chartA: '#EC0000',
    chartB: '#1D2434',
    chartC: '#2D3E32',
    chartD: '#F59E0B',
    density: 'high',
    radius: 'sm',
  },
}

export function buildThemes(): Record<ProjectId, ThemeAccentBundle> {
  const ids = PROJECTS.map((p) => p.id)
  const out = {} as Record<ProjectId, ThemeAccentBundle>
  for (const id of ids) {
    const raw = designDocRaw[id as keyof typeof designDocRaw] ?? ''
    const parsed = parseDesignDoc(raw)
    out[id] = mergeTheme(parsed, registryOverrides[id])
  }
  return out
}

export const projectThemes = buildThemes()

export function cssVarsForProject(id: ProjectId): Record<string, string> {
  return themeToCssVars(projectThemes[id])
}
