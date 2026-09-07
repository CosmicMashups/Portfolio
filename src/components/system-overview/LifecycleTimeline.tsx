import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/components/ui/cn'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { fadeInUp, motionEase } from '@/lib/motion/presets'

const PHASES = [
  {
    id: 'concept',
    label: 'Concept',
    summary: 'Frame the problem as measurable signals, not feature wishlists.',
    example: 'AriMarket: commodity forecasting scoped to MAE/MSE/RMSE triplet before UI.',
  },
  {
    id: 'research',
    label: 'Research',
    summary: 'Literature, baselines, and failure modes before architecture.',
    example: 'PocketPT: CNN vs CNN-LSTM tradeoffs documented in Technical View.',
  },
  {
    id: 'design',
    label: 'Design',
    summary: 'Dark-first density with semantic color contracts.',
    example: 'Expens.io: dashboard hierarchy keeps cash-truth primary over AI chrome.',
  },
  {
    id: 'build',
    label: 'Build',
    summary: 'Typed UI, platform channels, and offline-first paths.',
    example: 'PocketPT: Flutter + TFLite + SQLite for intermittent connectivity.',
  },
  {
    id: 'deploy',
    label: 'Deploy',
    summary: 'Hosting reality, sessions, and operator-grade admin flows.',
    example: 'Registrar: PHP sessions + per-status scripts on school XAMPP.',
  },
  {
    id: 'iterate',
    label: 'Iterate',
    summary: 'Ship metrics beside the product; tighten from real usage.',
    example: 'MashHub: exposed rule weights so expert users trust the matcher.',
  },
] as const

export function LifecycleTimeline() {
  const reduce = usePrefersReducedMotion()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div>
      <motion.div
        className="flex w-full flex-col gap-3"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
        }}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, margin: '-10% 0px' }}
      >
        {PHASES.map((p, i) => {
          const expanded = hovered === p.id
          return (
            <motion.div
              key={p.id}
              variants={fadeInUp}
              className={cn(
                'relative w-full rounded-xl border border-[var(--global-border)] bg-[var(--global-surface)]/90 p-4 backdrop-blur-sm transition-[box-shadow]',
                expanded && 'z-[1] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent-primary)_40%,transparent)]',
              )}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(p.id)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              role="group"
              aria-label={`${p.label}: ${p.summary}`}
              style={{ transitionDuration: 'var(--duration-base)', transitionTimingFunction: 'var(--ease-out-expo)' }}
            >
              <p className="font-[var(--font-mono)] text-[10px] text-[var(--accent-primary)]">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-1 font-[var(--font-display)] text-sm font-semibold text-[var(--global-text)]">{p.label}</h3>
              <p className="mt-2 text-[11px] leading-relaxed text-[var(--global-text-muted)]">{p.summary}</p>
              <motion.div
                initial={false}
                animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.35, ease: motionEase }}
                className="overflow-hidden"
              >
                <p className="mt-3 border-t border-[var(--global-border)] pt-3 text-[11px] leading-relaxed text-[var(--global-text)]">
                  {p.example}
                </p>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
