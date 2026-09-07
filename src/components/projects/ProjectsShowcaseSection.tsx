import { useTextScramble } from '@/hooks/useTextScramble'
import { Section } from '@/components/shell/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { ProjectFeature } from '@/components/projects/ProjectFeature'
import { PROJECTS } from '@/config/projects.registry'

const TITLE = 'Selected Work'

export function ProjectsShowcaseSection() {
  const scramble = useTextScramble({ targetText: TITLE, durationMs: 1100 })

  return (
    <>
      <Section
        id="projects"
        tone="light"
        kicker={<SectionEyebrow>Selected Work</SectionEyebrow>}
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
        className="pb-0"
      >
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--global-text-muted)]">
          Each project gets a full overview instead of a swipeable card — image and text alternate sides, and the
          background alternates white/dark-green down the page, so nothing depends on a horizontal scroll to be
          seen.
        </p>
      </Section>
      {/* Each ProjectFeature is its own full-bleed, self-painted band (white/dark-green
          alternating) — rendered as siblings, not nested in the light Section above. */}
      {PROJECTS.map((project, index) => (
        <ProjectFeature key={project.id} project={project} index={index} />
      ))}
    </>
  )
}
