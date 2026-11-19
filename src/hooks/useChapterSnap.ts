import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'
import { NAV_SECTIONS } from '@/config/navigation'
import { useLenis } from '@/app/providers/lenisContext'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

/** Debounce window after scroll velocity settles before deciding whether to snap. */
const SETTLE_DELAY_MS = 140
/** How close to a chapter boundary (as a fraction of viewport height) snapping engages. */
const ENGAGE_THRESHOLD_RATIO = 0.35
const MAX_THRESHOLD_PX = 420
/** Lenis velocity is roughly px/frame; below this it's effectively at rest. */
const SETTLED_VELOCITY = 0.05

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Chapter snap-on-settle for the home page, desktop-only.
 *
 * Chapters vary wildly in height (Hero is ~1 screen; "What I've Built"'s project
 * grid and Beyond Code's photo essay are several screens tall), so this must NOT
 * pull scroll toward the nearest chapter top from anywhere on the page — only
 * when the user has scrolled to a near-stop within a threshold window of a
 * boundary does it ease the rest of the way. Elsewhere (deep inside a long
 * chapter) nothing engages and Lenis scrolls freely.
 *
 * Built directly on Lenis's own `scroll` event (which reports live velocity)
 * and its `scrollTo` API, rather than GSAP ScrollTrigger's `snap` config — in
 * testing, ScrollTrigger's snap did not reliably engage when driven purely
 * through `lenis.on('scroll', ScrollTrigger.update)`, so this hand-rolled
 * version is used instead. ScrollTrigger itself is still used elsewhere
 * (parallax/scrub animations) where that relay works fine.
 *
 * No-ops automatically on touch/low-tier/reduced-motion, since `useLenis()`
 * only returns an instance when ScrollRoot actually constructed one under
 * those same conditions.
 */
export function useChapterSnap() {
  const lenis = useLenis()
  const reduce = usePrefersReducedMotion()
  const settleTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!lenis || reduce) return

    const getBoundaries = () => {
      const ids = NAV_SECTIONS.map((s) => s.id)
      return ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el)
        .map((el) => el.getBoundingClientRect().top + window.scrollY)
        .sort((a, b) => a - b)
    }

    const onLenisScroll = (instance: Lenis) => {
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current)
      if (Math.abs(instance.velocity) > SETTLED_VELOCITY) return

      settleTimerRef.current = window.setTimeout(() => {
        const boundaries = getBoundaries()
        const threshold = Math.min(MAX_THRESHOLD_PX, window.innerHeight * ENGAGE_THRESHOLD_RATIO)
        const current = window.scrollY

        let closest: number | null = null
        let closestDist = Infinity
        for (const b of boundaries) {
          const dist = Math.abs(current - b)
          if (dist < closestDist) {
            closestDist = dist
            closest = b
          }
        }

        // Skip if already essentially there, or outside the engage window.
        if (closest === null || closestDist <= 4 || closestDist > threshold) return

        lenis.scrollTo(closest, { duration: 0.65, easing: easeOutCubic })
      }, SETTLE_DELAY_MS)
    }

    const unsubscribe = lenis.on('scroll', onLenisScroll)
    return () => {
      unsubscribe()
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current)
    }
  }, [lenis, reduce])
}
