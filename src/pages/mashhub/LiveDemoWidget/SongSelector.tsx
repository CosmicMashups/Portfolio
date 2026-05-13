import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import type { Song } from './fuzzyEngine'

interface SongSelectorProps {
  songs: Song[]
  selectedId: string
  onSelect: (id: string) => void
}

export function SongSelector({ songs, selectedId, onSelect }: SongSelectorProps) {
  const reduce = usePrefersReducedMotion()

  return (
    <div className="space-y-3">
      <p className="mh-mono text-[11px] uppercase tracking-[0.3em] text-[var(--mashhub-text-dim)]">
        // select target
      </p>
      <ul className="space-y-2" role="listbox" aria-label="Pick a target song">
        {songs.map((song, idx) => {
          const isSelected = song.id === selectedId
          const avgBpm = Math.round(song.sections.reduce((acc, s) => acc + s.bpm, 0) / song.sections.length)
          const keys = Array.from(new Set(song.sections.map((s) => s.key))).join(' / ')
          return (
            <li key={song.id} role="option" aria-selected={isSelected}>
              <motion.button
                type="button"
                onClick={() => onSelect(song.id)}
                className={`mh-focus-ring mh-glow-card w-full rounded-[var(--radius-project)] border bg-[color:var(--mashhub-surface)] p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-[color:var(--mashhub-accent)] shadow-[0_0_20px_var(--mashhub-accent-glow)]'
                    : 'border-[color:var(--mashhub-border)] hover:border-[color:var(--mashhub-border-strong)]'
                }`}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`mh-display truncate text-sm font-semibold sm:text-base ${
                        isSelected ? 'text-[var(--mashhub-accent)]' : 'text-[var(--mashhub-text)]'
                      }`}
                    >
                      {song.title}
                    </p>
                    <p className="truncate text-xs text-[var(--mashhub-text-muted)]">{song.artist}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="mh-mono text-xs font-semibold text-[var(--mashhub-accent)]">{avgBpm} BPM</p>
                    <p className="mh-mono text-[10px] text-[var(--mashhub-text-dim)]">{keys}</p>
                  </div>
                </div>
                {isSelected ? (
                  <div className="mt-3 flex gap-1.5">
                    {song.sections.map((s, sIdx) => (
                      <span
                        key={`${song.id}-${s.part}-${sIdx}`}
                        className="mh-mono rounded-sm border border-[color:var(--mashhub-accent-glow)] bg-[color:var(--mashhub-accent-dim)] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.15em] text-[var(--mashhub-accent)]"
                      >
                        {s.part} · {s.bpm} · {s.key}
                      </span>
                    ))}
                  </div>
                ) : null}
              </motion.button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
