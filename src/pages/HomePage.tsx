import { Suspense, lazy, useCallback } from 'react'
import { Section } from '@/components/shell/Section'
import { HeroSystemEntry } from '@/components/hero/HeroSystemEntry'
import { SystemOverview } from '@/components/system-overview/SystemOverview'
import { ProjectSystem } from '@/components/projects/ProjectSystem'
import { ImpactTimeline } from '@/components/impact/ImpactTimeline'
import { CreativeCosmic } from '@/components/creative/CreativeCosmic'
import { GitHubCredibility } from '@/components/credibility/GitHubCredibility'
import { BuiltWith } from '@/components/credibility/BuiltWith'
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

export function HomePage() {
  const onSkillProject = useCallback((id: ProjectId) => scrollToProject(id), [])

  return (
    <main id="main-content" tabIndex={-1} className="text-left outline-none">
      <HeroSystemEntry />
      <SystemOverview />
      <Section id="projects" kicker="// PROJECTS" title="Project system">
        <p className="mb-10 max-w-3xl text-sm leading-relaxed text-[var(--global-text-muted)] md:mb-12">
          Each card inherits subtle accents from its Markdown design-system source while the global shell stays
          constant. Click a project title or “Full case study” for the dedicated page, or expand a module here for
          problem → decisions → architecture → stack → live signal fixtures.
        </p>
        <ProjectSystem />
      </Section>
      <Section id="impact" kicker="// IMPACT" title="Experience as impact">
        <ImpactTimeline />
      </Section>
      <Section id="skills" kicker="// SKILLS" title="Skills as system">
        <p className="mb-6 max-w-3xl text-sm text-[var(--global-text-muted)] md:mb-8">
          This is intentionally not a list. Nodes aggregate to projects; edges imply adjacency of practice.
        </p>
        <Suspense
          fallback={
            <Panel className="animate-pulse text-sm text-[var(--global-text-muted)]">Loading skills graph…</Panel>
          }
        >
          <SkillsGraph onSelectProject={onSkillProject} />
        </Suspense>
      </Section>
      <Section id="creative" kicker="// CREATIVE" title="Creative subsystem">
        <CreativeCosmic />
      </Section>
      <Section id="credibility" kicker="// CREDIBILITY" title="Developer credibility">
        <GitHubCredibility />
        <div className="mt-10 md:mt-12">
          <BuiltWith />
        </div>
      </Section>
    </main>
  )
}
