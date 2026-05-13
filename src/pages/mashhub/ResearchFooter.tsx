import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

const STACK = [
  'React 19',
  'TypeScript',
  'Supabase',
  'Dexie 4',
  'Fuse.js',
  'Recharts',
  '@dnd-kit',
  'ExcelJS',
  'Framer Motion',
  'Tailwind CSS',
  'Vitest',
  'Playwright',
]

const AUTHORS = ['Brown', 'Quitaneg', 'Rosalinas', 'Tan']

export function ResearchFooter() {
  const reduce = usePrefersReducedMotion()

  return (
    <section
      className="relative border-t border-[color:var(--mashhub-border)] px-6 py-20 sm:px-10 sm:py-24 lg:px-16"
      aria-labelledby="mashhub-research-title"
    >
      <div className="mx-auto max-w-4xl">
        <p className="mh-mono mb-4 text-xs uppercase tracking-[0.3em] text-[var(--mashhub-accent)]">
          // research context
        </p>

        <motion.blockquote
          className="relative rounded-[var(--radius-project)] border-l-2 border-[color:var(--mashhub-accent)] bg-[color:var(--mashhub-surface)]/60 p-6 sm:p-8"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="absolute -top-2 left-4 mh-mono text-[10px] uppercase tracking-[0.22em] text-[var(--mashhub-text-dim)]">
            <span className="bg-[color:var(--mashhub-bg)] px-2">thesis</span>
          </p>
          <p
            id="mashhub-research-title"
            className="mh-display text-lg italic leading-relaxed text-[var(--mashhub-text)] sm:text-xl"
          >
            “MashHub: An Intelligent Music Library Management System with Fuzzy Logic-Based Song Compatibility
            Matching.”
          </p>
          <p className="mh-mono mt-4 text-xs text-[var(--mashhub-text-muted)]">
            {AUTHORS.join(' · ')} — De La Salle University – Dasmariñas · May 2026
          </p>
          <p className="mh-mono mt-1 text-xs text-[var(--mashhub-text-dim)]">
            Special Topics in Artificial Intelligence
          </p>
        </motion.blockquote>

        <div className="mt-10">
          <p className="mh-mono mb-3 text-[11px] uppercase tracking-[0.22em] text-[var(--mashhub-text-dim)]">
            // tech stack
          </p>
          <div className="flex flex-wrap gap-2">
            {STACK.map((tech, idx) => (
              <motion.span
                key={tech}
                className="mh-mono rounded-full border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-surface)] px-3 py-1 text-[11px] text-[var(--mashhub-text-muted)]"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--mashhub-border)] pt-6">
          <p className="mh-mono text-[11px] uppercase tracking-[0.22em] text-[var(--mashhub-text-dim)]">
            <span className="text-[var(--mashhub-neon)]">●</span> end of case study
          </p>
          <Link
            to="/"
            className="mh-mono mh-focus-ring inline-flex items-center gap-2 rounded-full border border-[color:var(--mashhub-border-strong)] bg-[color:var(--mashhub-surface)] px-4 py-2 text-sm text-[var(--mashhub-accent)] transition-shadow hover:shadow-[0_0_18px_var(--mashhub-accent-glow)]"
          >
            <span aria-hidden>←</span>
            <span>back to portfolio</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
