import { KineticCounter } from '@/components/ui/KineticCounter'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { PROJECTS } from '@/config/projects.registry'

const COMMODITY_LABEL = 'Commodities (AriMarket)'

export function AggregateMetricsBar() {
  const reduce = usePrefersReducedMotion()

  const items = [
    { key: 'p', label: 'Projects shipped', value: PROJECTS.length, suffix: '' as string | undefined, decimals: 0 },
    { key: 'm', label: 'ML models', value: 3, suffix: undefined, decimals: 0 },
    { key: 'pl', label: 'Platforms', value: 4, suffix: undefined, decimals: 0 },
    { key: 'y', label: 'Thesis year', value: 2026, suffix: undefined, decimals: 0 },
    { key: 'c', label: COMMODITY_LABEL, value: 20, suffix: '+' as string | undefined, decimals: 0 },
  ] as const

  return (
    <motion.div
      className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
      }}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, margin: '-8% 0px' }}
    >
      {items.map((it) => (
        <motion.div key={it.key} variants={fadeInUp}>
          <BorderTrace className="rounded-xl">
            <div className="rounded-xl border border-[var(--global-border)] bg-[var(--global-surface)]/55 px-3 py-3 md:py-3.5">
              <KineticCounter value={it.value} suffix={it.suffix} decimals={it.decimals} className="text-xl md:text-2xl" />
              <p className="mt-1 text-[10px] leading-snug text-[var(--global-text-muted)] md:text-[11px]">{it.label}</p>
            </div>
          </BorderTrace>
        </motion.div>
      ))}
    </motion.div>
  )
}
