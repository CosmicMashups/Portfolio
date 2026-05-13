import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { cn } from '@/components/ui/cn'
import { TiltCard } from '@/components/ui/TiltCard'
import { BorderTrace } from '@/components/ui/BorderTrace'

const PHASES = [
  {
    id: 'edu',
    label: 'Education',
    title: 'Computer Science — DLSU-Dasmariñas',
    period: 'Ongoing',
    summary:
      'Core systems, algorithms, and ML foundations with emphasis on software architecture and intelligent applications.',
    detail:
      'Coursework and projects converge on shipping full-stack systems with measurable evaluation metrics and clear failure modes.',
  },
  {
    id: 'intern',
    label: 'Internship',
    title: 'Applied systems internship track',
    period: 'Asynchronous with shipping milestones',
    summary:
      'Ownership of integration boundaries: data contracts, deployment realism, and communication of tradeoffs.',
    detail:
      'Focused on reducing ambiguity between prototype and production: logging, evaluation harnesses, and reproducible builds.',
  },
  {
    id: 'proj',
    label: 'Projects',
    title: 'Portfolio of production-shaped systems',
    period: 'Active',
    summary:
      'AriMarket, PocketPT, MashHub, Expens.io, Registrar — each with a deliberate UI system and architecture narrative.',
    detail:
      'Every module exposes not just features but decisions: latency, accessibility, evaluation, and maintainability.',
  },
] as const

export function LifecycleTimeline() {
  const [open, setOpen] = useState<string | null>('edu')

  return (
    <div className="space-y-3">
      {PHASES.map((p) => {
        const expanded = open === p.id
        return (
          <TiltCard key={p.id} maxTilt={8}>
            <BorderTrace>
              <Card
                className={cn(
                  'transition-colors',
                  expanded && 'border-[color:color-mix(in_oklab,var(--accent-primary)_35%,transparent)]',
                )}
              >
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : p.id)}
              className="flex w-full items-start justify-between gap-4 text-left"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                  {p.label}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[var(--global-text)]">{p.title}</h3>
                <p className="text-sm text-[var(--global-text-muted)]">{p.period}</p>
              </div>
              <ChevronRight
                className={cn(
                  'mt-1 h-5 w-5 shrink-0 text-[var(--global-text-muted)] transition-transform',
                  expanded && 'rotate-90 text-[var(--accent-primary)]',
                )}
                aria-hidden
              />
            </button>
            <p className="mt-3 text-sm leading-relaxed text-[var(--global-text-muted)]">{p.summary}</p>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="overflow-hidden"
                >
                  <p className="pt-3 text-sm leading-relaxed text-[var(--global-text)] border-t border-[var(--global-border)] mt-3">
                    {p.detail}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
              </Card>
            </BorderTrace>
          </TiltCard>
        )
      })}
    </div>
  )
}
