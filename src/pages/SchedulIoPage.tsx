import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Radio, Users } from 'lucide-react'
import { Section } from '@/components/shell/Section'
import { useTextScramble } from '@/hooks/useTextScramble'
import { RevealText } from '@/components/ui/RevealText'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { TiltCard } from '@/components/ui/TiltCard'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { DrawUnderline } from '@/components/ui/DrawUnderline'
import { Panel } from '@/components/ui/Panel'
import { useThemeAccent } from '@/app/providers/useThemeAccent'
import { projectById } from '@/config/projects.registry'

const project = projectById('schedul_io')!

const APPS = [
  { name: 'Patient Portal', scope: 'Public doctor directory, booking, self-service cancel/reschedule' },
  { name: 'Staff Console', scope: 'Dashboard, calendar, check-in, queue control, admin, reports' },
  { name: 'Doctor Portal', scope: '"My schedule" and "my queue" scoped to the linked practitioner' },
]

const DOMAINS = [
  'tenant / security / identity / audit',
  'clinic / practitioner / catalog / patient',
  'scheduling (availability → slots)',
  'appointment (booking state machine)',
  'checkin / queue',
  'notification',
  'reporting',
]

export function SchedulIoPage() {
  const { setActiveProjectId } = useThemeAccent()
  const scramble = useTextScramble({ targetText: 'Schedul.io', durationMs: 1000 })

  useEffect(() => {
    setActiveProjectId('schedul_io')
    return () => setActiveProjectId(null)
  }, [setActiveProjectId])

  return (
    <main id="main-content" tabIndex={-1} className="space-y-12 pt-6 outline-none sm:space-y-16 sm:pt-8">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 sm:p-10">
        <div className="relative grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-start lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Multi-tenant SaaS · Clinic Operations
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
            <h3 className="text-sm font-semibold text-[var(--global-text)]">Build snapshot</h3>
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

      <Section id="schedul-problem" kicker="// PROBLEM" title="Phone-call scheduling doesn't scale">
        <div className="grid gap-6 md:grid-cols-2">
          <p className="text-[var(--global-text-muted)]">{project.problem}</p>
          <p className="text-[var(--global-text-muted)]">{project.solution}</p>
        </div>
      </Section>

      <Section id="schedul-apps" kicker="// THREE FRONTENDS" title="One API, three role-scoped SPAs">
        <div className="grid gap-5 md:grid-cols-3">
          {APPS.map((app) => (
            <TiltCard key={app.name}>
              <div className="h-full p-6">
                <Users className="h-5 w-5 text-[var(--accent-primary)]" aria-hidden />
                <h3 className="mt-3 text-base font-semibold text-[var(--global-text)]">{app.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--global-text-muted)]">{app.scope}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>

      <Section id="schedul-architecture" kicker="// ARCHITECTURE" title="Package-by-domain modular monolith">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <p className="text-[var(--global-text-muted)]">{project.architectureSummary}</p>
            <ul className="flex flex-wrap gap-2" aria-label="Domain packages">
              {DOMAINS.map((d) => (
                <li
                  key={d}
                  className="rounded-full border border-[var(--global-border)] px-3 py-1 font-[var(--font-mono)] text-[10px] text-[var(--global-text)]"
                >
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <TiltCard>
            <BorderTrace>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--global-border)] p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--global-text)]">
                  <Lock className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden />
                  Tenant isolation, enforced at persistence
                </div>
                <p className="text-sm leading-relaxed text-[var(--global-text-muted)]">{project.challenge}</p>
              </div>
            </BorderTrace>
          </TiltCard>
        </div>
      </Section>

      <Section id="schedul-decisions" kicker="// ENGINEERING DECISIONS" title="One pipeline, honest boundaries">
        <div className="grid gap-5 md:grid-cols-2">
          {project.decisions.map((d) => (
            <TiltCard key={d.title}>
              <div className="h-full p-6">
                <Radio className="h-5 w-5 text-[var(--accent-secondary)]" aria-hidden />
                <h3 className="mt-3 text-base font-semibold text-[var(--global-text)]">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--global-text-muted)]">{d.detail}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>

      <Section id="schedul-stack" kicker="// STACK" title="Java/Spring backend, three React frontends">
        <div className="grid gap-4 sm:grid-cols-2">
          {project.stack.map((s) => (
            <div key={s.name} className="rounded-xl border border-[var(--global-border)] p-5">
              <p className="text-sm font-semibold text-[var(--global-text)]">{s.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--global-text-muted)]">{s.reason}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="schedul-lessons" kicker="// LESSONS" title="What held up under concurrency">
        <ul className="space-y-3 text-[var(--global-text-muted)]">
          {project.lessonsLearned.map((lesson) => (
            <li key={lesson} className="flex gap-2">
              <span className="text-[var(--accent-primary)]">—</span>
              <span>{lesson}</span>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex justify-end border-t border-[var(--global-border)] pt-6">
          <Link to="/projects/mashhub" className="inline-flex items-baseline gap-2 text-sm font-medium text-[var(--accent-primary)]">
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--global-text-muted)]">
              Next project
            </span>
            <DrawUnderline color="var(--accent-primary)">MashHub: Music Matcher &amp; Database</DrawUnderline>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </Section>
    </main>
  )
}
