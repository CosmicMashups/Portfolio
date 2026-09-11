import { useRef, useEffect } from 'react'
import { HeroPinnedVisual } from '@/components/hero/HeroPinnedVisual'
import { HeroSystemEntry } from '@/components/hero/HeroSystemEntry'
import { HeroRevealSection } from '@/components/hero/HeroRevealSection'
import { gsap, ScrollTrigger } from '@/lib/motion/gsapScroll'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

/**
 * Combines the hero and the capability map reveal section into one
 * pinned unit: the desk photo + phone model stay fixed in the viewport (via
 * `HeroPinnedVisual`'s `position: sticky`) for the full height of this wrapper.
 * Choreographed via GSAP ScrollTrigger to scrub 3D phone rotation, background
 * darkening, and seamless entrance/exit transitions.
 */
export function HeroPinnedSection() {
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const heroEntryRef = useRef<HTMLDivElement>(null)
  const revealSectionRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef(0)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (!pinContainerRef.current || reduce) return

    const ctx = gsap.context(() => {
      // 1. Master ScrollTrigger to compute scroll progress with high precision
      ScrollTrigger.create({
        trigger: pinContainerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress
        },
      })

      // 2. Coordinated exit animation for hero entry typography
      if (heroEntryRef.current) {
        gsap.to(heroEntryRef.current, {
          y: -60,
          opacity: 0,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: pinContainerRef.current,
            start: 'top top',
            end: '42% top',
            scrub: true,
          },
        })
      }

      // 3. Staggered reveal for capability map
      if (revealSectionRef.current) {
        gsap.fromTo(
          revealSectionRef.current,
          { opacity: 0.15, y: 35 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: pinContainerRef.current,
              start: '38% top',
              end: '68% top',
              scrub: true,
            },
          },
        )
      }
    }, pinContainerRef)

    return () => ctx.revert()
  }, [reduce])

  const getProgress = () => {
    if (reduce) return 0
    if (scrollProgressRef.current > 0) return scrollProgressRef.current
    const el = pinContainerRef.current
    if (!el) return 0
    const total = el.offsetHeight - window.innerHeight
    if (total <= 0) return 0
    return Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total))
  }

  return (
    <div
      ref={pinContainerRef}
      className="relative isolate left-1/2 right-1/2 -mx-[50vw] -mt-[calc(var(--shell-header-height)+2.5rem)] grid w-screen grid-cols-1 grid-rows-1 sm:-mt-[calc(var(--shell-header-height)+3rem)]"
    >
      <div className="col-start-1 row-start-1">
        <HeroPinnedVisual pinContainerRef={pinContainerRef} getProgress={getProgress} />
      </div>
      <div className="relative z-10 col-start-1 row-start-1">
        <div ref={heroEntryRef}>
          <HeroSystemEntry />
        </div>
        <div ref={revealSectionRef}>
          <HeroRevealSection />
        </div>
      </div>
    </div>
  )
}
