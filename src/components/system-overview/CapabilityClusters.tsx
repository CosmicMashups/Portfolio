import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PROJECTS } from '@/config/projects.registry'
import { useTechnicalView } from '@/app/providers/useTechnicalView'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { fadeInUp, motionEase } from '@/lib/motion/presets'
import { TiltCard } from '@/components/ui/TiltCard'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { cn } from '@/components/ui/cn'

type ClusterId = 'frontend' | 'backend' | 'ai' | 'mobile' | 'devops'

const CLUSTERS: {
  id: ClusterId
  title: string
  stackKeywords: string[]
  prose: string
}[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    stackKeywords: ['react', 'typescript', 'tailwind', 'javascript', 'html', 'vite', 'bootstrap'],
    prose:
      'Interfaces are contracts: typed React surfaces, token-driven Tailwind density, and chart shells that stay legible under real data volume — not decoration layered on top.',
  },
  {
    id: 'backend',
    title: 'Backend',
    stackKeywords: ['php', 'mysql', 'firebase', 'sqlite', 'mariadb'],
    prose:
      'Data paths stay explicit — prepared statements, session-gated portals, and local-first persistence when the network cannot be trusted.',
  },
  {
    id: 'ai',
    title: 'AI / ML',
    stackKeywords: ['tensorflow', 'tflite', 'ml', 'pytorch', 'python'],
    prose:
      'Models ship with their evaluation story: confusion matrices, error triplets, and Technical View exports that mirror what reviewers expect from lab work.',
  },
  {
    id: 'mobile',
    title: 'Mobile',
    stackKeywords: ['flutter', 'dart', 'pwa'],
    prose:
      'One Dart tree across Android, iOS, web, and desktop where UX must stay coherent while sensors and on-device inference diverge.',
  },
  {
    id: 'devops',
    title: 'DevOps',
    stackKeywords: ['git', 'apache', 'xampp', 'ci'],
    prose:
      'Builds favor reproducibility: Vite splits for heavy viz, public GitHub activity, and deployment constraints that match where software actually lands.',
  },
]

function registryTechnicalLines(cluster: (typeof CLUSTERS)[number]): string[] {
  const lines: string[] = []
  for (const p of PROJECTS) {
    const stacks = p.stack.filter((s) =>
      cluster.stackKeywords.some((k) => s.name.toLowerCase().includes(k)),
    )
    for (const s of stacks) {
      lines.push(`${p.title}: ${s.name} — ${s.reason}`)
    }
  }
  return [...new Set(lines)].slice(0, 4)
}

export function CapabilityClusters() {
  const { technical } = useTechnicalView()
  const reduce = usePrefersReducedMotion()
  const [active, setActive] = useState<ClusterId | null>(null)

  const linesByCluster = useMemo(() => {
    const m = new Map<ClusterId, string[]>()
    for (const c of CLUSTERS) {
      m.set(c.id, registryTechnicalLines(c))
    }
    return m
  }, [])

  return (
    <div className="space-y-6">
      {CLUSTERS.map((c, index) => {
        const isActive = active === c.id
        return (
          <motion.div
            key={c.id}
            className="grid gap-4 lg:grid-cols-2 lg:items-stretch"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6% 0px' }}
            transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : index * 0.05, ease: motionEase }}
          >
            <TiltCard maxTilt={5} className="h-full min-h-0">
              <BorderTrace
                className={cn(
                  'h-full rounded-[var(--radius-project)] transition-shadow',
                  isActive && 'shadow-[0_0_24px_-6px_color-mix(in_oklab,var(--accent-primary)_35%,transparent)]',
                )}
              >
                <div
                  className="flex h-full flex-col rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--global-surface)]/90 p-4 backdrop-blur-sm md:p-5"
                  onMouseEnter={() => setActive(c.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocusCapture={() => setActive(c.id)}
                  onBlurCapture={() => setActive(null)}
                  tabIndex={-1}
                >
                  <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--accent-primary)]">
                    {c.title}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {c.stackKeywords.slice(0, 6).map((kw) => (
                      <li
                        key={kw}
                        className="rounded-full border border-[color:color-mix(in_oklab,var(--accent-primary)_28%,var(--global-border))] px-2 py-0.5 font-[var(--font-mono)] text-[9px] uppercase tracking-wide text-[var(--global-text-muted)]"
                      >
                        {kw}
                      </li>
                    ))}
                  </ul>
                  {technical ? (
                    <ul className="mt-4 space-y-1.5 border-t border-[var(--global-border)] pt-3 font-[var(--font-mono)] text-[10px] leading-snug text-[var(--global-text)]">
                      {(linesByCluster.get(c.id) ?? []).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </BorderTrace>
            </TiltCard>

            <motion.div
              variants={fadeInUp}
              initial={reduce ? false : 'hidden'}
              whileInView={reduce ? undefined : 'show'}
              viewport={{ once: true }}
              className="flex flex-col justify-center rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--global-surface)]/90 p-5 backdrop-blur-sm md:p-6"
            >
              <p className="text-sm leading-relaxed text-[var(--global-text-muted)]">{c.prose}</p>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
