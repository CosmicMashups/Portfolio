import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, GitBranch, Layers } from 'lucide-react'
import { Section } from '@/components/shell/Section'
import { useTextScramble } from '@/hooks/useTextScramble'
import { RevealText } from '@/components/ui/RevealText'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { TiltCard } from '@/components/ui/TiltCard'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { DrawUnderline } from '@/components/ui/DrawUnderline'
import { Panel } from '@/components/ui/Panel'
import { useThemeAccent } from '@/app/providers/useThemeAccent'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { projectById } from '@/config/projects.registry'

const project = projectById('expens_io_business')!

const LEGACY_MODULES = [
  { workbook: 'Daily Expenses Report.xlsx', module: 'Daily Expenses' },
  { workbook: 'Project Expenses Report.xlsx', module: 'Project Expenses' },
  { workbook: 'Payroll Summary.xlsx', module: 'Payroll' },
  { workbook: 'Project Monitoring Report.xlsx', module: 'Monitoring (PMR)' },
]

const PIPELINE_STEPS = [
  { label: 'Material Request', note: 'Warehouse stock check' },
  { label: 'Requisition', note: 'Multi-step approval' },
  { label: 'Canvassing', note: 'Supplier forms + pool' },
  { label: 'Purchase Order', note: 'Version history, PDF/Excel' },
  { label: 'Goods Receipt', note: 'Expenses + inventory stock-in' },
]

export function ExpensIoBusinessPage() {
  const { setActiveProjectId } = useThemeAccent()
  const reduce = usePrefersReducedMotion()
  const scramble = useTextScramble({ targetText: 'Expens.io Business', durationMs: 1100 })

  useEffect(() => {
    setActiveProjectId('expens_io_business')
    return () => setActiveProjectId(null)
  }, [setActiveProjectId])

  return (
    <main id="main-content" tabIndex={-1} className="space-y-12 pt-6 outline-none sm:space-y-16 sm:pt-8">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 sm:p-10">
        <div className="relative grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-start lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Enterprise ERP · Construction Finance
            </p>
            <p
              ref={scramble.ref}
              className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl"
            >
              {scramble.displayText}
            </p>
            <div className="mt-3 max-w-xl text-lg text-[var(--color-text-secondary)] sm:text-xl">
              <RevealText delay={0.2}>{project.tagline}</RevealText>
            </div>
            <hr className="mt-6 w-28 border-0 border-t-2 border-[var(--accent-secondary)]" />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
              {project.personalHook}
            </p>
          </div>

          <Panel className="space-y-4 !border-solid !bg-[var(--color-bg-elevated)]">
            <h3 className="text-sm font-semibold text-[var(--global-text)]">System credentials</h3>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              {project.metrics?.map((m) => (
                <div key={m.label} className="flex items-baseline justify-between gap-3 border-b border-[var(--global-border)] pb-3 last:border-0 last:pb-0">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--global-text-muted)]">
                    {m.label}
                  </dt>
                  <dd className="font-[var(--font-mono)] text-[var(--global-text)]">
                    <KineticCounter value={m.value} suffix={m.suffix} decimals={0} />
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </section>

      <Section id="expens-business-scope" kicker="// PURPOSE & SCOPE" title="Four spreadsheets, one system of record">
        <p className="max-w-3xl text-[var(--global-text-muted)]">{project.problem}</p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--global-border)]">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--global-border)] text-[10px] uppercase tracking-wide text-[var(--global-text-muted)]">
                <th className="px-4 py-3 font-medium">Legacy workbook</th>
                <th className="px-4 py-3 font-medium">Application module</th>
              </tr>
            </thead>
            <tbody>
              {LEGACY_MODULES.map((row) => (
                <tr key={row.workbook} className="border-b border-[var(--global-border)] last:border-0">
                  <td className="px-4 py-3 font-[var(--font-mono)] text-xs text-[var(--global-text-muted)]">
                    {row.workbook}
                  </td>
                  <td className="px-4 py-3 text-[var(--global-text)]">{row.module}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="expens-business-architecture" kicker="// ARCHITECTURE" title="Pages → Hooks → Services → Supabase">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 text-[var(--global-text-muted)]">
            <p>{project.solution}</p>
            <p>{project.architectureSummary}</p>
          </div>
          <TiltCard>
            <BorderTrace>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--global-border)] p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--global-text)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden />
                  RLS is the enforcement boundary
                </div>
                <p className="text-sm leading-relaxed text-[var(--global-text-muted)]">{project.challenge}</p>
              </div>
            </BorderTrace>
          </TiltCard>
        </div>
      </Section>

      <Section id="expens-business-pipeline" kicker="// PROCUREMENT" title="Procure-to-pay pipeline">
        <div className="flex flex-wrap items-stretch gap-3">
          {PIPELINE_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex min-w-[150px] flex-1 items-center gap-3"
            >
              <div className="flex-1 rounded-xl border border-[var(--global-border)] px-4 py-3">
                <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--accent-primary)]">
                  Stage 0{i + 1}
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--global-text)]">{step.label}</p>
                <p className="text-xs text-[var(--global-text-muted)]">{step.note}</p>
              </div>
              {i < PIPELINE_STEPS.length - 1 ? (
                <span className="hidden text-[var(--global-text-muted)] sm:block" aria-hidden>
                  →
                </span>
              ) : null}
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="expens-business-decisions" kicker="// ENGINEERING DECISIONS" title="Real access control, not cosmetic">
        <div className="grid gap-5 md:grid-cols-2">
          {project.decisions.map((d) => (
            <TiltCard key={d.title}>
              <div className="h-full p-6">
                <div className="flex items-center gap-2 text-[var(--accent-secondary)]" aria-hidden>
                  <GitBranch className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-[var(--global-text)]">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--global-text-muted)]">{d.detail}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>

      <Section id="expens-business-stack" kicker="// STACK" title="Chosen for auditability, not novelty">
        <div className="grid gap-4 sm:grid-cols-2">
          {project.stack.map((s) => (
            <div key={s.name} className="rounded-xl border border-[var(--global-border)] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--global-text)]">
                <Layers className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden />
                {s.name}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--global-text-muted)]">{s.reason}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="expens-business-lessons" kicker="// LESSONS" title="What the migration taught">
        <ul className="space-y-3 text-[var(--global-text-muted)]">
          {project.lessonsLearned.map((lesson) => (
            <li key={lesson} className="flex gap-2">
              <span className="text-[var(--accent-primary)]">—</span>
              <span>{lesson}</span>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex justify-end border-t border-[var(--global-border)] pt-6">
          <Link to="/projects/schedul-io" className="inline-flex items-baseline gap-2 text-sm font-medium text-[var(--accent-primary)]">
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--global-text-muted)]">
              Next project
            </span>
            <DrawUnderline color="var(--accent-primary)">Schedul.io: Clinic Access Platform</DrawUnderline>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </Section>
    </main>
  )
}
