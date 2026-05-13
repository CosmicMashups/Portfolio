import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import type { AffinityTier, MatchOutcome, Song } from './fuzzyEngine'

interface RankedResult {
  song: Song
  outcome: MatchOutcome
  tier: AffinityTier
  reason: string
}

interface MatchResultsProps {
  targetSong: Song
  results: RankedResult[]
}

const TIER_STYLES: Record<AffinityTier, { fg: string; bg: string; border: string; label: string }> = {
  HIGH: {
    fg: 'var(--mashhub-neon)',
    bg: 'var(--mashhub-neon-dim)',
    border: 'rgba(6, 255, 165, 0.4)',
    label: 'HIGH',
  },
  MEDIUM: {
    fg: 'var(--mashhub-warn)',
    bg: 'var(--mashhub-warn-dim)',
    border: 'rgba(244, 190, 92, 0.4)',
    label: 'MEDIUM',
  },
  LOW: {
    fg: 'var(--mashhub-danger)',
    bg: 'var(--mashhub-danger-dim)',
    border: 'rgba(244, 135, 135, 0.4)',
    label: 'LOW',
  },
}

export function MatchResults({ targetSong, results }: MatchResultsProps) {
  const reduce = usePrefersReducedMotion()

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="mh-mono text-[11px] uppercase tracking-[0.3em] text-[var(--mashhub-text-dim)]">
          // ranked matches against {targetSong.title}
        </p>
        <p className="mh-mono text-[10px] uppercase tracking-[0.2em] text-[var(--mashhub-text-dim)]">
          {results.length} candidate{results.length === 1 ? '' : 's'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={targetSong.id}
          className="space-y-3"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {results.map((result, idx) => {
            const tier = TIER_STYLES[result.tier]
            const scorePct = Math.round(result.outcome.score * 100)
            return (
              <motion.li
                key={result.song.id}
                className="overflow-hidden rounded-[var(--radius-project)] border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-surface)] p-4 sm:p-5"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="mh-mono text-[10px] font-semibold text-[var(--mashhub-text-dim)]">
                        #{idx + 1}
                      </span>
                      <p className="mh-display truncate text-base font-semibold text-[var(--mashhub-text)]">
                        {result.song.title}
                      </p>
                    </div>
                    <p className="truncate text-xs text-[var(--mashhub-text-muted)]">{result.song.artist}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="mh-mono inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                      style={{
                        color: tier.fg,
                        backgroundColor: tier.bg,
                        borderColor: tier.border,
                      }}
                      aria-label={`Affinity ${tier.label}`}
                    >
                      {tier.label}
                    </span>
                    <span className="mh-mono text-lg font-bold text-[var(--mashhub-accent)] sm:text-xl">
                      {scorePct}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[color:var(--mashhub-bg)]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      transformOrigin: 'left center',
                      background:
                        'linear-gradient(to right, var(--mashhub-accent), var(--mashhub-electric))',
                    }}
                    initial={reduce ? { scaleX: result.outcome.score } : { scaleX: 0 }}
                    animate={{ scaleX: result.outcome.score }}
                    transition={{ duration: 0.7, delay: idx * 0.1 + 0.15, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                <div className="mt-3 grid gap-2 text-[11px] sm:grid-cols-3">
                  <div className="rounded-md border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-bg)]/40 px-2.5 py-1.5">
                    <p className="mh-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mashhub-text-dim)]">
                      bpm μ
                    </p>
                    <p className="mh-mono text-sm font-semibold text-[var(--mashhub-accent)]">
                      {result.outcome.bpmMu.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-md border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-bg)]/40 px-2.5 py-1.5">
                    <p className="mh-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mashhub-text-dim)]">
                      key μ
                    </p>
                    <p className="mh-mono text-sm font-semibold text-[var(--mashhub-electric)]">
                      {result.outcome.keyMu.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-md border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-bg)]/40 px-2.5 py-1.5">
                    <p className="mh-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mashhub-text-dim)]">
                      pairs
                    </p>
                    <p className="mh-mono text-sm font-semibold text-[var(--mashhub-neon)]">
                      {result.outcome.pairs.length}
                    </p>
                  </div>
                </div>

                <p className="mh-mono mt-3 text-xs leading-relaxed text-[var(--mashhub-text-muted)]">
                  <span className="text-[var(--mashhub-text-dim)]">// reason:</span> {result.reason}
                </p>
              </motion.li>
            )
          })}
        </motion.ul>
      </AnimatePresence>
    </div>
  )
}
