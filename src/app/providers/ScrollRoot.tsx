import Lenis from 'lenis'
import { type ReactNode, useEffect, useState } from 'react'
import { usePerformanceTier } from '@/app/providers/PerformanceTierProvider'
import { LenisContext } from '@/app/providers/lenisContext'
import { ScrollTrigger } from '@/lib/motion/gsapScroll'

/** Smooth scroll at the viewport level; no-op when reduced motion is requested. */
export function ScrollRoot({ children }: { children: ReactNode }) {
  const { lowTier, reducedMotion } = usePerformanceTier()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reducedMotion || lowTier) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const instance = new Lenis({ smoothWheel: true })
    setLenis(instance)
    let rafId = 0
    let active = true

    const onVisibilityChange = () => {
      active = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // Keep GSAP ScrollTrigger's scroll-position tracking in sync with Lenis's
    // own eased/virtual scroll, so ScrollTrigger-driven animations (and the
    // chapter-snap hook) read the same position Lenis is actually rendering.
    instance.on('scroll', ScrollTrigger.update)

    function raf(time: number) {
      if (active) instance.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      instance.destroy()
      setLenis(null)
    }
  }, [lowTier, reducedMotion])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
