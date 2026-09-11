import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PROJECTS } from '@/config/projects.registry'
import { useTechnicalView } from '@/app/providers/useTechnicalView'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { motionEase } from '@/lib/motion/presets'
import { cn } from '@/components/ui/cn'

export type ClusterId = 'frontend' | 'backend' | 'ai' | 'mobile' | 'devops'

export const CLUSTERS: {
  id: ClusterId
  title: string
  stackKeywords: string[]
  prose: string
}[] = [
  {
    id: 'ai',
    title: 'AI & Machine Learning',
    stackKeywords: ['tensorflow', 'tflite', 'pytorch', 'python', 'ml'],
    prose:
      'Models ship with their evaluation story: confusion matrices, error triplets (MAE/MSE/RMSE), and reproducible lab artifacts.',
  },
  {
    id: 'mobile',
    title: 'Mobile & On-Device Neural Nets',
    stackKeywords: ['flutter', 'dart', 'tflite', 'sqlite', 'pwa'],
    prose:
      'Single Dart tree across mobile and web where UX stays resilient and on-device inference runs with zero cloud dependency.',
  },
  {
    id: 'frontend',
    title: 'Full-Stack & Systems Architecture',
    stackKeywords: ['react', 'typescript', 'tailwind', 'php', 'mysql'],
    prose:
      'Typed React surfaces, token-driven Tailwind density, and explicit data paths with session-gated persistence.',
  },
  {
    id: 'devops',
    title: 'Reliability & Deployment',
    stackKeywords: ['git', 'apache', 'xampp', 'ci', 'vite'],
    prose:
      'Reproducible builds, Vite optimization for heavy visualization, and deployment constraints that match real operational environments.',
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
  return [...new Set(lines)].slice(0, 3)
}

export function CapabilityClusters({ activeCluster }: { activeCluster?: ClusterId }) {
  const { technical } = useTechnicalView()
  const reduce = usePrefersReducedMotion()
  const [hovered, setHovered] = useState<ClusterId | null>(null)

  const linesByCluster = useMemo(() => {
    const m = new Map<ClusterId, string[]>()
    for (const c of CLUSTERS) {
      m.set(c.id, registryTechnicalLines(c))
    }
    return m
  }, [])

  return (
    <div className="space-y-3">
      {CLUSTERS.map((c, index) => {
        const isTarget = (activeCluster ?? hovered) === c.id
        return (
          <motion.div
            key={c.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6% 0px' }}
            transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : index * 0.04, ease: motionEase }}
            onMouseEnter={() => setHovered(c.id)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'group rounded-xl border p-4 transition-all duration-200',
              isTarget
                ? 'border-[#d3fa99]/50 bg-[#121613]/90 shadow-[0_0_16px_rgba(211,250,153,0.08)]'
                : 'border-white/10 bg-[#121613]/50 hover:border-white/20',
            )}
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <h4 className="font-[var(--font-display)] text-sm font-medium tracking-tight text-[#fafffa]">
                {c.title}
              </h4>
              <ul className="flex flex-wrap gap-1.5">
                {c.stackKeywords.slice(0, 5).map((kw) => (
                  <li
                    key={kw}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-[var(--font-mono)] text-[9px] uppercase tracking-wider text-[#fafffa]/70"
                  >
                    {kw}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-[#fafffa]/70">
              {c.prose}
            </p>

            {technical ? (
              <ul className="mt-3 space-y-1 border-t border-white/10 pt-2 font-[var(--font-mono)] text-[10px] leading-snug text-[#d3fa99]">
                {(linesByCluster.get(c.id) ?? []).map((line) => (
                  <li key={line}>↳ {line}</li>
                ))}
              </ul>
            ) : null}
          </motion.div>
        )
      })}
    </div>
  )
}
