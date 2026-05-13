import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { SongSelector } from './SongSelector'
import { MatchResults } from './MatchResults'
import { affinityTier, buildReason, matchScore, type Song } from './fuzzyEngine'
import { DEMO_SONGS } from './songs'

export function LiveDemoWidget() {
  const reduce = usePrefersReducedMotion()
  const [selectedId, setSelectedId] = useState<string>(DEMO_SONGS[0]?.id ?? '')

  const targetSong: Song | undefined = useMemo(
    () => DEMO_SONGS.find((s) => s.id === selectedId),
    [selectedId],
  )

  const results = useMemo(() => {
    if (!targetSong) return []
    return DEMO_SONGS.filter((s) => s.id !== targetSong.id)
      .map((song) => {
        const outcome = matchScore(targetSong, song)
        return {
          song,
          outcome,
          tier: affinityTier(outcome.score),
          reason: buildReason(outcome),
        }
      })
      .sort((a, b) => b.outcome.score - a.outcome.score)
  }, [targetSong])

  return (
    <section
      className="relative px-6 py-24 sm:px-10 sm:py-28 lg:px-16"
      aria-labelledby="mashhub-demo-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-3">
          <p className="mh-mono text-xs uppercase tracking-[0.3em] text-[var(--mashhub-neon)]">
            // live in your browser
          </p>
          <h2
            id="mashhub-demo-title"
            className="mh-display max-w-3xl text-3xl font-semibold tracking-tight text-[var(--mashhub-text)] sm:text-4xl md:text-5xl"
          >
            Run the engine on a real dataset
          </h2>
          <p className="max-w-3xl text-base text-[var(--mashhub-text-muted)]">
            Pick a target song. The Sugeno engine matches it against the other five — at the section level — in your
            browser. No server, no model download, no API call. The math you saw above, applied to data.
          </p>
        </div>

        <motion.div
          className="grid gap-6 rounded-[var(--radius-project)] border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-surface)]/40 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:p-8"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <SongSelector songs={DEMO_SONGS} selectedId={selectedId} onSelect={setSelectedId} />
          {targetSong ? (
            <MatchResults targetSong={targetSong} results={results} />
          ) : (
            <p className="mh-mono text-sm text-[var(--mashhub-text-muted)]">Pick a song to begin.</p>
          )}
        </motion.div>

        <p className="mh-mono mt-6 max-w-3xl text-xs text-[var(--mashhub-text-dim)]">
          score = (avg BPM μ × 0.45) + (avg key μ × 0.45) + 0.10 base offset · per-section pairs averaged · HIGH &gt;
          0.70, MEDIUM 0.40&ndash;0.70, LOW &lt; 0.40
        </p>
      </div>
    </section>
  )
}
