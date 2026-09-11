export interface LifecycleStep {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
  deliverables: string[]
  exemplar: string
  category: 'strategy' | 'architecture' | 'execution' | 'reliability'
}

export const ENGINEERING_LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    id: 'requirements',
    number: '01',
    title: 'Requirements',
    subtitle: 'Understand the problem and users',
    description:
      'Map user needs and operational realities into clear problem boundaries before writing a line of code. Frame success through measurable user outcomes.',
    deliverables: ['User personas & journey maps', 'Core problem statement', 'Quantitative success criteria'],
    exemplar: 'AriMarket: Commodity price volatility scoped to farmer mobile access and low-latency prediction demands.',
    category: 'strategy',
  },
  {
    id: 'analysis',
    number: '02',
    title: 'Analysis',
    subtitle: 'Determine functional and non-functional requirements',
    description:
      'Dissect the feature space: define precise data flows, operational constraints, latency budgets, and security parameters.',
    deliverables: ['Functional specifications', 'Non-functional constraints (SLA, latency)', 'Security & session boundaries'],
    exemplar: 'PocketPT: 100% offline physical therapy inference requirement dictated on-device neural model constraints.',
    category: 'strategy',
  },
  {
    id: 'architecture',
    number: '03',
    title: 'Architecture',
    subtitle: 'Choose frontend, backend, database, API, auth, deployment',
    description:
      'Select technical stacks based on real-world constraints rather than hype. Formulate system contracts, API topologies, and state machines.',
    deliverables: ['Stack trade-off matrix', 'API specifications', 'Authentication scheme', 'Deployment topologies'],
    exemplar: 'Expens.io Business: Vite + React frontend coupled with Supabase PostgreSQL and Row-Level Security.',
    category: 'architecture',
  },
  {
    id: 'database-design',
    number: '04',
    title: 'Database Design',
    subtitle: 'Tables, relationships, constraints, indexes',
    description:
      'Structure relational entity diagrams, foreign key cascades, and access patterns. Enforce database-level data integrity and query performance.',
    deliverables: ['Normalized schema diagram', 'Foreign key constraints', 'B-Tree & composite indexing', 'Seed migrations'],
    exemplar: 'School Registrar: Multi-role relational structure preventing scheduling conflicts and grade tampering.',
    category: 'architecture',
  },
  {
    id: 'implementation',
    number: '05',
    title: 'Implementation',
    subtitle: 'Build incrementally',
    description:
      'Construct modular, typed codebases with high cohesion. Deliver vertical slices through atomic commits, verifying baseline functionality early.',
    deliverables: ['Typed domain models', 'Component design tokens', 'Decoupled services', 'Atomic commit history'],
    exemplar: 'MashHub: Strict TypeScript types for audio waveforms and rule-based mashup recommendation engine.',
    category: 'execution',
  },
  {
    id: 'testing',
    number: '06',
    title: 'Testing',
    subtitle: 'Unit → Integration → E2E → Acceptance',
    description:
      'Implement multi-tiered automated testing. Guard against edge-case regression and verify mission-critical business math.',
    deliverables: ['Unit test suites', 'API integration tests', 'End-to-end critical paths', 'User acceptance verification'],
    exemplar: 'AriMarket & PocketPT: Regression tests validating ML model inference error triplets (MAE/MSE/RMSE).',
    category: 'execution',
  },
  {
    id: 'code-review',
    number: '07',
    title: 'Code Review',
    subtitle: 'Review quality, security, maintainability',
    description:
      'Audit code for security vulnerabilities, memory hygiene, readability, and long-term architectural adherence.',
    deliverables: ['Static code analysis', 'Security vulnerability audit', 'Performance profiling', 'Documentation review'],
    exemplar: 'All projects: Automated linting, typed contract audits, and zero-leak memory profiling.',
    category: 'execution',
  },
  {
    id: 'deployment',
    number: '08',
    title: 'Deployment',
    subtitle: 'Development → Staging → Production',
    description:
      'Orchestrate repeatable build pipelines across environments. Establish automated artifact generation, CDN caching, and rollbacks.',
    deliverables: ['CI/CD automation pipelines', 'Environment isolation', 'Production build optimization', 'Rollback runbooks'],
    exemplar: 'Vite production optimization with split vendor chunks and automated GitHub Pages artifact deployment.',
    category: 'reliability',
  },
  {
    id: 'monitoring',
    number: '09',
    title: 'Monitoring',
    subtitle: 'Logs, errors, performance, user feedback',
    description:
      'Instrument applications for operational transparency. Track client-side error telemetry, performance metrics, and user behavior.',
    deliverables: ['Structured logging', 'Error capture telemetry', 'Web Vitals & FPS metrics', 'User feedback loops'],
    exemplar: 'Real-time telemetry tracking frame render budgets and inference latencies across mobile chipsets.',
    category: 'reliability',
  },
  {
    id: 'maintenance',
    number: '10',
    title: 'Maintenance',
    subtitle: 'Bug fixes, improvements, refactoring',
    description:
      'Sustain and polish the system continuously. Triage bug reports, upgrade upstream dependencies, and refactor bottlenecks as requirements grow.',
    deliverables: ['Hotfix releases', 'Dependency upgrades', 'Bottleneck refactoring', 'Technical debt resolution'],
    exemplar: 'Expens.io: Continual UI polish, token tightening, and database index tuning based on query logs.',
    category: 'reliability',
  },
]
