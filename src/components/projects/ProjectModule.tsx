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
import { RevealText } from '@/components/ui/RevealText'
import { useMagneticEffect } from '@/hooks/useMagneticEffect'

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

  return (
    <div ref={rootRef} data-project={project.id}>
      <TiltCard className="scroll-mt-28">
        <BorderTrace>
          <PeekPreview
            previewContent={
              <div className="flex h-full items-end justify-between px-5 py-3.5 text-xs text-[var(--color-text-secondary)]">
                <span>Architecture depth</span>
                <span>{project.stack[0]?.name}</span>
              </div>
            }
          >
            <div
              className={cn(
                'space-y-5 rounded-2xl border border-[var(--global-border)] bg-[var(--global-surface)]/60 p-7 md:p-8 transition-transform hover:-translate-y-0.5',
                project.id === 'mashhub' && 'hover:shadow-[0_0_24px_-4px_color-mix(in_oklab,var(--accent-primary)_35%,transparent)]',
              )}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                    Project / {project.id}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[var(--global-text)]">
                    <Link
                      to={`/projects/${project.slug}`}
                      data-cursor="link"
                      className="rounded-sm outline-offset-2 transition-colors hover:text-[var(--color-accent-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-primary)]"
                    >
                      <RevealText>{project.title}</RevealText>
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-[var(--global-text-muted)]">
                    <DrawUnderline>{project.personalHook}</DrawUnderline>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 md:max-w-[50%] md:justify-end">
                  <span className="rounded-full border border-[var(--global-border)] px-2 py-0.5 text-[11px] text-[var(--global-text-muted)]">
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
              <div className="flex flex-wrap gap-2.5">
                {project.stack.map((item) => (
                  <span key={item.name} className="rounded-full border border-[var(--color-border-subtle)] px-2 py-1 text-xs">
                    {item.name}
                  </span>
                ))}
              </div>
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
