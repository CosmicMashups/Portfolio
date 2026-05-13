import { Suspense, lazy, useCallback } from 'react'
import { Section } from '@/components/shell/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { useTextScramble } from '@/hooks/useTextScramble'
import { Panel } from '@/components/ui/Panel'
import type { ProjectId } from '@/config/project.types'

const SkillsGraph = lazy(() =>
  import('@/components/skills/SkillsGraph').then((m) => ({ default: m.SkillsGraph })),
)

function scrollToProject(id: ProjectId) {
  document.querySelector<HTMLElement>(`[data-project="${id}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const TITLE = 'Expertise Network'

export function SkillsHomeSection() {
  const onSkillProject = useCallback((id: ProjectId) => scrollToProject(id), [])
  const scramble = useTextScramble({ targetText: TITLE, durationMs: 1000 })

  return (
    <Section
      id="skills"
      kicker={<SectionEyebrow>// 05 — SKILLS GRAPH</SectionEyebrow>}
      title={
        <span ref={scramble.ref} className="font-[var(--font-display)]" aria-label={TITLE}>
          {scramble.displayText}
        </span>
      }
    >
      <p className="mb-6 max-w-3xl text-sm text-[var(--global-text-muted)] md:mb-8">
        Nodes aggregate to shipped projects; edges encode adjacent practice. Hover for context, click to jump to a
        representative module.
      </p>
      <Suspense
        fallback={
          <Panel className="animate-pulse text-sm text-[var(--global-text-muted)]">Loading skills graph…</Panel>
        }
      >
        <SkillsGraph onSelectProject={onSkillProject} />
      </Suspense>
    </Section>
  )
}
