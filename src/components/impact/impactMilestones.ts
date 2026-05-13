import type { ProjectId } from '@/config/project.types'

export interface ImpactMilestone {
  projectId: ProjectId
  year: string
  impact: string
  metrics: { label: string; value: string }[]
}

/** Curated milestones; titles align with registry entries. */
export const IMPACT_MILESTONES: ImpactMilestone[] = [
  {
    projectId: 'registrar',
    year: '2015',
    impact: 'Shipped a dual-portal registrar system with parameterized SQL and discrete status scripts — thesis-defended.',
    metrics: [
      { label: 'Document pipelines', value: '7 types' },
      { label: 'Portals', value: '2 roles' },
    ],
  },
  {
    projectId: 'pocketpt',
    year: '2024',
    impact: 'Cross-platform rehab tooling with on-device inference and evaluation surfaces tied to clinical UX.',
    metrics: [
      { label: 'Pose guidance', value: 'On-device TFLite' },
      { label: 'Safety signal', value: 'Severe pain recall 100%' },
    ],
  },
  {
    projectId: 'arimarket',
    year: '2025',
    impact: 'Commodity forecasting dashboard with uncertainty-forward metrics and regime-aware storytelling.',
    metrics: [
      { label: 'Best MAE (rice)', value: '0.388' },
      { label: 'Coverage', value: '20+ commodities' },
    ],
  },
  {
    projectId: 'mashhub',
    year: '2025',
    impact: 'Creative metadata workspace: fuzzy search, harmonic graphs, and honest weight controls for DJs.',
    metrics: [
      { label: 'Workflow', value: 'Analysis + sequencing' },
      { label: 'Trust pattern', value: 'Exposed rule weights' },
    ],
  },
  {
    projectId: 'expens_io',
    year: '2025',
    impact: 'Cross-platform finance tracking with local-first trust: insights never replace raw ledger truth.',
    metrics: [
      { label: 'Surfaces', value: 'Flutter multi-target' },
      { label: 'Sync', value: 'Firebase-ready' },
    ],
  },
]
