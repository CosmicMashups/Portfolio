import Lenis from 'lenis'
import { type ReactNode, useEffect } from 'react'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

/** Smooth scroll at the viewport level; no-op when reduced motion is requested. */
export function ScrollRoot({ children }: { children: ReactNode }) {
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ smoothWheel: true })
    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [reduce])

  return children
}
