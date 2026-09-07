import { useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ExternalLink, FileText, ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ProjectEntry } from '@/config/projects.registry'
import { ProjectDeepDive } from '@/components/projects/ProjectDeepDive'
import { ProjectVizPeek } from '@/components/projects/ProjectVizPeek'
import { ProjectCircleLogo } from '@/components/projects/ProjectCircleLogo'
import { DrawUnderline } from '@/components/ui/DrawUnderline'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { researchPaperUrl } from '@/config/researchPapers'
import { cn } from '@/components/ui/cn'
import { fadeInUp } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

/** Seed's supporting botanical palette — one distinct, harmonious tint per project. */
const CARD_ACCENTS = [
  { color: '#1c3a13' },
  { color: '#757c5d' },
  { color: '#9f995b' },
  { color: '#698e79' },
  { color: '#3a5c30' },
] as const

/**
 * Odd-indexed sections paint the Seed "dark section" surface (Forest Depths) so the
 * project list alternates white/dark-green down the page. Text/border/accent tokens
 * are overridden to Snow White + Lime here — independent of the light/dark toggle —
 * matching how CredibilityFooterBand treats the dark band as a fixed brand surface.
 */
const DARK_GREEN_TONE_VARS: CSSProperties = {
  background: '#1c3a13',
  color: '#fcfcf7',
  '--global-bg': '#1c3a13',
  '--global-surface': '#1c3a13',
  '--global-surface-elevated': '#24461f',
  '--global-border': 'rgba(252, 252, 247, 0.3)',
  '--global-text': '#fcfcf7',
  '--global-text-muted': 'rgba(252, 252, 247, 0.72)',
  '--accent-primary': '#d3fa99',
  '--color-accent-primary': '#d3fa99',
} as CSSProperties

/**
 * Even-indexed sections stay on Seed's light surface — explicitly pinned (not just
 * "unset") so the band reads correctly even when the site's own light/dark toggle is
 * set to dark, matching the dark-green band's fixed-surface treatment above.
 */
const LIGHT_TONE_VARS: CSSProperties = {
  background: '#fafffa',
  color: '#121613',
  '--global-bg': '#fafffa',
  '--global-surface': '#fafffa',
  '--global-surface-elevated': '#eeeee9',
  '--global-border': '#1c3a13',
  '--global-text': '#121613',
  '--global-text-muted': '#666666',
  '--accent-primary': '#1c3a13',
  '--color-accent-primary': '#1c3a13',
} as CSSProperties

export function ProjectFeature({ project, index }: { project: ProjectEntry; index: number }) {
  const reduce = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)
  const imageOnRight = index % 2 === 0
  const isDark = index % 2 === 1
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]
  const accentStyle = {
    '--card-accent': accent.color,
    ...(isDark ? DARK_GREEN_TONE_VARS : LIGHT_TONE_VARS),
  } as CSSProperties

  const primaryMetric = project.metrics?.[0]
  const metricDecimals =
    primaryMetric && !Number.isInteger(primaryMetric.value) ? (primaryMetric.value < 10 ? 3 : 2) : 0
  const techStrip = project.stack.slice(0, 4)
  const manuscriptUrl = researchPaperUrl(project.id)

  const imageColumn = (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] border"
      style={{ borderColor: 'color-mix(in oklab, var(--card-accent) 45%, var(--global-border))' }}
    >
      {project.imageUrl ? (
        <img src={project.imageUrl} alt={`${project.title} interface preview`} className="h-full w-full object-cover" />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-3"
          style={{ backgroundColor: 'color-mix(in oklab, var(--card-accent) 14%, var(--global-surface))' }}
        >
          <div className="w-full max-w-xs px-6 opacity-90">
            <ProjectVizPeek viz={project.viz} />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--global-text-muted)]">
            <ImageOff className="h-3 w-3" aria-hidden />
            Image coming soon
          </div>
        </div>
      )}
      <ProjectCircleLogo projectId={project.id} className="absolute bottom-4 left-4 shadow-lg" />
    </div>
  )

  const textColumn = (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">
          Project / 0{index + 1}
        </p>
        <span className="rounded-full border border-[var(--global-border)] px-2 py-0.5 text-[10px] text-[var(--global-text-muted)]">
          Complexity: {project.complexity}
        </span>
      </div>

      <h3 className="font-[var(--font-display)] text-3xl font-semibold leading-tight tracking-tight text-[var(--global-text)] md:text-4xl">
        <Link
          to={`/projects/${project.slug}`}
          data-cursor="link"
          className="rounded-sm outline-offset-2 transition-colors hover:text-[var(--color-accent-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-primary)]"
        >
          <DrawUnderline color="var(--accent-primary)">{project.title}</DrawUnderline>
        </Link>
      </h3>

      <p className="text-base leading-relaxed text-[var(--global-text-muted)]">{project.tagline}</p>

      {primaryMetric ? (
        <div className="inline-flex w-fit flex-col gap-0.5 rounded-[12px] border border-[var(--global-border)] px-4 py-2.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--global-text-muted)]">
            {primaryMetric.label}
          </span>
          <span className="font-[var(--font-display)] text-xl font-semibold tabular-nums text-[var(--global-text)]">
            <KineticCounter value={primaryMetric.value} suffix={primaryMetric.suffix} decimals={metricDecimals} />
          </span>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-[var(--global-text-muted)]">{project.outcome}</p>
      )}

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

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Link
          to={`/projects/${project.slug}`}
          data-cursor="link"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--global-border)] px-5 py-2 text-sm font-medium text-[var(--global-text)] transition-colors hover:text-[var(--color-accent-primary)]"
        >
          Full case study →
        </Link>
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[var(--accent-primary)] hover:underline"
          >
            Live site <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        ) : null}
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
        {manuscriptUrl ? (
          <a
            href={manuscriptUrl}
            target="_blank"
            rel="noreferrer"
            download
            className="inline-flex items-center gap-1 text-xs text-[var(--accent-primary)] hover:underline"
          >
            Paper <FileText className="h-3 w-3" aria-hidden />
          </a>
        ) : null}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs text-[var(--global-text-muted)]"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? 'Collapse details' : 'Expand details'}
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden />
        </button>
      </div>
    </div>
  )

  return (
    <motion.div
      data-project={project.id}
      data-tone={isDark ? 'dark' : 'light'}
      style={accentStyle}
      className={cn(
        // Full-bleed breakout so the alternating tone spans edge-to-edge, same trick as
        // Section's own bleed — content width/padding is reapplied by the inner wrapper.
        'relative left-1/2 right-1/2 -mx-[50vw] w-screen scroll-mt-28 py-14 md:py-16',
      )}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, margin: '-15% 0px' }}
      variants={fadeInUp}
    >
      <div className="mx-auto max-w-[var(--shell-content-max-width)] px-[var(--shell-gutter-sm)] sm:px-[var(--shell-gutter-md)] lg:px-[var(--shell-gutter-lg)]">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className={imageOnRight ? 'lg:order-2' : 'lg:order-1'}>{imageColumn}</div>
          <div className={imageOnRight ? 'lg:order-1' : 'lg:order-2'}>{textColumn}</div>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="mt-8">
                <ProjectDeepDive project={project} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
