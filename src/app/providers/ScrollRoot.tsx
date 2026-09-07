import Lenis from 'lenis'
import { type ReactNode, useEffect } from 'react'
import { usePerformanceTier } from '@/app/providers/PerformanceTierProvider'

/** Smooth scroll at the viewport level; no-op when reduced motion is requested. */
export function ScrollRoot({ children }: { children: ReactNode }) {
  const { lowTier, reducedMotion } = usePerformanceTier()

  useEffect(() => {
    if (reducedMotion || lowTier) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const lenis = new Lenis({ smoothWheel: true })
    let rafId = 0
    let active = true

    const onVisibilityChange = () => {
      active = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    function raf(time: number) {
      if (active) lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      lenis.destroy()
    }
  }, [lowTier, reducedMotion])

  return children
}
