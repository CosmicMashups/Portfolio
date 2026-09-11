import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/components/ui/cn'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { fadeInUp, motionEase } from '@/lib/motion/presets'

export interface LifecyclePhase {
  id: string
  label: string
  summary: string
  example: string
}

export const PHASES: LifecyclePhase[] = [
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
]

export function LifecycleTimeline({
  activeId,
  onSelect,
}: {
  activeId?: string
  onSelect?: (id: string) => void
}) {
  const reduce = usePrefersReducedMotion()
  const [internalActive, setInternalActive] = useState<string>('concept')

  const current = activeId ?? internalActive
  const handleSelect = (id: string) => {
    setInternalActive(id)
    onSelect?.(id)
  }

  return (
    <div className="w-full">
      <motion.div
        className="flex w-full flex-col gap-2.5"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
        }}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, margin: '-8% 0px' }}
      >
        {PHASES.map((p, i) => {
          const isSelected = current === p.id
          return (
            <motion.button
              key={p.id}
              type="button"
              variants={fadeInUp}
              onClick={() => handleSelect(p.id)}
              onFocus={() => handleSelect(p.id)}
              className={cn(
                'group relative w-full rounded-xl border p-3.5 text-left transition-all duration-200 outline-none',
                isSelected
                  ? 'border-[#d3fa99]/60 bg-[#121613]/90 shadow-[0_0_16px_rgba(211,250,153,0.12)]'
                  : 'border-white/10 bg-[#121613]/45 hover:border-white/20 hover:bg-[#121613]/65',
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'font-[var(--font-mono)] text-[10px] font-semibold tracking-wider transition-colors',
                      isSelected ? 'text-[#d3fa99]' : 'text-white/40 group-hover:text-white/70',
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className={cn(
                      'font-[var(--font-display)] text-sm font-medium tracking-tight transition-colors',
                      isSelected ? 'text-[#fafffa]' : 'text-[#fafffa]/80 group-hover:text-[#fafffa]',
                    )}
                  >
                    {p.label}
                  </h3>
                </div>
                {isSelected ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d3fa99] shadow-[0_0_6px_#d3fa99]" />
                ) : null}
              </div>

              <p className="mt-1.5 text-[11px] leading-relaxed text-[#fafffa]/65">
                {p.summary}
              </p>

              <motion.div
                initial={false}
                animate={{ height: isSelected ? 'auto' : 0, opacity: isSelected ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.28, ease: motionEase }}
                className="overflow-hidden"
              >
                <div className="mt-2.5 border-t border-white/10 pt-2 font-[var(--font-mono)] text-[10.5px] leading-snug text-[#d3fa99]">
                  {p.example}
                </div>
              </motion.div>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
