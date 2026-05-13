import { useTextScramble } from '@/hooks/useTextScramble'
import { Section } from '@/components/shell/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { ProjectSystem } from '@/components/projects/ProjectSystem'
import { PROJECTS } from '@/config/projects.registry'

const TITLE = 'Selected Work'

export function ProjectsShowcaseSection() {
  const scramble = useTextScramble({ targetText: TITLE, durationMs: 1100 })

  return (
    <Section
      id="projects"
      kicker={<SectionEyebrow>// 03 — ARCHITECTURE</SectionEyebrow>}
      title={
        <span className="flex flex-wrap items-baseline gap-3 font-[var(--font-display)]">
          <span ref={scramble.ref} aria-label={TITLE}>
            {scramble.displayText}
          </span>
          <span className="inline-flex items-baseline gap-1 font-[var(--font-mono)] text-sm text-[var(--global-text-muted)]">
            <KineticCounter value={PROJECTS.length} className="!text-[var(--accent-primary)]" />
            <span>modules</span>
          </span>
        </span>
      }
    >
      <p className="mb-10 max-w-3xl text-sm leading-relaxed text-[var(--global-text-muted)] md:mb-12">
        Each card inherits accents from its case-study system while the shell stays constant. Hover for a scaled viz
        preview; open the case study for architecture, metrics, and Technical View depth.
      </p>
      <ProjectSystem />
    </Section>
  )
}
