import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProjectId } from '@/config/project.types'
import { PROJECTS } from '@/config/projects.registry'
import { ProjectModule } from '@/components/projects/ProjectModule'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { cn } from '@/components/ui/cn'

export function ProjectSystem({
  registerProjectNode,
}: {
  registerProjectNode?: (id: ProjectId, el: HTMLElement | null) => void
}) {
  const reduce = usePrefersReducedMotion()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    duration: reduce ? 0 : 20,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const reg = useCallback(
    (id: ProjectId, el: HTMLElement | null) => {
      registerProjectNode?.(id, el)
    },
    [registerProjectNode],
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext],
  )

  return (
    <div className="space-y-6">
      <div
        ref={emblaRef}
        className="overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Portrait cards, ~3 visible at once on desktop. Phantom-style focus:
            the active/centered slide reads at full scale, neighbors shrink
            slightly — driven off selectedIndex rather than per-frame scroll
            distance, which keeps this simple given the existing embla setup. */}
        <div className="flex touch-pan-y items-stretch gap-5">
          {PROJECTS.map((p, index) => (
            <div
              key={p.id}
              className={cn(
                'min-w-0 shrink-0 grow-0 basis-[78%] transition-transform duration-500 ease-out',
                'sm:basis-[46%] lg:basis-[31%]',
                index === selectedIndex ? 'scale-100 opacity-100' : 'scale-[0.92] opacity-80',
              )}
              style={{ transformOrigin: 'center center' }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${PROJECTS.length}: ${p.title}`}
              aria-hidden={selectedIndex === index ? undefined : true}
            >
              <ProjectModule project={p} index={index} registerNode={reg} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Slide indicators">
          {PROJECTS.map((p, index) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={selectedIndex === index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                selectedIndex === index
                  ? 'w-6 bg-[var(--global-accent-lime)]'
                  : 'w-1.5 bg-[var(--global-border)] opacity-40',
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous project"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[1000px] border border-[var(--global-border)] text-[var(--global-text)] transition-opacity disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next project"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[1000px] border border-[var(--global-border)] text-[var(--global-text)] transition-opacity disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
