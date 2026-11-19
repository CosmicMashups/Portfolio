export interface NavSection {
  id: string
  label: string
  short: string
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Origin', short: '01' },
  { id: 'system-overview', label: 'How I Build', short: '02' },
  { id: 'projects', label: "What I've Built", short: '03' },
  { id: 'impact', label: 'Impact', short: '04' },
  { id: 'skills', label: 'Skills', short: '05' },
  { id: 'creative', label: 'Beyond Code', short: '06' },
  { id: 'credibility', label: 'Proof', short: '07' },
]
