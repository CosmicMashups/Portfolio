import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

interface Layer {
  id: string
  index: number
  name: string
  tags: string[]
  description: string
  accent: 'blue' | 'violet' | 'neon' | 'amber' | 'pink'
}

const LAYERS: Layer[] = [
  {
    id: 'presentation',
    index: 1,
    name: 'Presentation Layer',
    tags: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts'],
    description:
      'The UI surface. Component-driven, animated, dense by design. Renders the workspace, charts, Kanban, and Megamix Timeline views — all interactive at 60fps with motion deference built in.',
    accent: 'blue',
  },
  {
    id: 'domain',
    index: 2,
    name: 'Domain Layer',
    tags: ['songService', 'projectService', 'searchService', 'withFallback HOF'],
    description:
      'Pure-TypeScript service classes that coordinate data flow and orchestrate the backend split. Each operation routes through the withFallback higher-order function for transparent cloud/local failover.',
    accent: 'violet',
  },
  {
    id: 'matching',
    index: 3,
    name: 'Matching Layer',
    tags: ['Sugeno Fuzzy Engine', 'Fuse.js Text Search', 'SEMITONE lookup'],
    description:
      'Two AI systems coexist. Sugeno-type fuzzy inference for harmonic compatibility runs entirely in-browser; Fuse.js handles typo-tolerant text search across 5 weighted fields. Both deterministic, both interpretable.',
    accent: 'neon',
  },
  {
    id: 'data',
    index: 4,
    name: 'Data Access Layer',
    tags: ['Supabase (cloud)', 'Dexie 4 / IndexedDB (local)', 'ConnectionStatusDialog'],
    description:
      'Dual-backend resilience. A 5-second health check on startup picks the active mode. Mid-session failures fire a supabase:unavailable event, the UI silently switches, and no data is lost.',
    accent: 'amber',
  },
  {
    id: 'persistence',
    index: 5,
    name: 'Persistence Layer',
    tags: ['PostgreSQL', 'Health-check', 'Offline Mode', 'Guest Mode'],
    description:
      'PostgreSQL through Supabase for cloud writes; IndexedDB for offline operation. Guest mode bypasses auth entirely so the entire app remains functional with zero connectivity.',
    accent: 'pink',
  },
]

const ACCENT_COLORS: Record<Layer['accent'], { fg: string; bg: string; border: string; glow: string }> = {
  blue: {
    fg: 'var(--mashhub-accent)',
    bg: 'var(--mashhub-accent-dim)',
    border: 'var(--mashhub-accent-glow)',
    glow: 'rgba(77, 166, 255, 0.3)',
  },
  violet: {
    fg: 'var(--mashhub-electric)',
    bg: 'var(--mashhub-electric-dim)',
    border: 'rgba(139, 92, 246, 0.4)',
    glow: 'rgba(139, 92, 246, 0.3)',
  },
  neon: {
    fg: 'var(--mashhub-neon)',
    bg: 'var(--mashhub-neon-dim)',
    border: 'rgba(6, 255, 165, 0.4)',
    glow: 'rgba(6, 255, 165, 0.25)',
  },
  amber: {
    fg: 'var(--mashhub-warn)',
    bg: 'var(--mashhub-warn-dim)',
    border: 'rgba(244, 190, 92, 0.4)',
    glow: 'rgba(244, 190, 92, 0.25)',
  },
  pink: {
    fg: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.14)',
    border: 'rgba(236, 72, 153, 0.4)',
    glow: 'rgba(236, 72, 153, 0.25)',
  },
}

function WithFallbackSnippet() {
  return (
    <div className="rounded-md border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-bg)] p-3">
      <p className="mh-mono mb-2 text-[10px] uppercase tracking-[0.22em] text-[var(--mashhub-text-dim)]">
        withFallback HOF
      </p>
      <pre className="mh-mono overflow-x-auto text-[12px] leading-relaxed text-[var(--mashhub-text)]">
        <code>
{`const result = await withFallback(
  () => `}<span style={{ color: 'var(--mashhub-accent)' }}>{`supabaseOp()`}</span>{`,  `}<span style={{ color: 'var(--mashhub-text-dim)' }}>{`// try cloud first`}</span>{`
  () => `}<span style={{ color: 'var(--mashhub-neon)' }}>{`localOp()`}</span>{`       `}<span style={{ color: 'var(--mashhub-text-dim)' }}>{`// silent fallback`}</span>{`
);`}
        </code>
      </pre>
    </div>
  )
}

function LayerCard({ layer, idx }: { layer: Layer; idx: number }) {
  const [expanded, setExpanded] = useState(false)
  const reduce = usePrefersReducedMotion()
  const accent = ACCENT_COLORS[layer.accent]

  return (
    <motion.div
      className="mh-glow-card relative w-full overflow-hidden rounded-[var(--radius-project)] border bg-[color:var(--mashhub-surface)]"
      style={{ borderColor: accent.border }}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        className="mh-focus-ring block w-full p-5 text-left sm:p-6"
        aria-expanded={expanded}
        aria-controls={`mashhub-layer-${layer.id}-detail`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="flex items-start gap-4">
            <div
              className="mh-mono flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-sm font-bold"
              style={{
                backgroundColor: accent.bg,
                color: accent.fg,
                boxShadow: `0 0 18px ${accent.glow}`,
              }}
              aria-hidden
            >
              0{layer.index}
            </div>
            <div className="min-w-0">
              <h3 className="mh-display text-base font-semibold tracking-tight sm:text-lg" style={{ color: accent.fg }}>
                {layer.name}
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {layer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="mh-mono rounded-full border px-2 py-0.5 text-[10px] text-[var(--mashhub-text-muted)]"
                    style={{ borderColor: 'var(--mashhub-border)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <span
            className="mh-mono mt-1 inline-flex flex-shrink-0 items-center gap-1 text-[10px] uppercase tracking-[0.22em]"
            style={{ color: accent.fg }}
            aria-hidden
          >
            {expanded ? '−' : '+'} details
          </span>
        </div>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              id={`mashhub-layer-${layer.id}-detail`}
              key="detail"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduce ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 border-t border-[color:var(--mashhub-border)] pt-4">
                <p className="text-sm leading-relaxed text-[var(--mashhub-text-muted)]">{layer.description}</p>
                {layer.id === 'domain' ? <WithFallbackSnippet /> : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}

function ArrowConnector({ idx }: { idx: number }) {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.div
      className="flex justify-center py-1"
      initial={reduce ? false : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.4, delay: idx * 0.1 + 0.2 }}
      aria-hidden
    >
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
        <path d="M8 1 L8 14 M3 9 L8 14 L13 9" stroke="var(--mashhub-accent)" strokeOpacity={0.5} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  )
}

export function ArchitectureDiagram() {
  return (
    <section
      className="relative px-6 py-24 sm:px-10 sm:py-28 lg:px-16"
      aria-labelledby="mashhub-architecture-title"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 flex flex-col gap-3">
          <p className="mh-mono text-xs uppercase tracking-[0.3em] text-[var(--mashhub-accent)]">
            // system architecture
          </p>
          <h2
            id="mashhub-architecture-title"
            className="mh-display max-w-3xl text-3xl font-semibold tracking-tight text-[var(--mashhub-text)] sm:text-4xl md:text-5xl"
          >
            Five layers, one resilient stack
          </h2>
          <p className="max-w-2xl text-base text-[var(--mashhub-text-muted)]">
            Click or focus any layer to expand its responsibilities. The Domain Layer hosts the withFallback HOF — the
            single function that makes cloud-to-local failover invisible to the UI.
          </p>
        </div>

        <div className="space-y-1">
          {LAYERS.map((layer, idx) => (
            <div key={layer.id}>
              <LayerCard layer={layer} idx={idx} />
              {idx < LAYERS.length - 1 ? <ArrowConnector idx={idx} /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
