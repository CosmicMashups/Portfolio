export interface NavSection {
  id: string
  label: string
  short: string
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Origin', short: '01' },
  { id: 'manifesto', label: 'Manifesto', short: '02' },
  { id: 'system-overview', label: 'How I Build', short: '03' },
  { id: 'projects', label: "What I've Built", short: '04' },
  { id: 'impact', label: 'Impact', short: '05' },
  { id: 'skills', label: 'Skills', short: '06' },
  { id: 'creative', label: 'Beyond Code', short: '07' },
  { id: 'credibility', label: 'Proof', short: '08' },
]
