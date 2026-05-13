export interface NavSection {
  id: string
  label: string
  short: string
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Entry', short: '01' },
  { id: 'system-overview', label: 'System Overview', short: '02' },
  { id: 'projects', label: 'Architecture', short: '03' },
  { id: 'impact', label: 'Impact', short: '04' },
  { id: 'skills', label: 'Skills Graph', short: '05' },
  { id: 'creative', label: 'Creative', short: '06' },
  { id: 'credibility', label: 'Credibility', short: '07' },
]
