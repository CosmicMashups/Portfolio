import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/components/ui/cn'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { BorderTrace } from '@/components/ui/BorderTrace'

const ITEMS = [
  {
    id: 'auto',
    title: 'Automation tooling',
    metric: '~12h / week reclaimed',
    summary:
      'Scripted ingestion, batch evaluation, and repeatable deploy paths — fewer context switches between “try idea” and “see number”.',
    detail:
      'The leverage is not the script itself but the contract it enforces: the same inputs produce comparable metrics across runs.',
  },
  {
    id: 'ml',
    title: 'ML classification + monitoring',
    metric: 'Top-1 0.86 macro-F1 (fixture)',
    summary:
      'Offline confusion matrices and train/val divergence checks ship beside the model, not in a forgotten notebook.',
    detail:
      'Classification surfaces stay tied to the product metaphor (risk gradients, not raw logits) while Technical View keeps the receipts.',
  },
  {
    id: 'prod',
    title: 'Productivity & collaboration',
    metric: 'Single narrative across roles',
    summary:
      'Design docs, architecture blurbs, and UI language share one vocabulary so PM ↔ engineer ↔ stakeholder alignment costs less.',
    detail:
      'Measurable outcome: shorter review loops because diagrams and metrics cite the same system boundaries.',
  },
] as const

export function ImpactTimeline() {
  const [open, setOpen] = useState<string | null>(ITEMS[0]?.id ?? null)

  return (
    <div className="space-y-6 md:space-y-7">
      {ITEMS.map((item) => {
        const expanded = open === item.id
        return (
          <BorderTrace key={item.id}>
            <Card>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-5 text-left"
              onClick={() => setOpen(expanded ? null : item.id)}
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                  Outcome
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[var(--global-text)]">{item.title}</h3>
                <p className="font-mono text-sm text-[var(--global-text-muted)]">
                  <KineticCounter value={Number.parseFloat(item.metric) || 12} /> {item.metric.replace(/^[^a-zA-Z]*/, '')}
                </p>
              </div>
              <ChevronRight
                className={cn(
                  'mt-1 h-5 w-5 shrink-0 text-[var(--global-text-muted)] transition-transform',
                  expanded && 'rotate-90 text-[var(--accent-primary)]',
                )}
                aria-hidden
              />
            </button>
            <p className="mt-5 text-sm leading-relaxed text-[var(--global-text-muted)]">{item.summary}</p>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="mt-5 border-t border-[var(--global-border)] pt-5 text-sm leading-relaxed text-[var(--global-text)]">
                    {item.detail}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
            </Card>
          </BorderTrace>
        )
      })}
    </div>
  )
}
