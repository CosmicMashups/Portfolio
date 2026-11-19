import { Suspense, lazy, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { Section } from '@/components/shell/Section'
import { ChapterTitleCard } from '@/components/shell/ChapterTitleCard'
import { Panel } from '@/components/ui/Panel'
import type { ProjectId } from '@/config/project.types'

const SkillsGraph = lazy(() =>
  import('@/components/skills/SkillsGraph').then((m) => ({ default: m.SkillsGraph })),
)

import { smoothScrollTo } from '@/lib/motion/gsapScroll'

function scrollToProject(id: ProjectId) {
  const el = document.getElementById(id) ?? document.querySelector<HTMLElement>(`[data-project="${id}"]`)
  if (el) {
    smoothScrollTo(el, {
      updateHash: true,
      onComplete: () => {
        el.classList.add('ring-2', 'ring-[#ff6b1a]', 'ring-offset-4', 'ring-offset-[#0a0a0a]')
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-[#ff6b1a]', 'ring-offset-4', 'ring-offset-[#0a0a0a]')
        }, 1800)
      },
    })
  }
}

export function SkillsHomeSection() {
  const onSkillProject = useCallback((id: ProjectId) => scrollToProject(id), [])
  const [graphRef, graphInView] = useInView({
    triggerOnce: true,
    rootMargin: '240px 0px 320px 0px',
    threshold: 0,
  })

  return (
    <div id="skills" className="scroll-mt-[var(--shell-header-height)]">
      <ChapterTitleCard kicker="05 // Skills" title="Expertise Network" />
      <Section id="skills-content" tone="dark" hideHeader bleed={false}>
        <p className="mb-6 max-w-3xl text-sm text-[var(--global-text-muted)] md:mb-8">
          Nodes aggregate to shipped projects; edges encode adjacent practice. Hover for context, click to jump to a
          representative module.
        </p>
        <div ref={graphRef} className="min-h-[360px] w-full min-w-0">
          {graphInView ? (
            <Suspense
              fallback={
                <Panel className="text-sm text-[var(--global-text-muted)]">Loading skills graph…</Panel>
              }
            >
              <SkillsGraph onSelectProject={onSkillProject} />
            </Suspense>
          ) : (
            <Panel className="flex min-h-[360px] items-center justify-center text-sm text-[var(--global-text-muted)]">
              Scroll closer to load the interactive graph.
            </Panel>
          )}
        </div>
      </Section>
    </div>
  )
}
