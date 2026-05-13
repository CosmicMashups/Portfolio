import { cn } from '@/components/ui/cn'

export type ProjectSectionKey = 'overview' | 'decisions' | 'architecture' | 'stack' | 'viz'

const LABELS: Record<ProjectSectionKey, string> = {
  overview: 'Overview',
  decisions: 'Decisions',
  architecture: 'Architecture',
  stack: 'Stack + rationale',
  viz: 'Signals',
}

export function ProjectSubnav({
  active,
  onChange,
  showViz,
}: {
  active: ProjectSectionKey
  onChange: (k: ProjectSectionKey) => void
  showViz: boolean
}) {
  const keys = (Object.keys(LABELS) as ProjectSectionKey[]).filter(
    (k) => k !== 'viz' || showViz,
  )

  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-[var(--global-border)] pb-3"
      aria-label="Project sections"
    >
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            active === k
              ? 'bg-[color:color-mix(in_oklab,var(--accent-primary)_22%,transparent)] text-[var(--global-text)]'
              : 'text-[var(--global-text-muted)] hover:text-[var(--global-text)]',
          )}
        >
          {LABELS[k]}
        </button>
      ))}
    </nav>
  )
}
