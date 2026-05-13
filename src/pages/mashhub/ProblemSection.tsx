import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

interface ProblemCard {
  tool: string
  headline: string
  gaps: string[]
}

const PROBLEMS: ProblemCard[] = [
  {
    tool: 'Tunebat / Musicstax',
    headline: 'Catalog-bound. J-Pop gaps. No sections.',
    gaps: [
      'Western-pop dominant catalog; broad genre blind spots',
      'Whole-song key + BPM averages only',
      'No structural awareness of Verse, Chorus, Bridge',
    ],
  },
  {
    tool: 'Mixed In Key / VirtualDJ',
    headline: '39% cross-platform key agreement. Modal scales undetected.',
    gaps: [
      'MIR research shows 39–50% cross-tool consistency',
      'Modal scales (Dorian, Phrygian) silently misclassified',
      'Compatibility logic stays opaque — black-box matching',
    ],
  },
  {
    tool: 'Discord Communities',
    headline: 'Manual lookup. No structure. Depends on community timing.',
    gaps: [
      'Crowd-sourced, unindexed, scattered across channels',
      'No part-specific filters; you read every message',
      'Latency depends on whoever happens to be online',
    ],
  },
]

export function ProblemSection() {
  const reduce = usePrefersReducedMotion()

  return (
    <section
      className="relative px-6 py-24 sm:px-10 sm:py-28 lg:px-16"
      aria-labelledby="mashhub-problem-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-3">
          <p className="mh-mono text-xs uppercase tracking-[0.3em] text-[var(--mashhub-danger)]">
            // problem space
          </p>
          <h2
            id="mashhub-problem-title"
            className="mh-display max-w-3xl text-3xl font-semibold tracking-tight text-[var(--mashhub-text)] sm:text-4xl md:text-5xl"
          >
            Why existing tools fall short
          </h2>
          <p className="max-w-2xl text-base text-[var(--mashhub-text-muted)]">
            DJs and mashup creators stitch together three half-solutions. None of them analyze music at the structural
            level where mashups actually live.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PROBLEMS.map((problem, idx) => (
            <motion.article
              key={problem.tool}
              className="mh-glow-card group relative overflow-hidden rounded-[var(--radius-project)] border border-[color:var(--mashhub-danger-dim)] bg-[color:var(--mashhub-surface)]/80 p-6"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70"
                style={{ background: 'radial-gradient(circle, var(--mashhub-danger), transparent 70%)' }}
                aria-hidden
              />

              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="mh-mono text-[11px] uppercase tracking-[0.22em] text-[var(--mashhub-danger)]">
                    {problem.tool}
                  </span>
                  <span
                    aria-hidden
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--mashhub-danger-dim)] text-[var(--mashhub-danger)]"
                  >
                    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 3 L13 13 M13 3 L3 13" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>

                <h3 className="mh-display text-lg font-semibold leading-snug text-[var(--mashhub-text)]">
                  <span className="line-through decoration-[color:var(--mashhub-danger)]/50 decoration-1 underline-offset-2">
                    {problem.headline}
                  </span>
                </h3>

                <ul className="space-y-2 text-sm text-[var(--mashhub-text-muted)]">
                  {problem.gaps.map((gap) => (
                    <li key={gap} className="flex gap-2">
                      <span className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-[var(--mashhub-danger)]" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          className="mh-display mh-glow-text mt-16 max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-[var(--mashhub-accent)] sm:text-3xl md:text-4xl"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          MashHub fixes this with interpretable fuzzy logic that matches at the structural level.
        </motion.p>
      </div>
    </section>
  )
}
