import type { ProjectId } from '@/config/project.types'
import { projectById } from '@/config/projects.registry'
import { SKILL_NODES, type SkillCategory, type SkillNode } from '@/components/skills/skills.data'
import { cn } from '@/components/ui/cn'

const CATEGORY_ORDER: SkillCategory[] = ['ai', 'frontend', 'backend', 'tools']

const CATEGORY_LABEL: Record<SkillCategory, string> = {
  ai: 'AI / ML',
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Tools',
}

function projectTitles(ids: ProjectId[]) {
  return ids
    .map((id) => projectById(id)?.title ?? id)
    .filter(Boolean)
    .join(', ')
}

function groupByCategory(nodes: SkillNode[]) {
  const map = new Map<SkillCategory, SkillNode[]>()
  for (const cat of CATEGORY_ORDER) map.set(cat, [])
  for (const n of nodes) {
    map.get(n.category)?.push(n)
  }
  return map
}

export function SkillsGraph({
  onSelectProject,
}: {
  onSelectProject?: (id: ProjectId) => void
}) {
  const grouped = groupByCategory(SKILL_NODES)

  return (
    <div className="rounded-[var(--radius-project)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-4">
        {CATEGORY_ORDER.map((cat) => (
          <div key={cat} className="min-w-0 space-y-3">
            <p className="font-[var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              {CATEGORY_LABEL[cat]}
            </p>
            <ul className="flex flex-wrap gap-2">
              {(grouped.get(cat) ?? []).map((skill) => {
                const primaryProjectId = skill.projectIds[0]
                const primaryProj = primaryProjectId ? projectById(primaryProjectId) : null

                return (
                  <li key={skill.id}>
                    <button
                      type="button"
                      title={`Used in: ${projectTitles(skill.projectIds)}`}
                      onClick={() => {
                        if (primaryProjectId) onSelectProject?.(primaryProjectId)
                      }}
                      className={cn(
                        'group inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-base)]/40 px-3 py-1.5 text-xs text-[var(--color-text-secondary)] transition-all',
                        'hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10 hover:text-[var(--color-accent-primary)]',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-primary)]',
                        'active:scale-[0.97]',
                      )}
                    >
                      <span>{skill.label}</span>
                      {primaryProj && (
                        <span className="font-[var(--font-mono)] text-[9px] text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-accent-primary)]/80">
                          ↗
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t border-[var(--color-border-default)] px-5 py-3 text-[11px] text-[var(--color-text-muted)] sm:px-7">
        Click a skill to jump to a project it materially shipped in.
      </p>
    </div>
  )
}
