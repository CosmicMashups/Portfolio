import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTextScramble } from '@/hooks/useTextScramble'
import { RevealText } from '@/components/ui/RevealText'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

interface StatTile {
  value: string
  label: string
}

const STATS: StatTile[] = [
  { value: '2-Layer AI', label: 'fuzzy text + harmonic engine' },
  { value: '5-Level', label: 'presentation → persistence' },
  { value: 'Section-Level', label: 'matching precision' },
]

function SpectrumBackdrop() {
  const reduce = usePrefersReducedMotion()

  const bars = useMemo(
    () =>
      Array.from({ length: 64 }).map((_, idx) => {
        const seed = (idx * 9301 + 49297) % 233280
        const height = 18 + ((seed / 233280) * 82)
        const delay = (idx % 16) * 0.08
        return { idx, height, delay }
      }),
    [],
  )

  const waveformPath = useMemo(() => {
    const points = Array.from({ length: 80 }).map((_, idx) => {
      const x = (idx / 79) * 1600
      const phase = idx * 0.22
      const y = 100 + Math.sin(phase) * 30 + Math.sin(phase * 1.7) * 14
      return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="mh-grid-backdrop absolute inset-0 opacity-50" />

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-30 mix-blend-screen">
        <svg viewBox="0 0 1600 200" className="h-[320px] w-[200%]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mh-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4da6ff" stopOpacity="0" />
              <stop offset="35%" stopColor="#4da6ff" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#8b5cf6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#06ffa5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g
            data-mh-animate="true"
            style={
              reduce
                ? undefined
                : {
                    animation: 'mh-waveform-drift 18s linear infinite',
                  }
            }
          >
            <path d={waveformPath} fill="none" stroke="url(#mh-wave-grad)" strokeWidth={1.5} />
            <path
              d={waveformPath}
              fill="none"
              stroke="url(#mh-wave-grad)"
              strokeWidth={1.5}
              transform="translate(1600 0)"
            />
          </g>
        </svg>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex h-44 items-end justify-center gap-[3px] px-4 opacity-60">
        {bars.map((bar) => (
          <span
            key={bar.idx}
            data-mh-animate="true"
            className="block w-[6px] rounded-t-sm"
            style={{
              height: `${bar.height}px`,
              background:
                'linear-gradient(to top, rgba(77, 166, 255, 0.55), rgba(139, 92, 246, 0.35) 60%, transparent)',
              animation: reduce ? undefined : `mh-equalize ${1.4 + (bar.idx % 5) * 0.18}s ease-in-out infinite`,
              animationDelay: `${bar.delay}s`,
              transformOrigin: 'bottom center',
            }}
          />
        ))}
      </div>

      <div
        className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(77, 166, 255, 0.45), transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-24 right-[-10%] h-[360px] w-[360px] rounded-full opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 70%)',
        }}
      />
    </div>
  )
}

function ScrambledStat({ value }: { value: string }) {
  const { displayText, ref } = useTextScramble({ targetText: value })
  return (
    <span ref={ref} className="mh-mono text-2xl font-semibold text-[var(--mashhub-accent)] md:text-3xl">
      {displayText}
    </span>
  )
}

export function HeroBand() {
  const titleScramble = useTextScramble({ targetText: 'MASHHUB' })
  const reduce = usePrefersReducedMotion()

  return (
    <section
      className="relative flex min-h-[calc(100svh-var(--shell-header-height)-2.5rem)] flex-col items-center justify-center overflow-hidden px-6 py-20 sm:px-10 sm:py-24 lg:px-16"
      aria-labelledby="mashhub-hero-title"
    >
      <SpectrumBackdrop />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <p className="mh-mono mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-surface)]/60 px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-[var(--mashhub-accent)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--mashhub-neon)] shadow-[0_0_10px_var(--mashhub-neon)]" />
          DLSU-D · Special Topics in AI · May 2026
        </p>

        <h1
          id="mashhub-hero-title"
          ref={titleScramble.ref}
          className="mh-display mh-glow-text mh-mono text-[clamp(3.5rem,12vw,9rem)] font-bold leading-none tracking-tight text-[var(--mashhub-text)]"
        >
          {titleScramble.displayText}
        </h1>

        <div className="mt-5 max-w-3xl text-lg text-[var(--mashhub-text-muted)] sm:text-xl md:text-2xl">
          <RevealText className="mh-display">
            Intelligent Music Compatibility. Engineered for DJs.
          </RevealText>
        </div>

        <p className="mt-4 max-w-2xl text-sm text-[var(--mashhub-text-dim)] sm:text-base">
          A research-grade music library system with a transparent Sugeno-type fuzzy inference engine — section-level
          harmonic matching that existing tools can&rsquo;t do.
        </p>

        <motion.div
          className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.value}
              className="rounded-[var(--radius-project)] border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-surface)]/70 p-4 backdrop-blur"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.6 + idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <ScrambledStat value={stat.value} />
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--mashhub-text-dim)]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2">
          <span className="mh-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mashhub-text-dim)]">scroll</span>
          <span
            className="block h-8 w-px bg-gradient-to-b from-[var(--mashhub-accent)] to-transparent"
            data-mh-animate="true"
            style={
              reduce
                ? undefined
                : {
                    animation: 'mh-pulse-soft 1.8s ease-in-out infinite',
                  }
            }
          />
        </div>
      </motion.div>
    </section>
  )
}
