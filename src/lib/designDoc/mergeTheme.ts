import type { DensityHint, ParsedDesignDoc, RadiusHint } from './parseDesignDoc'

export interface ThemeAccentBundle {
  accentPrimary: string
  accentSecondary: string
  surfaceTint: string
  chartA: string
  chartB: string
  chartC: string
  chartD: string
  density: DensityHint
  radius: RadiusHint
}

export interface ThemeOverrides {
  accentPrimary?: string
  accentSecondary?: string
  surfaceTint?: string
  chartA?: string
  chartB?: string
  chartC?: string
  chartD?: string
  density?: DensityHint
  radius?: RadiusHint
}

function pickAccent(parsed: ParsedDesignDoc, fallback: string): string {
  return parsed.accentCandidates[0] ?? parsed.hexColors[0] ?? fallback
}

function pickSecondary(parsed: ParsedDesignDoc, primary: string): string {
  const rest = parsed.hexColors.filter((c) => c !== primary)
  return rest[0] ?? '#38bdf8'
}

function rgbaFromHex(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const bigint = parseInt(h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function mergeTheme(
  parsed: ParsedDesignDoc,
  overrides: ThemeOverrides = {},
): ThemeAccentBundle {
  const primary = overrides.accentPrimary ?? pickAccent(parsed, '#22c55e')
  const secondary =
    overrides.accentSecondary ?? pickSecondary(parsed, primary)

  const chartA = overrides.chartA ?? primary
  const chartB = overrides.chartB ?? secondary
  const chartC =
    overrides.chartC ??
    (parsed.hexColors.find((c) => c !== primary && c !== secondary) ?? '#3b82f6')
  const chartD =
    overrides.chartD ??
    (parsed.hexColors.find((c) => ![primary, secondary, chartC].includes(c)) ??
      '#f59e0b')

  const surfaceTint =
    overrides.surfaceTint ??
    `color-mix(in oklab, ${rgbaFromHex(primary, 0.12)} 40%, var(--global-surface) 60%)`

  return {
    accentPrimary: primary,
    accentSecondary: secondary,
    surfaceTint,
    chartA,
    chartB,
    chartC,
    chartD,
    density: overrides.density ?? parsed.densityHint,
    radius: overrides.radius ?? parsed.radiusHint,
  }
}

export function themeToCssVars(theme: ThemeAccentBundle): Record<string, string> {
  const radius =
    theme.radius === 'sm'
      ? '0.375rem'
      : theme.radius === 'lg'
        ? '0.75rem'
        : '0.5rem'
  return {
    '--accent-primary': theme.accentPrimary,
    '--accent-secondary': theme.accentSecondary,
    '--surface-tint': theme.surfaceTint,
    '--chart-a': theme.chartA,
    '--chart-b': theme.chartB,
    '--chart-c': theme.chartC,
    '--chart-d': theme.chartD,
    '--radius-project': radius,
    '--density-gap':
      theme.density === 'high' ? '0.5rem' : theme.density === 'low' ? '1.25rem' : '0.875rem',
  }
}
