import { useEffect, useMemo, lazy, Suspense, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain,
  Database,
  GitMerge,
  Lock,
  Mic,
  PlugZap,
  Smartphone,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { PROJECTS } from '@/config/projects.registry'
import { Section } from '@/components/shell/Section'
import { useTextScramble } from '@/hooks/useTextScramble'
import { RevealText } from '@/components/ui/RevealText'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { TiltCard } from '@/components/ui/TiltCard'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { DrawUnderline } from '@/components/ui/DrawUnderline'
import { Panel } from '@/components/ui/Panel'
import { Card } from '@/components/ui/Card'
import { MashHubProjectPage } from '@/pages/mashhub/MashHubProjectPage'
import { PocketPTPage } from '@/components/projects/pocketpt/PocketPTPage'
import { useThemeAccent } from '@/app/providers/useThemeAccent'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { useTechnicalView } from '@/app/providers/useTechnicalView'
import { motionEase } from '@/lib/motion/presets'
import { cn } from '@/components/ui/cn'

const AriMarketDeepDive = lazy(() => import('@/components/projects/ProjectDeepDive_AriMarket'))

export function ProjectPage() {
  const { slug } = useParams()
  const project = useMemo(() => PROJECTS.find((item) => item.slug === slug), [slug])
  const scramble = useTextScramble({ targetText: project?.title ?? 'Project' })

  if (!project) {
    return (
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Section id="project-not-found" kicker="// PROJECT" title="Project not found">
          <p className="text-[var(--global-text-muted)]">The project route does not match an existing entry yet.</p>
          <Link to="/" className="mt-4 inline-flex text-sm text-[var(--accent-primary)]">
            Back home
          </Link>
        </Section>
      </main>
    )
  }

  if (project.slug === 'pocketpt') {
    return <PocketPTPage />
  }

  if (project.slug === 'mashhub') {
    return <MashHubProjectPage />
  }

  if (project.slug === 'expens-io') {
    return <ExpensIoPage />
  }

  if (project.slug === 'registrar-system') {
    return <RegistrarSystemPage />
  }

  if (project.slug === 'arimarket') {
    return <AriMarketProjectPage />
  }

  return (
    <main id="main-content" tabIndex={-1} className="pt-6 outline-none sm:pt-8">
      <Section id="project-header" kicker="// PROJECT" title={scramble.displayText}>
        <RevealText className="text-xl text-[var(--color-text-primary)]">{project.personalHook}</RevealText>
      </Section>
      <Section id="project-split" kicker="// BUILD STORY" title="Challenge and solution">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 text-[var(--color-text-secondary)]">
            <p>{project.challenge}</p>
            <p>{project.solution}</p>
          </div>
          <TiltCard>
            <BorderTrace>
              <div className="rounded-2xl border border-[var(--color-border-subtle)] p-6">
                <p className="text-sm text-[var(--color-text-muted)]">{project.architectureSummary}</p>
              </div>
            </BorderTrace>
          </TiltCard>
        </div>
      </Section>
      {project.metrics?.length ? (
        <Section id="project-metrics" kicker="// METRICS" title="Measured outcomes">
          <div className="grid gap-4 md:grid-cols-2">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-[var(--color-border-subtle)] p-6">
                <KineticCounter value={metric.value} suffix={metric.suffix} decimals={metric.value % 1 ? 2 : 0} className="text-2xl" />
                <p className="text-sm text-[var(--color-text-secondary)]">{metric.label}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  <DrawUnderline>{metric.description}</DrawUnderline>
                </p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
      <Section id="project-lessons" kicker="// LESSONS" title="What went wrong">
        <ul className="space-y-2 text-[var(--color-text-secondary)]">
          {project.lessonsLearned.map((lesson) => (
            <li key={lesson} className="flex gap-2">
              <span className="text-[var(--color-accent-primary)]">—</span>
              <span>{lesson}</span>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  )
}

function AriMarketProjectPage() {
  const { setActiveProjectId } = useThemeAccent()

  useEffect(() => {
    setActiveProjectId('arimarket')
    return () => setActiveProjectId(null)
  }, [setActiveProjectId])

  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--global-text-muted)]">
            Loading case study…
          </div>
        }
      >
        <AriMarketDeepDive />
      </Suspense>
    </main>
  )
}

const REGISTRAR_NOISE_DATA_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

function RegistrarSystemPage() {
  const { setActiveProjectId } = useThemeAccent()
  const reduce = usePrefersReducedMotion()
  const scramble = useTextScramble({
    targetText: 'IIST Registrar System',
    durationMs: 1200,
  })

  useEffect(() => {
    setActiveProjectId('registrar')
    return () => setActiveProjectId(null)
  }, [setActiveProjectId])

  const motionSoft = reduce
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 120, damping: 22, mass: 0.9 }

  return (
    <main id="main-content" tabIndex={-1} className="space-y-12 pt-6 outline-none sm:space-y-16 sm:pt-8">
      <section
        id="registrar-hero"
        className="relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 sm:p-10"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: REGISTRAR_NOISE_DATA_URI, backgroundSize: '96px 96px' }}
          aria-hidden
        />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-start lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Thesis project · S.Y. 2018–2019
            </p>
            <p
              ref={scramble.ref}
              className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl"
            >
              {scramble.displayText}
            </p>
            <div className="mt-3 max-w-xl text-lg text-[var(--color-text-secondary)] sm:text-xl">
              <RevealText delay={0.2}>Online Document Requisition Platform</RevealText>
            </div>
            <hr className="mt-6 w-28 border-0 border-t-2 border-[var(--accent-secondary)]" />
            <p className="mt-6 max-w-2xl text-xl font-medium italic leading-snug text-[var(--color-text-primary)] sm:text-2xl sm:leading-snug">
              Built in 9th grade. Deployed for a real school.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[var(--global-border)] bg-[color:color-mix(in_oklab,var(--surface-tint)_12%,var(--global-surface))] p-6 shadow-[var(--shadow-glass)]">
            <p
              className="pointer-events-none absolute -right-4 bottom-8 left-4 rotate-[-18deg] select-none font-[var(--font-mono)] text-5xl font-bold uppercase tracking-widest text-[var(--surface-tint)] opacity-[0.07] sm:text-6xl"
              aria-hidden
            >
              Archived
            </p>
            <div className="absolute right-4 top-4 rounded-md bg-[var(--accent-primary)] px-2.5 py-1 font-[var(--font-mono)] text-[9px] font-bold uppercase tracking-wide text-[var(--global-bg)]">
              Thesis defended
            </div>
            <h3 className="text-sm font-semibold text-[var(--global-text)]">Project credentials</h3>
            <dl className="relative mt-4 grid grid-cols-1 gap-3 text-sm">
              <div className="flex flex-col gap-0.5 border-b border-[var(--global-border)] pb-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--global-text-muted)]">
                  School
                </dt>
                <dd className="text-[var(--global-text)]">IIST High School</dd>
              </div>
              <div className="flex flex-col gap-0.5 border-b border-[var(--global-border)] pb-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--global-text-muted)]">
                  Year
                </dt>
                <dd className="font-[var(--font-mono)] text-[var(--global-text)]">2019 (S.Y. 2018–2019)</dd>
              </div>
              <div className="flex flex-col gap-0.5 border-b border-[var(--global-border)] pb-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--global-text-muted)]">
                  Role
                </dt>
                <dd className="text-[var(--global-text)]">Author / deployer</dd>
              </div>
              <div className="flex flex-col gap-0.5 border-b border-[var(--global-border)] pb-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--global-text-muted)]">
                  Stack
                </dt>
                <dd className="text-[var(--global-text)]">PHP 7.2, MySQL, Bootstrap 3, Apache (XAMPP)</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--global-text-muted)]">
                  Status
                </dt>
                <dd className="text-[var(--accent-primary)]">Archived</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section id="registrar-problem" className="space-y-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Before and after</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={motionSoft}
            className="rounded-2xl border border-[var(--color-border-default)] bg-[color:color-mix(in_oklab,var(--color-text-muted)_08%,var(--color-bg-elevated))] p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              Before: Manual process
            </p>
            <ol className="mt-4 list-none space-y-3 font-[var(--font-mono)] text-sm text-[var(--color-text-secondary)]">
              <li>01. Travel to campus physically</li>
              <li>02. Fill out paper request form</li>
              <li>03. Pay at cashier in person</li>
              <li>04. Return days/weeks later to claim</li>
              <li>05. Hope the registrar remembers you</li>
            </ol>
          </motion.div>
          <motion.div
            initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={motionSoft}
            className="rounded-2xl border border-[color:color-mix(in_oklab,var(--accent-primary)_35%,transparent)] bg-[color:color-mix(in_oklab,var(--accent-secondary)_10%,var(--color-bg-surface))] p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent-primary)]">
              After: IIST Registrar System
            </p>
            <ol className="mt-4 list-none space-y-3 font-[var(--font-mono)] text-sm text-[var(--color-text-primary)]">
              <li>01. Register online from anywhere</li>
              <li>02. Submit request with digital form</li>
              <li>03. Pay via GCash / PayMaya online</li>
              <li>04. Track status in real-time</li>
              <li>05. Receive email notification when ready</li>
            </ol>
          </motion.div>
        </div>
      </section>

      <section id="registrar-engineering" className="space-y-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Engineering decisions</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <TiltCard>
            <div className="h-full p-6">
              <div className="text-2xl text-[var(--accent-secondary)]" aria-hidden>
                ⬡
              </div>
              <h3 className="mt-3 text-base font-semibold text-[var(--color-text-primary)]">
                Dual portal, zero crossover
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Administrators and clients log into entirely separate dashboard views — not just different routes,
                but different session-validated entry points. A student cannot stumble into the admin panel; the
                routing itself enforces the boundary. Role isolation was implemented with PHP session management
                before &quot;RBAC&quot; was vocabulary worth naming.
              </p>
            </div>
          </TiltCard>
          <TiltCard>
            <div className="h-full p-6">
              <div className="text-2xl text-[var(--accent-secondary)]" aria-hidden>
                ◈
              </div>
              <h3 className="mt-3 text-base font-semibold text-[var(--color-text-primary)]">
                Prepared statements from day one
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Every database interaction uses MySQLi prepared statements with bound parameters — not
                string-interpolated queries. Combined with htmlspecialchars() sanitization and FILTER_SANITIZE_EMAIL,
                the system was hardened against SQL injection and XSS without a framework or ORM. Those choices were
                structural, not optional extras bolted on later.
              </p>
            </div>
          </TiltCard>
          <TiltCard className="md:col-span-2 lg:col-span-1">
            <div className="h-full p-6">
              <div className="text-2xl text-[var(--accent-secondary)]" aria-hidden>
                →
              </div>
              <h3 className="mt-3 text-base font-semibold text-[var(--color-text-primary)]">
                Stateless status scripts
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Instead of centralizing status updates in one monolithic handler, each lifecycle transition is a
                dedicated script under /Status. Admins trigger transitions with a simple URL parameter on the request
                dashboard. The state machine stays readable: one file, one transition, one audit path.
              </p>
            </div>
          </TiltCard>
        </div>
      </section>

      <section id="registrar-context" className="pb-4">
        <Panel className="relative mx-auto max-w-3xl space-y-5 bg-[var(--color-bg-elevated)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            <DrawUnderline>What makes this remarkable</DrawUnderline>
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            <p>
              This was not a homework exercise. It was a production-grade, multi-user web application written to
              replace a real administrative process at a real school — in the summer between 8th and 9th grade.
            </p>
            <p>
              Without a framework, Yuri wired PHP sessions, relational schema design, file uploads for payment proofs,
              parameterized queries, and a responsive Bootstrap UI from first principles. PHP, MySQL, and Bootstrap
              were pragmatic choices for XAMPP on school-owned hardware — not trend-chasing.
            </p>
            <p>
              The thesis documents limitations with the same tone as a senior code review: stronger password hashing,
              deeper normalization, and MVC-style refactoring appear in the future work section. The gap list reads
              like engineering self-assessment, not a student appendix padded for length.
            </p>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3 border-t border-[var(--color-border-subtle)] pt-5 text-[var(--color-text-muted)]">
            <span className="inline-flex items-baseline gap-2">
              <KineticCounter value={7} className="text-2xl text-[var(--accent-primary)]" />
              <span className="text-xs uppercase tracking-wide">document types</span>
            </span>
            <span className="text-[var(--color-border-strong)]" aria-hidden>
              |
            </span>
            <span className="inline-flex items-baseline gap-2">
              <KineticCounter value={4} className="text-2xl text-[var(--accent-primary)]" />
              <span className="text-xs uppercase tracking-wide">status states</span>
            </span>
            <span className="text-[var(--color-border-strong)]" aria-hidden>
              |
            </span>
            <span className="inline-flex items-baseline gap-2">
              <KineticCounter value={2} className="text-2xl text-[var(--accent-primary)]" />
              <span className="text-xs uppercase tracking-wide">role portals</span>
            </span>
          </div>
        </Panel>
      </section>
    </main>
  )
}

const EXPENS_THEME_CSS = `
.expens-root .exp-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--accent-primary);
}

.expens-root .exp-mono {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.expens-root .exp-grid-bg {
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--global-text-muted) 12%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklab, var(--global-text-muted) 12%, transparent) 1px, transparent 1px);
  background-size: 48px 48px;
}
`

interface ConstraintDef {
  icon: LucideIcon
  title: string
  body: string
}

const CONSTRAINTS: ConstraintDef[] = [
  {
    icon: PlugZap,
    title: 'Works 100% offline. Always.',
    body: 'No login wall, no spinner waiting for a backend that may or may not be there. The local-first contract means the app boots and writes the same way on a plane, in a basement, or on a flaky barangay connection.',
  },
  {
    icon: Smartphone,
    title: '6 platforms. 1 Dart codebase.',
    body: 'Android, iOS, Web, Windows, macOS, and Linux all run the same widget tree. Flutter\'s unified rendering pipeline carries the design system across every surface without per-platform forks.',
  },
  {
    icon: Lock,
    title: 'AI insights that never leave your device.',
    body: 'The Spending Score and pattern recognition run inside the app process — no third-party API, no transaction history sent over the network. Financial data stays where it belongs: with you.',
  },
]

interface MetricDef {
  value: number
  suffix?: string
  label: string
}

const EXPENS_METRICS: MetricDef[] = [
  { value: 6, label: 'platforms supported · Android, iOS, Web, Windows, macOS, Linux' },
  { value: 3, label: 'SQLite schema versions · zero data loss migrations' },
  { value: 5, label: 'core screens · Dashboard, Solo, Shared, Budget, Report' },
  { value: 60, label: 'fps maintained during async chart aggregation' },
  { value: 100, suffix: '%', label: 'offline-capable · no backend required' },
]

interface LayerDef {
  label: string
  sub: string
  badge: string
  annotation: string
  accent: string
}

const LAYERS: LayerDef[] = [
  {
    label: 'Flutter Material Design UI',
    sub: 'Dashboard · Solo · Shared · Budget · Reports',
    badge: '01 · UI',
    annotation: 'lib/screens/* · widget tree per route',
    accent: 'var(--color-accent-tertiary)',
  },
  {
    label: 'SmartInsightsService · GamificationService · SocialService · SimpleVoiceService · SimpleReceiptService',
    sub: 'Domain logic decoupled from widget tree',
    badge: '02 · SERVICES',
    annotation: 'lib/services/*.dart · singleton domain logic',
    accent: 'var(--accent-secondary)',
  },
  {
    label: 'DBHelper · BudgetHelper',
    sub: 'Platform-aware persistence orchestration',
    badge: '03 · DATA ACCESS',
    annotation: 'lib/helpers/db_helper.dart · lib/helpers/budget_helper.dart',
    accent: 'var(--accent-primary)',
  },
]

interface FeatureDef {
  icon: LucideIcon
  title: string
  tech: string
  body: string
  snippet?: string
}

const FEATURES_ROW_1: FeatureDef[] = [
  {
    icon: Database,
    title: 'Platform-Adaptive Storage',
    tech: 'kIsWeb → SharedPreferences JSON | sqflite SQLite',
    body: 'Instead of shipping two separate apps or requiring an always-on server, expens.io detects its runtime environment and routes all persistence through the appropriate engine — automatically. One codebase. Six platforms. No compromises.',
    snippet: `if (kIsWeb) {\n  // JSON → SharedPreferences\n  await prefs.setString('expenses', jsonEncode(rows));\n} else {\n  // SQL → sqflite\n  await db.insert('expenses', row);\n}`,
  },
  {
    icon: Brain,
    title: 'On-Device AI Spending Score',
    tech: 'SmartInsightsService · heuristic pattern recognition · 0 cloud calls',
    body: 'A 0–100 Spending Score built entirely from local heuristics — no external API, no data leaving the device. The system identifies anomalies, trending categories, and budget deviation patterns in real time, turning raw transactions into actionable advice.',
  },
]

const FEATURES_ROW_2: FeatureDef[] = [
  {
    icon: Mic,
    title: 'Voice & Receipt Input',
    tech: 'SimpleVoiceService · SimpleReceiptService · NLP parsing · OCR',
    body: 'Logging an expense is a 2-second gesture: speak it or photograph the receipt. The NLP pipeline extracts amount, category, and merchant name, pre-filling the form for one-tap confirmation. No more end-of-day expense archaeology.',
  },
  {
    icon: Trophy,
    title: 'Behavioral Gamification',
    tech: 'GamificationService · SocialService · achievement engine · percentile ranking',
    body: 'Expense tracking has a retention problem. expens.io solves it with achievement unlocks, spending streaks, and anonymized peer comparison — behavioral mechanics borrowed from consumer games, applied to the one financial habit that actually matters.',
  },
  {
    icon: GitMerge,
    title: 'Zero-Loss Schema Evolution',
    tech: 'sqflite onUpgrade · ALTER TABLE · 3-version migration chain',
    body: 'Production databases need to evolve without destroying user data. expens.io\'s SQLite initialization tracks a version integer and applies forward-only ALTER TABLE migrations — the same pattern used in professional mobile apps, implemented from scratch in a portfolio project.',
    snippet: `onUpgrade: (db, oldV, newV) async {\n  if (oldV < 2) await db.execute('ALTER TABLE expenses ADD COLUMN sub_category TEXT');\n  if (oldV < 3) await db.execute('ALTER TABLE expenses ADD COLUMN attachment_path TEXT');\n}`,
  },
]

interface StackPill {
  emoji: string
  name: string
  role: string
}

const STACK_PILLS: StackPill[] = [
  { emoji: '💙', name: 'Flutter', role: 'Cross-Platform UI' },
  { emoji: '🎯', name: 'Dart', role: 'Language' },
  { emoji: '💾', name: 'SQLite', role: 'Native Storage' },
  { emoji: '📦', name: 'SharedPrefs', role: 'Web Storage' },
  { emoji: '📊', name: 'fl_chart', role: 'Visualizations' },
  { emoji: '✒️', name: 'google_fonts', role: 'Typography' },
  { emoji: '📷', name: 'image_picker', role: 'Media Input' },
  { emoji: '🌐', name: 'intl', role: 'Localization' },
  { emoji: '📁', name: 'path_provider', role: 'File System' },
  { emoji: '🧭', name: 'curved_nav', role: 'Navigation' },
]

interface LessonDef {
  title: string
  body: string
}

const LESSONS: LessonDef[] = [
  {
    title: 'Architecture before features',
    body: 'Abstracting GamificationService and SmartInsightsService out of the widget tree wasn\'t optional — it was the decision that let me add voice input and receipt scanning in days instead of weeks. Clean separation of concerns compounds.',
  },
  {
    title: 'Platform-first thinking',
    body: 'Building for six targets simultaneously forces you to write to the lowest common denominator, then lift with platform-specific optimizations. kIsWeb is a small constant. The discipline it represents is enormous.',
  },
  {
    title: 'Behavior design is engineering',
    body: 'The gamification system felt like a "nice to have" until I realized it\'s solving a retention problem — the same one every B2C fintech app faces. Designing behavioral incentives requires the same rigor as designing a database schema.',
  },
]

function ExpensSection({
  id,
  eyebrow,
  title,
  children,
  className,
  reduce,
}: {
  id: string
  eyebrow: string
  title: ReactNode
  children: ReactNode
  className?: string
  reduce: boolean
}) {
  return (
    <motion.section
      id={id}
      className={cn(
        'scroll-mt-[calc(var(--shell-header-height)+2rem)] py-14 sm:py-20',
        className,
      )}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.55, ease: motionEase }}
    >
      <p className="exp-eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
        {title}
      </h2>
      <div className="mt-10 md:mt-12">{children}</div>
    </motion.section>
  )
}

function DeviceFrame({ reduce }: { reduce: boolean }) {
  const barHeights = [0.45, 0.82, 0.6]
  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      <BorderTrace>
        <div
          className="relative rounded-[2.5rem] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-2.5"
          style={{
            aspectRatio: '9 / 19',
            boxShadow: '0 0 60px color-mix(in oklab, var(--accent-primary) 30%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]">
            <div className="absolute left-1/2 top-2 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-[var(--color-bg-elevated)]" aria-hidden />
            <div className="absolute inset-0 exp-grid-bg opacity-60" aria-hidden />

            <div className="relative flex h-full flex-col px-4 pb-16 pt-8">
              <p className="exp-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Wallet balance
              </p>
              <p className="mt-1 text-xl font-semibold text-[var(--color-text-primary)]">₱24,830</p>
              <p className="exp-mono mt-0.5 text-[9px] text-[var(--color-text-secondary)]">
                +₱1,240 this week
              </p>

              <div className="mt-5 flex flex-1 items-end gap-2">
                {barHeights.map((h, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-1 rounded-t-md"
                    style={{
                      background:
                        'linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                      transformOrigin: 'bottom',
                    }}
                    initial={reduce ? { height: `${h * 100}%` } : { height: '4%' }}
                    whileInView={{ height: `${h * 100}%` }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{
                      duration: 0.7,
                      delay: 0.25 + idx * 0.12,
                      ease: motionEase,
                    }}
                  />
                ))}
              </div>

              <p className="exp-mono mt-3 text-[8px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                This week
              </p>
            </div>

            <div
              className="absolute inset-x-0 bottom-0 h-14 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]"
              style={{ borderRadius: '50% 50% 0 0 / 28px 28px 0 0' }}
              aria-hidden
            >
              <div className="flex h-full items-center justify-around px-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-2 w-2 rounded-full',
                      i === 0
                        ? 'bg-[var(--accent-primary)] shadow-[0_0_10px_color-mix(in oklab, var(--accent-primary) 30%, transparent)]'
                        : 'bg-[var(--color-border-strong)]',
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </BorderTrace>
    </div>
  )
}

function ConstraintCard({ icon: Icon, title, body }: ConstraintDef) {
  return (
    <TiltCard className="h-full !border-[var(--color-border-subtle)] !bg-[var(--color-bg-surface)]/70 backdrop-blur-md">
      <BorderTrace className="h-full">
        <div className="flex h-full flex-col gap-3 p-6">
          <Icon className="h-7 w-7 text-[var(--accent-primary)]" aria-hidden />
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{body}</p>
        </div>
      </BorderTrace>
    </TiltCard>
  )
}

function MetricStat({
  value,
  suffix,
  label,
  reduce,
  delay,
}: MetricDef & { reduce: boolean; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-start gap-2"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, ease: motionEase, delay }}
    >
      <KineticCounter
        value={value}
        suffix={suffix ?? ''}
        className="!font-[var(--font-display)] !text-4xl !text-[var(--accent-primary)] sm:!text-5xl"
      />
      <p className="text-xs leading-snug text-[var(--color-text-secondary)]">{label}</p>
    </motion.div>
  )
}

function LayerConnector({ reduce }: { reduce: boolean }) {
  return (
    <div className="flex h-6 items-center justify-center" aria-hidden>
      <svg width="2" height="24" viewBox="0 0 2 24" className="overflow-visible">
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="24"
          stroke="var(--accent-primary)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          strokeOpacity="0.6"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: motionEase }}
        />
      </svg>
    </div>
  )
}

function LayerBand({
  layer,
  technical,
  reduce,
  index,
}: {
  layer: LayerDef
  technical: boolean
  reduce: boolean
  index: number
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-5 sm:p-6"
      style={{ borderLeftWidth: '4px', borderLeftColor: layer.accent }}
      initial={reduce ? false : { opacity: 0, x: -12 }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, ease: motionEase, delay: index * 0.06 }}
    >
      <p className="exp-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: layer.accent }}>
        {layer.badge}
      </p>
      <p className="mt-2 break-words text-sm font-medium leading-snug text-[var(--color-text-primary)] sm:text-base">
        {layer.label}
      </p>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{layer.sub}</p>
      {technical ? (
        <p className="exp-mono mt-3 text-[10px] text-[var(--accent-secondary)]">{layer.annotation}</p>
      ) : null}
    </motion.div>
  )
}

function StorageLayer({ technical, reduce }: { technical: boolean; reduce: boolean }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]"
      style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--color-error)' }}
      initial={reduce ? false : { opacity: 0, x: -12 }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, ease: motionEase, delay: 0.18 }}
    >
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <p
          className="exp-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: 'var(--color-error)' }}
        >
          04 · STORAGE
        </p>
      </div>
      <div className="relative grid grid-cols-1 gap-4 p-5 sm:p-6 md:grid-cols-[1fr_auto_1fr] md:gap-6">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">sqflite (SQLite)</p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Native: Android · iOS · Desktop
          </p>
          {technical ? (
            <p className="exp-mono mt-2 text-[10px] text-[var(--accent-secondary)]">
              package:sqflite/sqflite.dart
            </p>
          ) : null}
        </div>
        <div className="relative flex items-center justify-center">
          <div
            className="hidden h-full w-px border-l-2 border-dashed border-[var(--color-border-strong)] md:block"
            aria-hidden
          />
          <div
            className="block h-px w-full border-t-2 border-dashed border-[var(--color-border-strong)] md:hidden"
            aria-hidden
          />
          <span className="exp-mono absolute rounded border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] px-1.5 py-0.5 text-[10px] text-[var(--accent-primary)]">
            kIsWeb ?
          </span>
        </div>
        <div className="md:text-right">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            SharedPreferences (JSON)
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">Web fallback</p>
          {technical ? (
            <p className="exp-mono mt-2 text-[10px] text-[var(--accent-secondary)]">
              package:shared_preferences/shared_preferences.dart
            </p>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}

function FeatureCard({
  feature,
  technical,
  reduce,
  delay,
}: {
  feature: FeatureDef
  technical: boolean
  reduce: boolean
  delay: number
}) {
  const Icon = feature.icon
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.55, ease: motionEase, delay }}
      className="h-full"
    >
      <Card className="h-full !bg-[var(--color-bg-surface)]/80 !border-[var(--color-border-subtle)]">
        <div className="flex h-full flex-col gap-4">
          <Icon className="h-7 w-7 text-[var(--accent-primary)]" aria-hidden />
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{feature.title}</h3>
            <p className="exp-mono mt-1 text-[11px] leading-snug text-[var(--color-text-muted)]">
              {feature.tech}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{feature.body}</p>
          {technical && feature.snippet ? (
            <pre className="exp-mono mt-auto overflow-x-auto rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-3 text-[10px] leading-relaxed text-[var(--accent-secondary)]">
              {feature.snippet}
            </pre>
          ) : null}
        </div>
      </Card>
    </motion.div>
  )
}

function StackPillBadge({ pill }: { pill: StackPill }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-2">
      <span className="text-lg" aria-hidden>
        {pill.emoji}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{pill.name}</p>
        <p className="exp-mono truncate text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
          {pill.role}
        </p>
      </div>
    </div>
  )
}

function LessonCard({ lesson, index, reduce }: { lesson: LessonDef; index: number; reduce: boolean }) {
  return (
    <motion.div
      className="rounded-[var(--radius-project)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]/60 p-6"
      style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--accent-primary)' }}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, ease: motionEase, delay: index * 0.08 }}
    >
      <p className="exp-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent-primary)]">
        Lesson {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">{lesson.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{lesson.body}</p>
    </motion.div>
  )
}

function ExpensIoPage() {
  const { setActiveProjectId } = useThemeAccent()
  const reduce = usePrefersReducedMotion()
  const { technical } = useTechnicalView()
  const heroScramble = useTextScramble({ targetText: 'Your Wallet. Your Rules.', durationMs: 1000 })

  useEffect(() => {
    setActiveProjectId('expens_io')
    return () => setActiveProjectId(null)
  }, [setActiveProjectId])

  return (
    <div className="expens-root">
      <style>{EXPENS_THEME_CSS}</style>
      <main id="main-content" tabIndex={-1} className="outline-none">
        <section
          id="expens-hero"
          className="relative scroll-mt-[calc(var(--shell-header-height)+2rem)] overflow-hidden rounded-2xl border border-[var(--color-border-subtle)]"
          style={{
            minHeight: '60vh',
            background:
              'linear-gradient(180deg, color-mix(in oklab, var(--accent-primary) 8%, var(--color-bg-base)) 0%, var(--color-bg-base) 100%)',
          }}
        >
          <div className="absolute inset-0 exp-grid-bg opacity-50" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:py-24">
            <div>
              <p className="exp-eyebrow">FLUTTER · DART · SQLITE · LOCAL-FIRST</p>
              <h1
                ref={heroScramble.ref}
                className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl"
              >
                {heroScramble.displayText}
              </h1>
              <div className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
                <RevealText>
                  A cross-platform expense tracker engineered for six platforms from a single codebase — with AI insights that never leave your device.
                </RevealText>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#expens-architecture"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg-base)] shadow-[0_0_20px_color-mix(in oklab, var(--accent-primary) 30%, transparent)] transition-transform hover:-translate-y-0.5"
                >
                  Explore the Architecture
                  <span aria-hidden>↓</span>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--accent-primary)]"
                >
                  View on GitHub
                  <span aria-hidden>↗</span>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {['Flutter', 'Dart', 'SQLite', 'SharedPreferences', 'fl_chart'].map((s) => (
                  <span
                    key={s}
                    className="exp-mono rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-1 text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <DeviceFrame reduce={reduce} />
            </div>
          </div>
        </section>

        <ExpensSection
          id="expens-problem"
          eyebrow="WHY IT EXISTS"
          title={<RevealText>Expense tracking apps ask you to choose: offline or rich.</RevealText>}
          reduce={reduce}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
              Most trackers either require a backend to function, making them useless offline, or they&apos;re so stripped down they can&apos;t handle shared expenses, custom budgets, or meaningful analytics. expens.io refuses that tradeoff.
            </p>
            <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
              Built on Flutter&apos;s unified rendering engine and SQLite&apos;s battle-tested reliability, it delivers analytics-grade features with zero cloud dependency — while still gracefully running in a browser tab.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CONSTRAINTS.map((c) => (
              <ConstraintCard key={c.title} {...c} />
            ))}
          </div>
        </ExpensSection>

        <section
          id="expens-metrics"
          className="scroll-mt-[calc(var(--shell-header-height)+2rem)] rounded-2xl border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]/60 py-12 sm:py-16"
        >
          <p className="exp-eyebrow text-center">BY THE NUMBERS</p>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
            {EXPENS_METRICS.map((m, idx) => (
              <MetricStat key={m.label} {...m} reduce={reduce} delay={idx * 0.08} />
            ))}
          </div>
        </section>

        <ExpensSection
          id="expens-architecture"
          eyebrow="ENGINEERING DECISIONS"
          title={<RevealText>Four layers. One principle: local-first.</RevealText>}
          reduce={reduce}
        >
          <div className="mx-auto max-w-3xl">
            {LAYERS.map((layer, idx) => (
              <div key={layer.label}>
                <LayerBand layer={layer} technical={technical} reduce={reduce} index={idx} />
                <LayerConnector reduce={reduce} />
              </div>
            ))}
            <StorageLayer technical={technical} reduce={reduce} />
          </div>
        </ExpensSection>

        <ExpensSection
          id="expens-features"
          eyebrow="STANDOUT FEATURES"
          title="Where engineering meets behavior design."
          reduce={reduce}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {FEATURES_ROW_1.map((f, idx) => (
              <FeatureCard
                key={f.title}
                feature={f}
                technical={technical}
                reduce={reduce}
                delay={idx * 0.08}
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES_ROW_2.map((f, idx) => (
              <FeatureCard
                key={f.title}
                feature={f}
                technical={technical}
                reduce={reduce}
                delay={idx * 0.08}
              />
            ))}
          </div>
        </ExpensSection>

        <ExpensSection
          id="expens-stack"
          eyebrow="TECH STACK"
          title="Chosen deliberately. Not by default."
          reduce={reduce}
        >
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {STACK_PILLS.map((p) => (
                <StackPillBadge key={p.name} pill={p} />
              ))}
            </div>
            <Panel className="space-y-4 !bg-[var(--color-bg-surface)] !border-solid !border-[var(--color-border-strong)]">
              <p className="exp-eyebrow">WHY FLUTTER</p>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Flutter was chosen for its single-codebase promise — but the real payoff is the rendering consistency. The same fl_chart widget that renders on Android renders identically on a browser tab.
              </p>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Dart&apos;s strong typing and null safety caught entire categories of bugs at compile time — particularly important for financial data where a null amount is a real error, not a UX edge case.
              </p>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                The SQLite / SharedPreferences bifurcation is only possible because Dart&apos;s conditional imports and Flutter&apos;s <span className="exp-mono text-[var(--accent-secondary)]">kIsWeb</span> constant are first-class citizens, not afterthoughts.
              </p>
            </Panel>
          </div>
        </ExpensSection>

        <ExpensSection
          id="expens-lessons"
          eyebrow="WHAT I LEARNED"
          title={<RevealText>The hardest part wasn&apos;t the code.</RevealText>}
          reduce={reduce}
        >
          <div className="grid gap-6 md:grid-cols-3">
            {LESSONS.map((l, idx) => (
              <LessonCard key={l.title} lesson={l} index={idx} reduce={reduce} />
            ))}
          </div>
          <div className="mt-12 flex flex-col items-stretch gap-6">
            <hr className="border-0 border-t border-[var(--color-border-subtle)]" />
            <div className="flex justify-end">
              <Link
                to="/projects/mashhub"
                className="inline-flex items-baseline gap-2 text-sm font-medium text-[var(--accent-primary)]"
              >
                <span className="exp-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                  Next project
                </span>
                <DrawUnderline color="var(--accent-primary)">MashHub: Music Matcher &amp; Database</DrawUnderline>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </ExpensSection>
      </main>
    </div>
  )
}

