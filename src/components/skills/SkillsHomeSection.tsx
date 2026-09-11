import { Suspense, lazy, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { Section } from '@/components/shell/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { useTextScramble } from '@/hooks/useTextScramble'
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
        el.classList.add('ring-2', 'ring-[#d3fa99]', 'ring-offset-4', 'ring-offset-[#121613]')
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-[#d3fa99]', 'ring-offset-4', 'ring-offset-[#121613]')
        }, 1800)
      },
    })
  }
}

const TITLE = 'Expertise Network'

export function SkillsHomeSection() {
  const onSkillProject = useCallback((id: ProjectId) => scrollToProject(id), [])
  const scramble = useTextScramble({ targetText: TITLE, durationMs: 1000 })
  const [graphRef, graphInView] = useInView({
    triggerOnce: true,
    rootMargin: '240px 0px 320px 0px',
    threshold: 0,
  })

  return (
    <Section
      id="skills"
      tone="dark"
      kicker={<SectionEyebrow>Skills</SectionEyebrow>}
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
  )
}
