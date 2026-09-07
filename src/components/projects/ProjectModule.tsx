import { useCallback, useEffect, useRef, useState, memo, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ExternalLink, FileText } from 'lucide-react'
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
import { ProjectCircleLogo } from '@/components/projects/ProjectCircleLogo'
import { researchPaperUrl } from '@/config/researchPapers'

type ProjectModuleProps = {
  project: ProjectEntry
  /** Position within the carousel — drives the per-card Seed accent tint and image-layout variant. */
  index?: number
  registerNode?: (id: ProjectId, el: HTMLElement | null) => void
}

/** Seed's supporting botanical palette — one distinct, harmonious tint per card. */
const CARD_ACCENTS = [
  { name: 'Forest Depths', color: '#1c3a13' },
  { name: 'Sage Moss', color: '#757c5d' },
  { name: 'Olive Gold', color: '#9f995b' },
  { name: 'Eucalyptus', color: '#698e79' },
  { name: 'Forest Depths (muted)', color: '#3a5c30' },
] as const

/** Alternates where the image area sits so the five cards don't feel stamped from one template. */
type ImageLayout = 'top-band' | 'side-panel' | 'full-bleed-top'
const IMAGE_LAYOUTS: ImageLayout[] = ['top-band', 'side-panel', 'full-bleed-top']

export const ProjectModule = memo(function ProjectModule({ project, index = 0, registerNode }: ProjectModuleProps) {
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
  const manuscriptUrl = researchPaperUrl(project.id)
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]
  const imageLayout = IMAGE_LAYOUTS[index % IMAGE_LAYOUTS.length]
  const accentStyle = { '--card-accent': accent.color } as CSSProperties

  const imageArea = (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'color-mix(in oklab, var(--card-accent) 16%, var(--global-surface))' }}
    >
      <ProjectVizPeek viz={project.viz} />
      <ProjectCircleLogo projectId={project.id} className="absolute bottom-3 left-3" />
    </div>
  )

  return (
    <div ref={rootRef} data-project={project.id} style={accentStyle}>
      <TiltCard className="scroll-mt-28 flex flex-col">
        <BorderTrace>
          <div
            className="flex h-full flex-col overflow-hidden rounded-[16px] border transition-transform hover:-translate-y-0.5"
            style={{ borderColor: 'color-mix(in oklab, var(--card-accent) 45%, var(--global-border))', backgroundColor: 'var(--global-surface)' }}
          >
            {imageLayout === 'full-bleed-top' ? <div className="h-40">{imageArea}</div> : null}
            <div className={imageLayout === 'side-panel' ? 'flex flex-1' : 'flex flex-1 flex-col'}>
              {imageLayout === 'top-band' ? <div className="h-28">{imageArea}</div> : null}
              {imageLayout === 'side-panel' ? <div className="hidden w-28 shrink-0 sm:block">{imageArea}</div> : null}
              <div className="flex-1">
            <PeekPreview
              previewContent={
                <div className="flex h-full flex-col border-t border-[var(--global-border)] bg-[var(--global-surface)]/95 pt-1">
                  <ProjectVizPeek viz={project.viz} />
                  <div className="flex items-end justify-between gap-2 px-4 pb-2 pt-1">
                    <ProjectVizPeekCaption />
                    <span className="shrink-0 font-[var(--font-mono)] text-[9px] text-[var(--global-text-muted)]">
                      /{project.slug}
                    </span>
                  </div>
                </div>
              }
            >
              <div className="space-y-5 p-7 md:p-8">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-5">
                  <div className="flex min-w-0 flex-1 gap-4 sm:gap-5">
                    <ProjectCircleLogo projectId={project.id} className="mt-0.5 shrink-0" />
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
                        <div className="mt-3 inline-flex max-w-full flex-col gap-0.5 rounded-[10px] border border-[var(--global-border)] px-3 py-2">
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
                  </div>
                  <div
                    className="flex max-w-full shrink-0 flex-col items-start gap-1.5 self-start lg:max-w-none lg:flex-row lg:flex-wrap lg:items-center lg:gap-2 lg:pl-1"
                    aria-label="Complexity and external links"
                  >
                    <span className="shrink-0 rounded-full border border-[var(--global-border)] px-2 py-0.5 text-[11px] text-[var(--global-text-muted)]">
                      Complexity: {project.complexity}
                    </span>
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-[var(--accent-primary)] hover:underline"
                      >
                        Live site <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    ) : null}
                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-[var(--accent-primary)] hover:underline"
                      >
                        Repository <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    ) : null}
                    {manuscriptUrl ? (
                      <a
                        href={manuscriptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-[var(--accent-primary)] hover:underline"
                        download
                      >
                        Paper <FileText className="h-3 w-3" aria-hidden />
                      </a>
                    ) : null}
                  </div>
                </div>
                <ul className="flex flex-wrap gap-2" aria-label="Key technologies">
                  {techStrip.map((item) => (
                    <li
                      key={item.name}
                      className="rounded-full border border-[var(--global-border)] px-2.5 py-1 font-[var(--font-mono)] text-[10px] text-[var(--global-text)]"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </PeekPreview>
            <div className="relative z-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-[var(--global-border)] bg-[var(--global-surface)] px-7 py-5 md:px-8">
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
            </div>
          </div>
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
},
  (prev, next) =>
    prev.project.id === next.project.id && prev.registerNode === next.registerNode && prev.index === next.index,
)
