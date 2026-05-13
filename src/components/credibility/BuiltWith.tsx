import { useMemo } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Code2, Cpu, Database, Layers, Smartphone, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PROJECTS } from '@/config/projects.registry'
import { cn } from '@/components/ui/cn'

type Layer = 'Frontend' | 'Backend' | 'AI / ML' | 'Mobile'

interface StackRow {
  name: string
  layer: Layer
  icon: LucideIcon
  /** lowercase substring match against stack item names */
  needle: string
}

const ROWS: StackRow[] = [
  { name: 'React 19 + TypeScript', layer: 'Frontend', icon: Code2, needle: 'react' },
  { name: 'Vite', layer: 'Frontend', icon: Layers, needle: 'vite' },
  { name: 'Tailwind CSS v4', layer: 'Frontend', icon: Sparkles, needle: 'tailwind' },
  { name: 'Framer Motion', layer: 'Frontend', icon: Sparkles, needle: 'framer' },
  { name: 'Recharts', layer: 'Frontend', icon: Sparkles, needle: 'recharts' },
  { name: '@xyflow/react', layer: 'Frontend', icon: Layers, needle: 'xyflow' },
  { name: 'Lenis', layer: 'Frontend', icon: Sparkles, needle: 'lenis' },
  { name: 'PHP + MySQL', layer: 'Backend', icon: Database, needle: 'php' },
  { name: 'Firebase', layer: 'Backend', icon: Database, needle: 'firebase' },
  { name: 'Python / ML stack', layer: 'AI / ML', icon: Cpu, needle: 'python' },
  { name: 'Flutter + Dart', layer: 'Mobile', icon: Smartphone, needle: 'flutter' },
]

function projectsUsing(needle: string): string[] {
  return PROJECTS.filter((p) =>
    p.stack.some((s) => s.name.toLowerCase().includes(needle)),
  ).map((p) => p.title)
}

export function BuiltWith() {
  const grouped = useMemo(() => {
    const map = new Map<Layer, StackRow[]>()
    for (const row of ROWS) {
      const list = map.get(row.layer) ?? []
      list.push(row)
      map.set(row.layer, list)
    }
    return map
  }, [])

  return (
    <Tooltip.Provider delayDuration={120}>
      <div className="rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--global-surface)]/50 p-6 md:p-8">
        <h3 className="text-lg font-semibold text-[var(--global-text)]">Built with</h3>
        <p className="mt-2 text-sm text-[var(--global-text-muted)]">
          Portfolio stack grouped by layer. Hover a pill to see where it appears in shipped projects (registry-backed).
        </p>
        <div className="mt-8 space-y-8">
          {(['Frontend', 'Backend', 'AI / ML', 'Mobile'] as const).map((layer) => {
            const rows = grouped.get(layer) ?? []
            if (!rows.length) return null
            return (
              <div key={layer}>
                <p className="mb-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                  {layer}
                </p>
                <div className="h-px w-full bg-[var(--global-border)]" />
                <ul className="mt-4 flex flex-wrap gap-2">
                  {rows.map((row) => {
                    const used = projectsUsing(row.needle)
                    const Icon = row.icon
                    return (
                      <li key={row.name}>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button
                              type="button"
                              className={cn(
                                'inline-flex items-center gap-2 rounded-full border border-[var(--global-border)] bg-[color:color-mix(in_oklab,var(--global-surface)_95%,transparent)] px-3 py-1.5 text-left text-xs text-[var(--global-text)] transition-colors hover:border-[color:color-mix(in_oklab,var(--accent-primary)_40%,var(--global-border))]',
                              )}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--accent-primary)]" aria-hidden />
                              {row.name}
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              side="top"
                              className="z-50 max-w-xs rounded-md border border-[var(--global-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[11px] text-[var(--global-text-muted)] shadow-lg"
                            >
                              <span className="font-[var(--font-mono)] text-[10px] text-[var(--global-text)]">Used in:</span>{' '}
                              {used.length ? used.join(', ') : 'This portfolio site'}
                              <Tooltip.Arrow className="fill-[var(--color-bg-elevated)]" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </Tooltip.Provider>
  )
}
