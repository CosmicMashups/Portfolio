import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { NAV_SECTIONS } from '@/config/navigation'
import { useLenis } from '@/app/providers/lenisContext'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { ScrollTrigger } from '@/lib/motion/gsapScroll'

/**
 * Chapter snap-on-settle for the home page, desktop-only.
 *
 * Lenis's RAF-driven virtual scroll doesn't coexist with native CSS
 * `scroll-snap-type` — the browser can't detect a discrete "scroll ended"
 * gesture through Lenis's continuous easing. Instead, ScrollTrigger (already
 * kept in sync with Lenis via `lenis.on('scroll', ScrollTrigger.update)` in
 * ScrollRoot) owns snap-point detection and easing here; Lenis just keeps
 * rendering the scroll position underneath.
 *
 * No-ops automatically on touch/low-tier/reduced-motion, since `useLenis()`
 * only returns an instance when ScrollRoot actually constructed one under
 * those same conditions.
 */
export function useChapterSnap() {
  const lenis = useLenis()
  const reduce = usePrefersReducedMotion()
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useGSAP(() => {
    if (!lenis || reduce) return

    const ids = NAV_SECTIONS.map((s) => s.id)
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (els.length < 2) return

    const total = document.documentElement.scrollHeight - window.innerHeight
    if (total <= 0) return

    const boundaries = els
      .map((el) => (el.getBoundingClientRect().top + window.scrollY) / total)
      .sort((a, b) => a - b)

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      snap: {
        snapTo: (value: number) => {
          let closest = boundaries[0]
          let closestDist = Math.abs(value - closest)
          for (const b of boundaries) {
            const dist = Math.abs(value - b)
            if (dist < closestDist) {
              closest = b
              closestDist = dist
            }
          }
          return closest
        },
        duration: { min: 0.5, max: 0.8 },
        ease: 'power2.inOut',
      },
    })
    triggerRef.current = trigger

    return () => {
      trigger.kill()
      triggerRef.current = null
    }
  }, [lenis, reduce])
}
