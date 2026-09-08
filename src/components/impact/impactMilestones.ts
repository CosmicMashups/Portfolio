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
    projectId: 'sell_io',
    year: 'Aug–Sep 2026',
    impact:
      'Stock-aware self-service kiosk & POS architecture: append-only inventory ledger, 5-minute atomic TTL reservations, and edge-first SQLite offline sync for high-volume apparel retail.',
    metrics: [
      { label: 'Sync latency', value: '<100ms SignalR' },
      { label: 'Reservation lock', value: '5-min TTL' },
      { label: 'Architecture', value: 'Edge-first .NET 8' },
    ],
  },
  {
    projectId: 'schedul_io',
    year: 'Aug–Sep 2026',
    impact: 'Multi-tenant clinic access platform: three role-scoped SPAs over one Spring Boot API, with tenant isolation enforced at the persistence layer.',
    metrics: [
      { label: 'Build milestones', value: '9' },
      { label: 'Frontends', value: '3 role-scoped SPAs' },
    ],
  },
  {
    projectId: 'expens_io_business',
    year: 'May–Aug 2026',
    impact: 'Enterprise procurement ERP replacing four Excel workbooks — Row Level Security as the real authorization boundary, not just UI gating.',
    metrics: [
      { label: 'Route screens', value: '37' },
      { label: 'User roles', value: '12' },
    ],
  },
  {
    projectId: 'mashhub',
    year: '2026',
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
  {
    projectId: 'pocketpt',
    year: '2025',
    impact: 'Cross-platform rehab tooling with on-device inference and evaluation surfaces tied to clinical UX.',
    metrics: [
      { label: 'Pose guidance', value: 'On-device TFLite' },
      { label: 'Pose accuracy', value: '85.4% (val)' },
    ],
  },
  {
    projectId: 'arimarket',
    year: '2024',
    impact: 'Commodity forecasting dashboard with uncertainty-forward metrics and regime-aware storytelling.',
    metrics: [
      { label: 'Best MAE (rice)', value: '0.388' },
      { label: 'Coverage', value: '20+ commodities' },
    ],
  },
  {
    projectId: 'registrar',
    year: '2019',
    impact: 'Shipped a dual-portal registrar system with parameterized SQL and discrete status scripts — thesis-defended.',
    metrics: [
      { label: 'Document pipelines', value: '7 types' },
      { label: 'Portals', value: '2 roles' },
    ],
  },
]
