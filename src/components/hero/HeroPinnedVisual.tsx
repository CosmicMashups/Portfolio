import { motion } from 'framer-motion'
import { type RefObject, useEffect, useRef } from 'react'
import { HeroDeviceModel } from '@/components/hero/HeroDeviceModel'
import { motionEase } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import deskBackgroundUrl from '@/assets/background.webp'

/**
 * Sticky desk-photo + phone-model backdrop shared by the hero and the reveal
 * section right after it. Pinned to the viewport for the full height of
 * `pinContainerRef`'s element (hero + reveal stacked), then released — it
 * scrolls away naturally once "Selected Work" begins, since that's where the
 * pin container's own box ends.
 */
export function HeroPinnedVisual({ pinContainerRef }: { pinContainerRef: RefObject<HTMLDivElement | null> }) {
  const reduce = usePrefersReducedMotion()
  const reavealOverlayRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const getProgress = () => {
    const el = pinContainerRef.current
    if (!el) return 0
    const total = el.offsetHeight - window.innerHeight
    if (total <= 0) return 0
    const scrolled = -el.getBoundingClientRect().top
    return Math.min(1, Math.max(0, scrolled / total))
  }

  // Poll the same progress value each frame to drive a DOM overlay's opacity,
  // so the backdrop (photo + phone canvas, both sit under this div) reads
  // progressively darker as the "How I Ship Systems" reveal section scrolls
  // through — same progress math HeroDeviceModel's getProgress() already uses.
  useEffect(() => {
    const tick = () => {
      const progress = getProgress()
      if (reavealOverlayRef.current) {
        reavealOverlayRef.current.style.opacity = String(progress)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="sticky top-0 left-0 z-0 h-svh w-screen overflow-hidden md:h-[100svh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${deskBackgroundUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/75" />
      {/* Additional scroll-linked darkening: opacity driven each frame by the
          pin container's scroll progress, so the reveal section's text stays
          readable against the backdrop by the time it's fully in view. */}
      <div
        ref={reavealOverlayRef}
        className="pointer-events-none absolute inset-0 bg-black/65"
        style={{ opacity: 0 }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: motionEase }}
      >
        <div className="relative h-[62vmin] w-[62vmin] max-w-[560px]">
          <HeroDeviceModel className="h-full w-full" getProgress={getProgress} />
        </div>
      </motion.div>
    </div>
  )
}
