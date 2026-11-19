import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { Section } from '@/components/shell/Section'
import { ChapterTitleCard } from '@/components/shell/ChapterTitleCard'
import { ProjectGalleryCard } from '@/components/projects/ProjectGalleryCard'
import { PROJECTS } from '@/config/projects.registry'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { gsap, ScrollTrigger } from '@/lib/motion/gsapScroll'

export function ProjectsShowcaseSection() {
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
    <div id="projects" className="scroll-mt-[var(--shell-header-height)]">
      <ChapterTitleCard
        kicker="04 // What I've Built"
        title="Selected Work"
        subtitle={`${PROJECTS.length} shipped systems, one consistent chrome.`}
      />
      <Section id="projects-grid" tone="dark" hideHeader bleed={false}>
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--global-text-muted)]">
          Every shipped system, as a gallery — image-forward, one consistent card chrome, no horizontal scroll
          required to see the whole body of work.
        </p>

        <div ref={gridRef} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectGalleryCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </Section>
    </div>
  )
}
