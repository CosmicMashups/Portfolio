import type { ProjectId, VizKind } from './project.types'
import bgMashHub from '@/assets/background/mashhub.jpg'
import bgPocketPt from '@/assets/background/pocketpt.jpg'
import bgAriMarket from '@/assets/background/arimarket.jpg'
import bgExpensIo from '@/assets/background/expens_io.jpg'
import bgRegistrar from '@/assets/background/registrar.jpg'
import bgExpensIoBusiness from '@/assets/background/expens_io_business.jpg'
import bgSchedulIo from '@/assets/background/schedul_io.jpg'

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
  /** Public deployed app (GitHub Pages, etc.) */
  liveUrl?: string
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
  /** Feature-section hero image (drop into /public or /src/assets and point here); falls back to a placeholder. */
  imageUrl?: string
  metrics?: {
    label: string
    value: number
    suffix: string
    description: string
  }[]
}

export const PROJECTS: ProjectEntry[] = [
  {
    id: 'expens_io_business',
    slug: 'expens-io-business',
    title: 'Expens.io Business',
    tagline: 'Enterprise financial operations and procurement ERP for construction companies',
    personalHook:
      'Four legacy Excel workbooks were the entire financial backbone of a construction company — this replaced all of them with one auditable system.',
    complexity: 'high',
    problem:
      'Daily expenses, project expenses, payroll, and project monitoring lived in four disconnected Excel workbooks with no procurement pipeline, no inventory tracking, and no audit trail — just formulas one wrong keystroke away from breaking.',
    solution:
      'A single React SPA backed by Supabase (PostgreSQL, Auth, Storage) that keeps Excel-parity finance registers while adding a full procure-to-pay pipeline: material request → requisition → canvassing → purchase order → goods receipt, with RLS enforcing every permission server-side, not just in the UI.',
    challenge:
      'Enterprise-grade authorization and auditability had to be real, not cosmetic — a hidden button is not access control, so every rule that matters lives in PostgreSQL RLS policies and RPCs, not component state.',
    outcome:
      'Shipped a 37-page, 12-role ERP covering finance, procurement, inventory, suppliers, assets, and OCR document intake, with Row Level Security as the actual enforcement boundary behind every screen.',
    lessonsLearned: [
      'UI permission checks are a UX layer, never a security boundary — RLS and RPC-side checks are what actually holds.',
      'A domain event bus (or in this case, direct RPC + trigger chaining) keeps derived state like PMR cost snapshots correct without services reaching into each other.',
      'Migrating four spreadsheets into one schema forces you to name the business rules that used to live only in someone\'s head.',
    ],
    techDeep: {
      architecture:
        'React 19 SPA (Vite, no SSR) → Pages → Hooks (TanStack Query) → Services → Supabase JS client → PostgreSQL with Row Level Security, triggers, and RPC functions as the real authorization and business-rule boundary.',
      keyDecisions: [
        'RLS as the enforcement boundary — PermissionGuard/useRole improve UX only, never gate real access',
        'Procure-to-pay as first-class domain: MRF → PRF → Canvassing → PO → Receipt, each stage its own table set',
        'No Edge Functions — trusted business rules live in SQL (RLS, triggers, RPC), not serverless TypeScript',
      ],
      tradeoffs:
        'Pushing business logic into Postgres (triggers, RPC) trades some debuggability in TypeScript for guarantees that can\'t be bypassed by a direct API call — worth it once auditability is a requirement, not a nice-to-have.',
    },
    decisions: [
      {
        title: 'RLS over UI gating',
        detail:
          'PermissionGuard and useRole exist purely for UX (hiding a button, redirecting to /access-denied) — the actual authorization boundary is PostgreSQL RLS policies and RPC-side role checks, so a direct Supabase API call is bound by the same rules as the UI.',
      },
      {
        title: 'Excel parity before net-new scope',
        detail:
          'The four legacy workbooks (Daily Expenses, Project Expenses, Payroll, Monitoring) were modeled 1:1 into the schema before the greenfield procure-to-pay, inventory, and supplier modules were layered on top — migration risk stayed isolated from new feature risk.',
      },
    ],
    architectureSummary:
      'Pages → Hooks (TanStack Query) → Services → Supabase client → PostgreSQL with RLS/triggers/RPC as the enforcement layer; 163+ Flyway-style numbered migrations track schema evolution from Excel parity through full procure-to-pay.',
    technicalNotes:
      'Reference doc: docs/projects/expens_io_business_system.md. Dashboard KPIs, procurement pipeline, and inventory movements all derive from RPC functions (get_dashboard_summary, get_project_cost_breakdown) rather than client-side aggregation, so numbers match regardless of which screen reads them.',
    stack: [
      { name: 'React 19 + TypeScript + Vite', reason: 'Client-rendered SPA — no Next.js, no custom Node API server in production; Node only runs dev/build/test.' },
      { name: 'Supabase (PostgreSQL + Auth + RLS + Storage)', reason: 'Hosted Postgres with Row Level Security as the real authorization boundary, plus invite-only auth and private storage buckets for receipts/OCR.' },
      { name: 'TanStack Query + Zustand', reason: 'Server-state caching/invalidation per entity, with small in-memory stores for session and UI state.' },
      { name: 'React Hook Form + Zod', reason: 'Typed form validation shared between UI and the schemas that mirror database constraints.' },
      { name: 'Recharts + Reaviz', reason: 'Dashboard KPI and procurement pipeline charts inside a themed ChartWrapper.' },
    ],
    skillIds: ['react', 'ts', 'tailwind', 'supabase', 'postgresql', 'vite', 'git'],
    viz: 'none',
    imageUrl: bgExpensIoBusiness,
    metrics: [
      { label: 'Route screens', value: 37, suffix: '', description: 'Feature-folder pages across finance, procurement, inventory, and admin.' },
      { label: 'User roles', value: 12, suffix: '', description: 'Granular RolePermissions flags per role, enforced server-side.' },
      { label: 'Legacy workbooks replaced', value: 4, suffix: '', description: 'Daily Expenses, Project Expenses, Payroll, and Monitoring — migrated, not just mirrored.' },
      { label: 'SQL migrations', value: 163, suffix: '+', description: 'Numbered, forward-only schema evolution from Excel parity to full procure-to-pay.' },
    ],
  },
  {
    id: 'pocketpt',
    slug: 'pocketpt',
    title: 'PocketPT',
    tagline: 'AI-guided rehabilitation with pose-aware feedback',
    personalHook: "Built so a friend's injury had somewhere better to go than a Google search.",
    repoUrl: 'https://github.com/CosmicMashups/PocketPT',
    liveUrl: 'https://cosmicmashups.github.io/PocketPT/',
    complexity: 'high',
    problem:
      'Patients need trustworthy guidance at home; the interface must reduce cognitive load while surfacing safety signals from ML outputs.',
    solution:
      'A cross-platform flow that foregrounds assessments, surfaces on-device pose and form feedback with calm maroon accents, and separates “today” from longitudinal history.',
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
          'Pose-driven form feedback and alert states reuse green→amber→red encodings consistently so users never relearn metaphors per screen.',
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
    imageUrl: bgPocketPt,
    metrics: [
      { label: 'Pose Estimation Accuracy', value: 85.4, suffix: '%', description: 'Reliable form guidance' },
      { label: 'mAP@0.5', value: 87.8, suffix: '%', description: 'Detection quality across categories' },
      { label: 'Pain Recognition Accuracy', value: 99.46, suffix: '%', description: 'High-confidence classification' },
      { label: 'Severe Pain Recall', value: 100, suffix: '%', description: 'Zero severe misses in tests' },
    ],
  },
  {
    id: 'schedul_io',
    slug: 'schedul-io',
    title: 'Schedul.io',
    tagline: 'Multi-tenant clinic access platform: booking, check-in, queueing, and staff/doctor consoles',
    personalHook:
      'Modeled as nine build milestones because a real clinic can\'t tolerate "we\'ll figure out auth later" — the schema and RBAC came first, every time.',
    complexity: 'high',
    problem:
      'Clinics ran scheduling by phone: no self-service booking, no single front-desk console for walk-ins/phone bookings/check-in/queue control, and doctors had no view scoped to just their own day.',
    solution:
      'One Spring Boot backend and three role-specific React SPAs (patient, staff, doctor) sharing a versioned REST API, with request-scoped multi-tenancy, a slot-booking engine with row-level locking, and event-driven notifications built on the same bus that produces the audit log.',
    challenge:
      'Two patients must never be able to book the same slot, and tenant data must stay isolated at the persistence layer — not just behind a header check in a controller.',
    outcome:
      'Shipped a 9-milestone, multi-tenant SaaS covering scheduling, booking, check-in, queueing, notifications, and reporting across three independently deployable frontends.',
    lessonsLearned: [
      'Multi-tenancy has to be enforced at the repository/entity-listener layer — a servlet filter alone only tells you which tenant asked, it doesn\'t stop a query from leaking across tenants.',
      'Reusing the audit-event bus for notifications meant zero changes to the services that originate those events — the audit listener and the notification listener are just two subscribers to the same fact.',
      'Row-level pessimistic locking is worth the throughput cost in the one place correctness genuinely outranks it: concurrent slot booking.',
    ],
    techDeep: {
      architecture:
        'Modular monolith, package-by-domain (tenant, scheduling, appointment, checkin/queue, notification, reporting), with cross-domain communication through an internal DomainAuditEvent bus rather than direct service calls.',
      keyDecisions: [
        'Request-scoped tenant context resolved from X-Tenant-Id before Spring Security runs, cross-checked against the JWT tenant claim',
        'SELECT ... FOR UPDATE row locking on slot booking — the one path where correctness under concurrency matters more than throughput',
        'Notifications run in an isolated transaction so a delivery failure can never roll back the business transaction that triggered it',
      ],
      tradeoffs:
        'An internal event bus adds indirection versus calling NotificationService directly from AppointmentService, but keeps Appointment/Queue completely unaware that anything downstream is listening — audit and notifications can evolve independently.',
    },
    decisions: [
      {
        title: 'One booking pipeline, tagged by source',
        detail:
          'Patient self-booking and staff-assisted phone/front-desk booking share the exact same state machine and validation path, distinguished only by a source tag — so there is no second, less-tested code path for staff bookings.',
      },
      {
        title: 'Explicit stub boundary for third-party gateways',
        detail:
          'SMS/email dispatch is a well-defined interface with a stub implementation rather than a fake integration presented as done — isolating "verified code" from "an external call with no test credentials."',
      },
    ],
    architectureSummary:
      'Three React/Vite SPAs (Patient Portal, Staff Console, Doctor Portal) → REST + JWT (X-Tenant-Id) → Spring Boot modular monolith → PostgreSQL (system of record) + Redis (cache/session), with Kafka wired as the event backbone.',
    technicalNotes:
      'Reference doc: docs/projects/schedul_io_system.md. Flyway-versioned migrations are immutable and forward-only — one migration exists specifically to retire and reseed data from an earlier migration rather than editing it in place.',
    stack: [
      { name: 'Java + Spring Boot (Web, Security, Data JPA)', reason: 'Package-by-domain modular monolith with JWT auth and role/permission-based authorization.' },
      { name: 'PostgreSQL + Flyway', reason: 'System of record with immutable, forward-only versioned schema migrations.' },
      { name: 'Redis', reason: 'Cache and session layer for the three-frontend, multi-tenant read load.' },
      { name: 'Kafka (event backbone)', reason: 'Wired as the async event path alongside the internal domain-audit bus.' },
      { name: 'React + TypeScript + Vite (×3 SPAs)', reason: 'Independently deployable patient, staff, and doctor frontends sharing one REST API.' },
    ],
    skillIds: ['java-spring', 'postgresql', 'react', 'ts', 'git'],
    viz: 'none',
    imageUrl: bgSchedulIo,
    metrics: [
      { label: 'Build milestones', value: 9, suffix: '', description: 'Schema/auth foundations through scheduling, booking, queueing, notifications, and reporting.' },
      { label: 'Role-scoped frontends', value: 3, suffix: '', description: 'Patient Portal, Staff Console, and Doctor Portal — independently deployable SPAs.' },
      { label: 'Reminder tiers', value: 3, suffix: '', description: '7-day, 24-hour, and 2-hour dedupe-aware appointment reminders.' },
    ],
  },
  {
    id: 'mashhub',
    slug: 'mashhub',
    title: 'MashHub',
    tagline: 'Harmonic intelligence for mashup and mix workflows',
    personalHook: 'Built because my Excel mashup database was an embarrassment to the system architect in me.',
    repoUrl: 'https://github.com/CosmicMashups/MashHub',
    liveUrl: 'https://cosmicmashups.github.io/MashHub/',
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
    imageUrl: bgMashHub,
  },
  {
    id: 'arimarket',
    slug: 'arimarket',
    title: 'AriMarket',
    tagline: 'ARIMA commodity forecasts on LAMP, with a Python ML pipeline and vanilla JS dashboards',
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
      architecture:
        'MVC-inspired PHP on Apache (XAMPP); MySQL for operational data; vanilla HTML/CSS/JS dashboard that fetches static per-commodity JSON; Jupyter-driven Python for offline ARIMA and a sentiment.py path invoked from PHP for contact NLP (per project feature notes).',
      keyDecisions: ['Expose confidence intervals early', 'Keep error metrics side-by-side for context'],
      tradeoffs:
        'Polyglot surface area (PHP + Python + browser) trades operational simplicity for correct tool choice per layer—no React/TypeScript SPA build.',
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
      'Frontend: HTML5/CSS3, vanilla JavaScript, Chart.js (financial/OHLC), Particles.js, Font Awesome—SPA-style behavior without React or TypeScript. Backend: PHP 8.x and MySQL. ML: Python in Jupyter for ARIMA exports to JSON; Scikit-learn, NLTK, Joblib for sentiment.py, called from PHP via exec with polling (per features doc).',
    technicalNotes:
      'Tech stack reference: docs/features/arimarket_features.md. This portfolio route is implemented in React for presentation only; the product itself stayed on the documented LAMP + vanilla JS + Python pipeline.',
    stack: [
      {
        name: 'HTML5 · CSS3 · Vanilla JavaScript',
        reason: 'SPA-style dashboard: Fetch API to static JSON, Chart.js + custom financial controller, Particles.js, Font Awesome—no React or TypeScript.',
      },
      {
        name: 'PHP 8.x (Apache / XAMPP)',
        reason: 'Forms, sessions, MVC-style structure, static JSON paths, and connect.php triggering sentiment.py with controlled exec + polling.',
      },
      { name: 'MySQL', reason: 'Relational storage including contacts with NLP-derived sentiment and commodity-related state.' },
      {
        name: 'Python ML (Jupyter, ARIMA, NLP)',
        reason: 'Offline notebooks for ARIMA training and exports; Scikit-learn + NLTK + Joblib for sentiment classification consumed from PHP.',
      },
      { name: 'Static JSON “API”', reason: 'Per-commodity files (e.g. tomato.json) so charts avoid live inference latency.' },
    ],
    skillIds: ['php', 'mysql', 'javascript', 'html-css', 'python', 'ml'],
    viz: 'arimarket',
    imageUrl: bgAriMarket,
  },

  {
    id: 'expens_io',
    slug: 'expens-io',
    title: 'Expens.io',
    tagline: 'Cross-platform finance tracking with AI-assisted insights',
    personalHook: 'Built in a condo, broke, needing more than the Notes app.',
    repoUrl: 'https://github.com/CosmicMashups/Expens.io',
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
    imageUrl: bgExpensIo,
  },
  {
    id: 'registrar',
    slug: 'registrar-system',
    title: 'IIST Registrar System',
    tagline:
      'A production-ready school registrar portal built at age 15 — before frameworks were vocabulary worth naming.',
    personalHook:
      'The IIST High School Registrar Online Document Requisition System digitized the manual document workflow for a real registrar office. Built as a 9th-grade thesis using PHP, MySQL, and Bootstrap, it ships dual portals, a seven-document-type pipeline, four lifecycle statuses, and defense-in-depth input handling — all written from first principles.',
    repoUrl: 'https://github.com/CosmicMashups/IISTRegistrarSystem',
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
    imageUrl: bgRegistrar,
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
