const HEX_RE = /#([0-9A-Fa-f]{6})\b/g

export type DensityHint = 'high' | 'low' | 'medium'
export type RadiusHint = 'sm' | 'md' | 'lg'

export interface ParsedDesignDoc {
  hexColors: string[]
  accentCandidates: string[]
  keywords: string[]
  densityHint: DensityHint
  radiusHint: RadiusHint
}

function uniq<T>(xs: T[]): T[] {
  return [...new Set(xs)]
}

function inferDensityAndRadius(text: string): {
  densityHint: DensityHint
  radiusHint: RadiusHint
} {
  const t = text.toLowerCase()
  let densityScore = 0
  let softScore = 0
  if (/dense|density|dashboard|multi-panel|widget|grid|strict|tighter/.test(t))
    densityScore += 2
  if (/clinical|generous|spacious|empathy|soft|rounded|inset|comfortable|padding/.test(t))
    softScore += 2
  if (/mobile-first|stacked|single-column/.test(t)) softScore += 1
  if (densityScore >= 2 && softScore < 2)
    return { densityHint: 'high', radiusHint: 'sm' }
  if (softScore >= 2 && densityScore < 2)
    return { densityHint: 'low', radiusHint: 'lg' }
  return { densityHint: 'medium', radiusHint: 'md' }
}

export function parseDesignDoc(markdown: string): ParsedDesignDoc {
  const hexColors = uniq(
    [...markdown.matchAll(HEX_RE)].map((m) => `#${m[1]!.toUpperCase()}`),
  )
  const keywords = uniq(
    markdown
      .split(/\s+/)
      .filter((w) => w.length > 6 && /[a-z]/i.test(w))
      .slice(0, 80),
  ).slice(0, 24)

  const accentCandidates = hexColors.filter((h) => {
    const section = markdown.toLowerCase()
    const idx = section.indexOf(h.toLowerCase())
    if (idx === -1) return true
    const window = markdown.slice(Math.max(0, idx - 120), idx + 120).toLowerCase()
    return (
      /accent|primary|brand|button|emphasis/.test(window) ||
      hexColors.indexOf(h) < 4
    )
  })

  const { densityHint, radiusHint } = inferDensityAndRadius(markdown)

  return {
    hexColors,
    accentCandidates: accentCandidates.length ? accentCandidates : hexColors.slice(0, 3),
    keywords,
    densityHint,
    radiusHint,
  }
}
