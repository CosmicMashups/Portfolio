import type { ProjectId, VizKind } from './project.types'

export type { ProjectId, VizKind }

export interface StackItem {
  name: string
  reason: string
}

export interface EngineeringDecision {
  title: string
  detail: string
}

export interface ProjectEntry {
  id: ProjectId
  slug: string
  title: string
  tagline: string
  personalHook: string
  repoUrl?: string
  complexity: 'high' | 'medium' | 'low'
  problem: string
  solution: string
  challenge: string
  outcome: string
  lessonsLearned: string[]
  techDeep: {
    architecture: string
    keyDecisions: string[]
    tradeoffs: string
  }
  decisions: EngineeringDecision[]
  architectureSummary: string
  technicalNotes?: string
  stack: StackItem[]
  skillIds: string[]
  viz: VizKind
  metrics?: {
    label: string
    value: number
    suffix: string
    description: string
  }[]
}

export const PROJECTS: ProjectEntry[] = [
  {
    id: 'arimarket',
    slug: 'arimarket',
    title: 'AriMarket',
    tagline: 'AI-driven price prediction and market analysis',
    personalHook: 'Built because prices kept rising and I wanted a system to watch them for me.',
    repoUrl: 'https://github.com/CosmicMashups/AriMarket',
    complexity: 'high',
    problem:
      'Traders need fast, legible signals without drowning in raw series — uncertainty and regime shifts must be visible, not decorative.',
    solution:
      'A desktop-first dashboard that pairs streaming context with prediction intervals and commodity-scoped views so operators can compare error profiles across assets.',
    challenge: 'Keeping model uncertainty legible to users who make pricing calls under pressure.',
    outcome: 'Created a dashboard flow that makes confidence ranges visible before users commit to decisions.',
    lessonsLearned: [
      'Forecast confidence matters more than a single headline prediction.',
      'Users trust systems that reveal uncertainty, not hide it.',
    ],
    techDeep: {
      architecture: 'Ingestion -> feature store -> model service -> dashboard rendering.',
      keyDecisions: ['Expose confidence intervals early', 'Keep error metrics side-by-side for context'],
      tradeoffs: 'Higher UI density, but stronger decision confidence for operators.',
    },
    decisions: [
      {
        title: 'Metric triplet as the backbone',
        detail:
          'MAE, MSE, and RMSE are shown together so no single error shape overfits the narrative; the UI keeps numerics monospaced and aligned.',
      },
      {
        title: 'Semantic green/red channel',
        detail:
          'Bullish/bearish accents follow financial semantics from the product system rather than generic success/error colors.',
      },
    ],
    architectureSummary:
      'Ingestion → feature store → model service → presentation layer with bounded chart widgets and shared filter controls.',
    technicalNotes:
      'Latency-sensitive paths isolate re-renders: tickers and charts subscribe to narrow slices; heavy analytics stay behind Technical View.',
    stack: [
      { name: 'React + TypeScript', reason: 'Typed UI contracts for financial widgets and safer refactors.' },
      { name: 'Tailwind', reason: 'Token-driven density and strict grid alignment for dashboard modules.' },
      { name: 'Recharts', reason: 'Composable charts that stay consistent with portfolio-wide ChartShell styling.' },
    ],
    skillIds: ['ts', 'react', 'python', 'ml', 'tailwind', 'vite'],
    viz: 'arimarket',
  },
  {
    id: 'pocketpt',
    slug: 'pocketpt',
    title: 'PocketPT',
    tagline: 'AI-guided rehabilitation with pose-aware feedback',
    personalHook: "Built so a friend's injury had somewhere better to go than a Google search.",
    repoUrl: 'https://github.com/CosmicMashups/PocketPT',
    complexity: 'high',
    problem:
      'Patients need trustworthy guidance at home; the interface must reduce cognitive load while surfacing safety signals from ML outputs.',
    solution:
      'A cross-platform flow that foregrounds assessments, encodes pain and form signals with calm maroon accents, and separates “today” from longitudinal history.',
    challenge: 'Delivering safe guidance with limited therapist access and uneven connectivity.',
    outcome: 'Shipped a thesis-grade rehab experience that prioritizes risk clarity and at-home usability.',
    lessonsLearned: [
      'The CNN-LSTM hybrid underperformed a standalone CNN in our data regime.',
      'Clinical UX must reduce anxiety first, then optimize speed.',
    ],
    techDeep: {
      architecture: 'Mobile app + inference pipeline + sync logs + clinician-facing reports.',
      keyDecisions: ['Optimize for offline operation', 'Separate urgent feedback from historical trends'],
      tradeoffs: 'Slightly heavier local compute for better responsiveness and trust.',
    },
    decisions: [
      {
        title: 'Clinical spacing over density',
        detail:
          'Generous padding and larger tap targets trade information density for motor accessibility and reduced anxiety during exercise.',
      },
      {
        title: 'Gradient semantics for risk',
        detail:
          'Pain and confusion visuals reuse green→amber→red encodings consistently so users never relearn metaphors per screen.',
      },
    ],
    architectureSummary:
      'On-device inference where possible → synchronized logs → clinician-friendly summaries; the portfolio view mirrors the app’s separation of urgent vs historical.',
    technicalNotes:
      'Classification reports and matrices in Technical View map directly to model evaluation exports for reproducibility.',
    stack: [
      { name: 'Flutter / Dart', reason: 'Single codebase for mobile-first rehab flows with strong animation support.' },
      { name: 'TensorFlow Lite / on-device ML', reason: 'Low-latency pose estimation with offline-first constraints.' },
      { name: 'SQLite / local persistence', reason: 'Resilient journaling when connectivity is intermittent.' },
    ],
    skillIds: ['flutter', 'dart', 'python', 'cv', 'sqlite'],
    viz: 'pocketpt',
    metrics: [
      { label: 'Pain Recognition Accuracy', value: 99.46, suffix: '%', description: 'High-confidence classification' },
      { label: 'Pose Estimation Accuracy', value: 85.4, suffix: '%', description: 'Reliable form guidance' },
      { label: 'Severe Pain Recall', value: 100, suffix: '%', description: 'Zero severe misses in tests' },
      { label: 'mAP@0.5', value: 87.8, suffix: '%', description: 'Detection quality across categories' },
    ],
  },
  {
    id: 'mashhub',
    slug: 'mashhub',
    title: 'MashHub',
    tagline: 'Harmonic intelligence for mashup and mix workflows',
    personalHook: 'Built because my Excel mashup database was an embarrassment to the system architect in me.',
    repoUrl: 'https://github.com/CosmicMashups/MashHub',
    complexity: 'high',
    problem:
      'DJs and producers navigate high-cardinality metadata (key, BPM, sections) — the UI must feel fast and structured, not like a spreadsheet pasted into the browser.',
    solution:
      'A dense but legible workspace: fuzzy search, Kanban sections, and graphs that expose BPM flow and harmonic distance without losing musical context.',
    challenge: 'Managing high-cardinality metadata without turning music work into spreadsheet work.',
    outcome: 'Created a workflow where analysis and creative sequencing happen in the same product surface.',
    lessonsLearned: [
      'Transparency in matching rules matters more than flashy recommendations.',
      'Creative users accept complexity when controls stay honest and clear.',
    ],
    techDeep: {
      architecture: 'Ingest + analysis workers + weighted matching engine + visual workspace.',
      keyDecisions: ['Expose rule weights directly', 'Keep graph views tied to playlist context'],
      tradeoffs: 'More controls can feel dense, but expert users gain trust and precision.',
    },
    decisions: [
      {
        title: 'Vibrant accents with disciplined surfaces',
        detail:
          'Bright music-specific colors are scoped to badges and CTAs while surfaces stay deep-navy consistent for focus.',
      },
      {
        title: 'Rule weights as first-class controls',
        detail:
          'Matching rules expose tunable weights so users see the system behind the suggestion, not a black box.',
      },
    ],
    architectureSummary:
      'Library ingest → analysis workers → project graph (sections/sets) → UI with optimistic updates on reorder and match.',
    technicalNotes:
      'Technical View exposes fuzzy overlap curves for BPM/key membership alongside the weight sliders.',
    stack: [
      { name: 'React + Vite', reason: 'Fast iteration for interactive music tooling with code-split panels.' },
      { name: 'PWA shell', reason: 'Offline-adjacent workflows for booth/studio environments.' },
      { name: 'Recharts', reason: 'BPM/key graph primitives reused in portfolio visualizations.' },
    ],
    skillIds: ['ts', 'react', 'vite', 'python', 'tailwind'],
    viz: 'mashhub',
  },
  {
    id: 'expens_io',
    slug: 'expens-io',
    title: 'Expens.io',
    tagline: 'Cross-platform finance tracking with AI-assisted insights',
    personalHook: 'Built in a condo, broke, needing more than the Notes app.',
    complexity: 'medium',
    problem:
      'Personal and shared ledgers need clarity under heavy lists; gamification and AI must not obscure cash truth.',
    solution:
      'A modular dashboard that stacks summary → insight charts → granular transactions with cyan/teal accents that stay distinct from semantic reds for danger states.',
    challenge: 'Balancing insight automation with the need for straightforward cash-truth visibility.',
    outcome: 'Shipped a finance workflow that keeps summaries clear without hiding raw transaction context.',
    lessonsLearned: [
      'Gamification only helps when it reinforces, not obscures, financial reality.',
      'People trust expense tools that show math first and insights second.',
    ],
    techDeep: {
      architecture: 'Cross-platform client + normalized ledger + derived insight layers.',
      keyDecisions: ['Dashboard-first hierarchy', 'AI as assistive layer, not mandatory path'],
      tradeoffs: 'Less flashy onboarding, better long-term user trust.',
    },
    decisions: [
      {
        title: 'Dashboard-first hierarchy',
        detail:
          'Wallet summary anchors the page; insights are opt-in depth rather than fullscreen noise.',
      },
      {
        title: 'Poppins + Roboto split',
        detail:
          'Friendly headers with highly legible numeric body text mirrors the live app while staying inside portfolio typography constraints.',
      },
    ],
    architectureSummary:
      'Local models for entry speed, cloud sync for collaboration, AI insights as derived layers over normalized transactions.',
    stack: [
      { name: 'Flutter', reason: 'One UX language across mobile/desktop with cohesive charting widgets.' },
      { name: 'Firebase / auth-ready backend', reason: 'Shared expenses require identity and rules without boilerplate.' },
    ],
    skillIds: ['flutter', 'dart', 'firebase'],
    viz: 'expens_dashboard',
  },
  {
    id: 'registrar',
    slug: 'registrar-system',
    title: 'IIST Registrar System',
    tagline:
      'A production-ready school registrar portal built at age 15 — before frameworks were vocabulary worth naming.',
    personalHook:
      'The IIST High School Registrar Online Document Requisition System digitized the manual document workflow for a real registrar office. Built as a 9th-grade thesis using PHP, MySQL, and Bootstrap, it ships dual portals, a seven-document-type pipeline, four lifecycle statuses, and defense-in-depth input handling — all written from first principles.',
    complexity: 'medium',
    problem:
      'Students and parents traveled to campus for paper forms, paid at a separate cashier, and returned days or weeks later with no visibility into whether a request had moved. Staff lacked a single queue spanning document categories.',
    solution:
      'A dual-portal web app: clients submit and track requests online; administrators work from a unified table dashboard with modular /Status scripts for each transition. PHP sessions enforce routing-level separation between portals; MySQLi prepared statements back every write.',
    challenge:
      'Digitizing a trust-sensitive office workflow without borrowing a framework — the stack had to deploy on school hardware and stay legible to non-technical staff.',
    outcome:
      'Shipped a thesis-defended system that mirrored registrar desk habits while replacing travel, opaque waits, and fragmented payment steps with a single auditable pipeline.',
    lessonsLearned: [
      'Security behaves like architecture when parameterized queries and sanitization are non-negotiable constraints, not optional layers.',
      'File-level separation for each status transition beats a monolithic handler: the state machine stays obvious in the directory tree.',
      'On constrained hosting, boring stacks that deploy cleanly beat impressive stacks that cannot survive the registrar desk.',
    ],
    techDeep: {
      architecture:
        'Procedural PHP pages + dedicated per-document INSERT handlers + admin request.php aggregate SELECTs + /Status transition scripts + session-gated routing.',
      keyDecisions: [
        'Dedicated tables per document type instead of one sparse mega-table',
        'GET-parameter-driven status scripts for deterministic, reviewable transitions',
        'Bootstrap 3 tables as the admin mental model',
      ],
      tradeoffs:
        'Tight HTML/PHP coupling and minimal abstraction layers traded long-term refactor ergonomics for deployment certainty on XAMPP.',
    },
    decisions: [
      {
        title: 'Session-enforced dual portals',
        detail:
          'Successful logins land in different dashboard roots for clients vs administrators so the navigation tree itself cannot be mistaken across roles.',
      },
      {
        title: 'Prepared statements without an ORM',
        detail:
          'Every INSERT/UPDATE path binds parameters through MySQLi so ad-hoc reporting in PHP never tempts string-built SQL.',
      },
    ],
    architectureSummary:
      'Browser → Apache/PHP → MySQL (per-type tables) → HTML/Bootstrap responses; admin status changes hop through discrete /Status endpoints keyed by record id.',
    technicalNotes:
      'Portfolio visualization simulates request.php filtering and status cycling; the production app used FontAwesome 5 and Bootstrap 3 alert semantics for operational cues.',
    stack: [
      {
        name: 'PHP 7.2',
        reason: 'Native sessions and shared-hosting compatibility for a school-managed XAMPP deployment.',
      },
      {
        name: 'MySQL (MariaDB 10.1)',
        reason: 'Relational storage with one table per document pipeline to avoid sparse unified schemas.',
      },
      {
        name: 'Bootstrap 3.3.7',
        reason: 'Table-first layouts and alert patterns that matched registrar staff expectations.',
      },
      {
        name: 'JavaScript (ES5-era DOM)',
        reason: 'Light client enhancements without introducing a separate build toolchain.',
      },
      {
        name: 'MySQLi prepared statements',
        reason: 'Bound parameters on every mutating query to block SQL injection without middleware.',
      },
      {
        name: 'Apache / XAMPP',
        reason: 'Local parity with the deployment environment the school could operate.',
      },
      {
        name: 'Font Awesome 5.7',
        reason: 'Iconography for navigation affordances on dense admin screens.',
      },
    ],
    skillIds: ['php', 'mysql', 'javascript', 'html-css'],
    viz: 'registrar_table',
    metrics: [
      {
        label: 'Document types',
        value: 7,
        suffix: '',
        description: 'Form 137 through ID replacement pipelines.',
      },
      {
        label: 'Request statuses',
        value: 4,
        suffix: '',
        description: 'Processing, Invalid, Ready, and Claim states.',
      },
      {
        label: 'User role portals',
        value: 2,
        suffix: '',
        description: 'Isolated admin and client dashboards.',
      },
      {
        label: 'Queries parameterized',
        value: 100,
        suffix: '%',
        description: 'MySQLi prepared statements on mutating SQL paths.',
      },
    ],
  },
]

export function projectById(id: ProjectId): ProjectEntry | undefined {
  return PROJECTS.find((p) => p.id === id)
}
