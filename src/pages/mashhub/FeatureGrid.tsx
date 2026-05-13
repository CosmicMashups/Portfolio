import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

interface Feature {
  id: string
  title: string
  description: string
  icon: ReactNode
}

function SectionIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="2" y="10" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="6" width="6" height="22" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="18" y="12" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="26" y="14" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function DualIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="11" cy="16" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="21" cy="16" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 12 L13 16 L15 14 L17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function OfflineIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M6 12 Q 16 4, 26 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 16 Q 16 10, 23 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
      <path d="M12 20 Q 16 16, 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
      <circle cx="16" cy="24" r="2" fill="currentColor" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M5 7 L27 7 L20 16 L20 25 L12 22 L12 16 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function KanbanIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="3" y="6" width="7" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12.5" y="6" width="7" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="22" y="6" width="7" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ReasonIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M5 22 L5 8 L27 8 L27 22 L19 22 L16 26 L13 22 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 13 L22 13 M10 17 L18 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const FEATURES: Feature[] = [
  {
    id: 'section-level',
    title: 'Section-Level Matching',
    description: 'BPM and key stored per Verse, Chorus, Bridge. Not averaged across the whole song.',
    icon: <SectionIcon />,
  },
  {
    id: 'dual-ai',
    title: 'Dual-Intelligence Search',
    description: 'Fuse.js for text. Custom Sugeno engine for harmony. Two separate AI systems running in parallel.',
    icon: <DualIcon />,
  },
  {
    id: 'offline',
    title: 'Offline-First Architecture',
    description: 'Supabase fails? Auto-switch to IndexedDB. No data loss. No UI errors. No retry boilerplate.',
    icon: <OfflineIcon />,
  },
  {
    id: 'filters',
    title: 'Part-Specific Filter Blocks',
    description: 'Filter: Verse in E Major AND Chorus BPM 120–130. Combinable, stacked, expressive.',
    icon: <FilterIcon />,
  },
  {
    id: 'views',
    title: 'Kanban + Megamix Views',
    description: 'Projects render as Kanban boards or timeline sequences. Drag-and-drop powered by @dnd-kit.',
    icon: <KanbanIcon />,
  },
  {
    id: 'reasons',
    title: 'Linguistic Match Reasons',
    description: '"Chorus keys are 1 semitone apart." Human-readable AI, not just an opaque score.',
    icon: <ReasonIcon />,
  },
]

export function FeatureGrid() {
  const reduce = usePrefersReducedMotion()

  return (
    <section
      className="relative px-6 py-24 sm:px-10 sm:py-28 lg:px-16"
      aria-labelledby="mashhub-features-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-3">
          <p className="mh-mono text-xs uppercase tracking-[0.3em] text-[var(--mashhub-electric)]">
            // feature surface
          </p>
          <h2
            id="mashhub-features-title"
            className="mh-display max-w-3xl text-3xl font-semibold tracking-tight text-[var(--mashhub-text)] sm:text-4xl md:text-5xl"
          >
            Six things you can&rsquo;t do anywhere else
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, idx) => (
            <motion.article
              key={feature.id}
              className="mh-glow-card group relative overflow-hidden rounded-[var(--radius-project)] border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-surface)] p-6"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-1 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                style={{ backgroundColor: 'var(--mashhub-accent)' }}
                aria-hidden
              />

              <div className="relative flex items-start gap-4">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-[color:var(--mashhub-accent-glow)] bg-[color:var(--mashhub-accent-dim)] text-[var(--mashhub-accent)] transition-shadow duration-300 group-hover:shadow-[0_0_20px_var(--mashhub-accent-glow)]"
                  aria-hidden
                >
                  <div className="h-7 w-7">{feature.icon}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mh-display text-base font-semibold text-[var(--mashhub-text)] sm:text-lg">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--mashhub-text-muted)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
