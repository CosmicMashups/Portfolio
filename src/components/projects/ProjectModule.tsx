import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ProjectEntry } from '@/config/projects.registry'
import type { ProjectId } from '@/config/project.types'
import { useThemeAccent } from '@/app/providers/useThemeAccent'
import { ProjectDeepDive } from '@/components/projects/ProjectDeepDive'
import { useTechnicalView } from '@/app/providers/useTechnicalView'
import { cn } from '@/components/ui/cn'
import { TiltCard } from '@/components/ui/TiltCard'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { PeekPreview } from '@/components/ui/PeekPreview'
import { DrawUnderline } from '@/components/ui/DrawUnderline'
import { useMagneticEffect } from '@/hooks/useMagneticEffect'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { ProjectVizPeek, ProjectVizPeekCaption } from '@/components/projects/ProjectVizPeek'

export function ProjectModule({
  project,
  registerNode,
}: {
  project: ProjectEntry
  registerNode?: (id: ProjectId, el: HTMLElement | null) => void
}) {
  const { technical } = useTechnicalView()
  const { setActiveProjectId } = useThemeAccent()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const diveRef = useMagneticEffect({ strength: 0.25 })

  const primaryMetric = project.metrics?.[0]
  const metricDecimals =
    primaryMetric && !Number.isInteger(primaryMetric.value)
      ? primaryMetric.value < 10
        ? 3
        : 2
      : 0

  useEffect(() => {
    registerNode?.(project.id, rootRef.current)
  }, [project.id, registerNode])

  const onIntersect = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
        setActiveProjectId(project.id)
      }
    },
    [project.id, setActiveProjectId],
  )

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(onIntersect),
      { threshold: [0.15, 0.35, 0.55] },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onIntersect])

  const techStrip = project.stack.slice(0, 4)

  return (
    <div ref={rootRef} data-project={project.id}>
      <TiltCard className="scroll-mt-28">
        <BorderTrace>
          <PeekPreview
            previewContent={
              <div className="flex h-full flex-col border-t border-[color:color-mix(in_oklab,var(--accent-primary)_22%,var(--global-border))] bg-[var(--global-surface)]/95 pt-1">
                <ProjectVizPeek viz={project.viz} />
                <div className="flex items-end justify-between gap-2 px-4 pb-2 pt-1">
                  <ProjectVizPeekCaption />
                  <span className="shrink-0 font-[var(--font-mono)] text-[9px] text-[var(--accent-primary)]">
                    /{project.slug}
                  </span>
                </div>
              </div>
            }
          >
            <div
              className={cn(
                'space-y-5 rounded-2xl border border-[color:color-mix(in_oklab,var(--accent-primary)_32%,var(--global-border))] bg-[color:color-mix(in_oklab,var(--surface-tint)_75%,var(--global-surface))] p-7 shadow-[0_0_40px_-16px_color-mix(in_oklab,var(--accent-primary)_28%,transparent)] transition-transform hover:-translate-y-0.5 md:p-8',
                project.id === 'mashhub' &&
                  'hover:shadow-[0_0_28px_-8px_color-mix(in_oklab,var(--accent-primary)_40%,transparent)]',
              )}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
                <div className="min-w-0">
                  <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--accent-primary)]">
                    Project / {project.id}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[var(--global-text)]">
                    <Link
                      to={`/projects/${project.slug}`}
                      data-cursor="link"
                      className="rounded-sm outline-offset-2 transition-colors hover:text-[var(--color-accent-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-primary)]"
                    >
                      <DrawUnderline color="var(--accent-primary)">{project.title}</DrawUnderline>
                    </Link>
                  </h3>
                  <p className="mt-1 font-[var(--font-mono)] text-[10px] tracking-wide text-[var(--global-text-muted)]">
                    /{project.slug}
                  </p>
                  {primaryMetric ? (
                    <div className="mt-3 inline-flex max-w-full flex-col gap-0.5 rounded-lg border border-[color:color-mix(in_oklab,var(--accent-primary)_35%,var(--global-border))] bg-[color:color-mix(in_oklab,var(--accent-primary)_10%,transparent)] px-3 py-2">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--global-text-muted)]">
                        {primaryMetric.label}
                      </span>
                      <span className="font-[var(--font-display)] text-lg font-semibold tabular-nums text-[var(--global-text)]">
                        <KineticCounter
                          value={primaryMetric.value}
                          suffix={primaryMetric.suffix}
                          decimals={metricDecimals}
                        />
                      </span>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-[var(--global-text-muted)]">{project.outcome}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2.5 md:max-w-[50%] md:justify-end">
                  <span className="rounded-full border border-[color:color-mix(in_oklab,var(--accent-primary)_25%,var(--global-border))] px-2 py-0.5 text-[11px] text-[var(--global-text-muted)]">
                    Complexity: {project.complexity}
                  </span>
                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[var(--accent-primary)] hover:underline"
                    >
                      Repository <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Key technologies">
                {techStrip.map((item) => (
                  <li
                    key={item.name}
                    className="rounded-full border border-[color:color-mix(in_oklab,var(--accent-primary)_38%,var(--global-border))] bg-[color:color-mix(in_oklab,var(--accent-primary)_8%,transparent)] px-2.5 py-1 font-[var(--font-mono)] text-[10px] text-[var(--global-text)]"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <Link
                  ref={diveRef.ref as never}
                  to={`/projects/${project.slug}`}
                  data-cursor="link"
                  className="text-sm font-medium text-[var(--color-accent-primary)] underline-offset-2 hover:underline"
                >
                  Full case study →
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-[var(--global-text-muted)]"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                >
                  {open ? 'Collapse fallback' : 'Expand fallback'}
                  <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden />
                </button>
              </div>
            </div>
          </PeekPreview>
        </BorderTrace>
      </TiltCard>

      {technical ? (
        <p className="mt-5 text-xs text-[var(--global-text-muted)]">
          Accent tokens derive from the design-system Markdown for this project; the global shell stays fixed so
          scanning stays predictable.
        </p>
      ) : null}

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <ProjectDeepDive project={project} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
