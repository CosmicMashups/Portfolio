import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { useTextScramble } from '@/hooks/useTextScramble'
import { Section } from '@/components/shell/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { ProjectGalleryCard } from '@/components/projects/ProjectGalleryCard'
import { PROJECTS } from '@/config/projects.registry'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { gsap, ScrollTrigger } from '@/lib/motion/gsapScroll'

const TITLE = 'Selected Work'

export function ProjectsShowcaseSection() {
  const scramble = useTextScramble({ targetText: TITLE, durationMs: 1100 })
  const reduce = usePrefersReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (reduce || !gridRef.current) return
    const tiles = gridRef.current.querySelectorAll('.gallery-tile')
    if (tiles.length === 0) return

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(tiles, {
        start: 'top 92%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', overwrite: true },
          ),
        once: true,
      })
    }, gridRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <Section
      id="projects"
      tone="dark"
      kicker={<SectionEyebrow>What I've Built</SectionEyebrow>}
      title={
        <span className="flex flex-wrap items-baseline gap-3 font-[var(--font-display)] uppercase">
          <span ref={scramble.ref} aria-label={TITLE}>
            {scramble.displayText}
          </span>
          <span className="inline-flex items-baseline gap-1 font-[var(--font-mono)] text-sm normal-case text-[var(--global-text-muted)]">
            <KineticCounter value={PROJECTS.length} className="!text-[var(--accent-primary)]" />
            <span>modules</span>
          </span>
        </span>
      }
    >
      <p className="max-w-3xl text-sm leading-relaxed text-[var(--global-text-muted)]">
        Every shipped system, as a gallery — image-forward, one consistent card chrome, no horizontal scroll required
        to see the whole body of work.
      </p>

      <div ref={gridRef} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {PROJECTS.map((project, index) => (
          <ProjectGalleryCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  )
}
