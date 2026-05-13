import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

const CLUSTERS = [
  {
    id: 'ai',
    title: 'AI / ML',
    items: ['Experiment design', 'Evaluation', 'Deployability'],
    x: 60,
    y: 70,
  },
  {
    id: 'fs',
    title: 'Full-stack',
    items: ['Contracts', 'State', 'Operational UX'],
    x: 220,
    y: 70,
  },
  {
    id: 'cr',
    title: 'Creative systems',
    items: ['Tooling', 'Media workflows', 'Expressive UI'],
    x: 380,
    y: 70,
  },
] as const

export function CapabilityClusters() {
  const reduce = usePrefersReducedMotion()

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--global-surface)]/50 p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--global-text-muted)]">
        Capability clusters
      </p>
      <svg viewBox="0 0 480 200" className="h-auto w-full text-[var(--accent-primary)]" aria-hidden>
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 z" fill="currentColor" opacity="0.5" />
          </marker>
        </defs>
        <path
          d="M 60 70 C 120 30, 180 110, 220 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.35"
          markerEnd="url(#arrow)"
        />
        <path
          d="M 220 70 C 280 30, 320 110, 380 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.35"
          markerEnd="url(#arrow)"
        />
        {CLUSTERS.map((c, i) => (
          <motion.g
            key={c.id}
            data-cursor="hover"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <rect
              x={c.x - 52}
              y={c.y - 28}
              width={104}
              height={84}
              rx={12}
              fill="color-mix(in oklab, var(--accent-primary) 14%, transparent)"
              stroke="currentColor"
              strokeOpacity="0.4"
            />
            <text
              x={c.x}
              y={c.y - 8}
              textAnchor="middle"
              fill="var(--global-text)"
              fontSize="12"
              fontWeight="600"
            >
              {c.title}
            </text>
            {c.items.map((line, j) => (
              <text
                key={line}
                x={c.x}
                y={c.y + 8 + j * 14}
                textAnchor="middle"
                fill="var(--global-text-muted)"
                fontSize="10"
              >
                {line}
              </text>
            ))}
          </motion.g>
        ))}
      </svg>
      <p className="mt-2 text-xs text-[var(--global-text-muted)]">
        Diagram semantics: flows show dependency of product UX on ML rigor and vice versa — not three silos.
      </p>
    </div>
  )
}
