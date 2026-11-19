import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ExternalLink, FileText, ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ProjectEntry } from '@/config/projects.registry'
import { ProjectDeepDive } from '@/components/projects/ProjectDeepDive'
import { ProjectVizPeek } from '@/components/projects/ProjectVizPeek'
import { ProjectCircleLogo } from '@/components/projects/ProjectCircleLogo'
import { TiltCard } from '@/components/ui/TiltCard'
import { DrawUnderline } from '@/components/ui/DrawUnderline'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { researchPaperUrl } from '@/config/researchPapers'
import { cn } from '@/components/ui/cn'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

const IMAGE_CYCLE_MS = 1400

/**
 * Gallery card for the "What I've Built" chapter — one unified amber/near-black
 * chrome for every project (including AriMarket's home-page preview; its own
 * /projects/arimarket deep-dive route keeps its distinct terminal identity).
 * When a project has multiple `images`, hovering hover-cycles through them.
 */
export function ProjectGalleryCard({ project, index }: { project: ProjectEntry; index: number }) {
  const reduce = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [frame, setFrame] = useState(0)
  const cycleRef = useRef<number | null>(null)

  const images = project.images ?? (project.imageUrl ? [project.imageUrl] : [])
  const hasMultipleImages = images.length > 1

  useEffect(() => {
    if (!hovered || !hasMultipleImages || reduce) return
    cycleRef.current = window.setInterval(() => {
      setFrame((f) => (f + 1) % images.length)
    }, IMAGE_CYCLE_MS)
    return () => {
      if (cycleRef.current) window.clearInterval(cycleRef.current)
    }
  }, [hovered, hasMultipleImages, images.length, reduce])

  useEffect(() => {
    if (!hovered) setFrame(0)
  }, [hovered])

  const primaryMetric = project.metrics?.[0]
  const metricDecimals =
    primaryMetric && !Number.isInteger(primaryMetric.value) ? (primaryMetric.value < 10 ? 3 : 2) : 0
  const techStrip = project.stack.slice(0, 3)
  const manuscriptUrl = researchPaperUrl(project.id)
  const currentImage = images[frame] ?? images[0]

  return (
    <div
      id={project.id}
      data-project={project.id}
      className={cn('gallery-tile scroll-mt-28', open && 'col-span-full')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <TiltCard noBackdrop>
        <div className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-project)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] transition-colors hover:border-[var(--color-accent-primary)]/50 hover:shadow-[0_0_0_1px_rgba(255,107,26,0.15),0_12px_40px_rgba(0,0,0,0.35)]">
          <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-[var(--color-border-default)]">
            {currentImage ? (
              <img
                src={currentImage}
                alt={`${project.title} interface preview`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[var(--color-bg-elevated)]">
                <div className="w-full max-w-xs px-6 opacity-90">
                  <ProjectVizPeek viz={project.viz} />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  <ImageOff className="h-3 w-3" aria-hidden />
                  Image coming soon
                </div>
              </div>
            )}
            {hasMultipleImages && (
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1" aria-hidden>
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1 w-1 rounded-full transition-colors',
                      i === frame ? 'bg-[var(--color-accent-primary)]' : 'bg-white/30',
                    )}
                  />
                ))}
              </div>
            )}
            <ProjectCircleLogo
              projectId={project.id}
              className="absolute bottom-3 left-3 shadow-lg transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-primary)]">
                Project / {String(index + 1).padStart(2, '0')}
              </p>
              <span className="rounded-full border border-[var(--color-border-default)] px-2 py-0.5 text-[9.5px] text-[var(--color-text-muted)]">
                {project.complexity}
              </span>
            </div>

            <h3 className="font-[var(--font-display)] text-xl uppercase leading-tight tracking-[-0.01em] text-[var(--color-text-primary)]">
              <Link
                to={`/projects/${project.slug}`}
                data-cursor="link"
                className="rounded-sm outline-offset-2 transition-colors hover:text-[var(--color-accent-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-primary)]"
              >
                <DrawUnderline color="var(--color-accent-primary)">{project.title}</DrawUnderline>
              </Link>
            </h3>

            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{project.tagline}</p>

            {primaryMetric ? (
              <div className="inline-flex w-fit flex-col gap-0.5 rounded-[10px] border border-[var(--color-border-default)] px-3 py-2">
                <span className="text-[9.5px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  {primaryMetric.label}
                </span>
                <span className="font-[var(--font-display)] text-lg tabular-nums text-[var(--color-text-primary)]">
                  <KineticCounter value={primaryMetric.value} suffix={primaryMetric.suffix} decimals={metricDecimals} />
                </span>
              </div>
            ) : null}

            <ul className="flex flex-wrap gap-1.5" aria-label="Key technologies">
              {techStrip.map((item) => (
                <li
                  key={item.name}
                  className="rounded-full border border-[var(--color-border-default)] px-2 py-0.5 font-[var(--font-mono)] text-[9.5px] text-[var(--color-text-primary)]"
                >
                  {item.name}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={`/projects/${project.slug}`}
                data-cursor="link"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-default)] px-4 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]"
              >
                Full case study →
              </Link>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--color-accent-primary)] hover:underline"
                >
                  Live <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              ) : null}
              {manuscriptUrl ? (
                <a
                  href={manuscriptUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-1 text-xs text-[var(--color-accent-primary)] hover:underline"
                >
                  Paper <FileText className="h-3 w-3" aria-hidden />
                </a>
              ) : null}
              <button
                type="button"
                className="ml-auto inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
              >
                {open ? 'Collapse' : 'Expand'}
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden border-t border-[var(--color-border-default)]"
              >
                <div className="p-5">
                  <ProjectDeepDive project={project} />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </TiltCard>
    </div>
  )
}
