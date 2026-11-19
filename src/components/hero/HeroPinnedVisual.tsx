import { motion } from 'framer-motion'
import { type RefObject, useEffect, useRef } from 'react'
import { HeroDeviceModel } from '@/components/hero/HeroDeviceModel'
import { motionEase } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { gsap } from '@/lib/motion/gsapScroll'

/**
 * Sticky near-black backdrop + 3D phone stage shared by the hero and capability map.
 * Synchronized with GSAP ScrollTrigger for smooth darkening, scale, and lateral framing.
 */
export function HeroPinnedVisual({
  pinContainerRef,
  getProgress,
}: {
  pinContainerRef: RefObject<HTMLDivElement | null>
  getProgress?: () => number
}) {
  const reduce = usePrefersReducedMotion()
  const revealOverlayRef = useRef<HTMLDivElement>(null)
  const phoneWrapperRef = useRef<HTMLDivElement>(null)

  const internalGetProgress = () => {
    if (getProgress) return getProgress()
    const el = pinContainerRef.current
    if (!el) return 0
    const total = el.offsetHeight - window.innerHeight
    if (total <= 0) return 0
    const scrolled = -el.getBoundingClientRect().top
    return Math.min(1, Math.max(0, scrolled / total))
  }

  useEffect(() => {
    if (!pinContainerRef.current || reduce) return

    const ctx = gsap.context(() => {
      // Smooth darkening overlay tied to scroll progress
      if (revealOverlayRef.current) {
        gsap.to(revealOverlayRef.current, {
          opacity: 0.92,
          ease: 'none',
          scrollTrigger: {
            trigger: pinContainerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        })
      }

      // Subtle lateral framing transition for the phone stage
      if (phoneWrapperRef.current) {
        gsap.to(phoneWrapperRef.current, {
          x: 0,
          scale: 1.04,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: pinContainerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        })
      }
    }, pinContainerRef)

    return () => ctx.revert()
  }, [reduce, pinContainerRef])

  return (
    <div className="sticky top-0 left-0 z-0 h-svh w-screen overflow-hidden md:h-[100svh]">
      {/* Flat near-black base with a subtle amber-tinted glow — portrait is the only photographic element */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,107,26,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.5)_100%)]" />

      {/* GSAP scroll-linked progressive darkening for Capability Map clarity */}
      <div
        ref={revealOverlayRef}
        className="pointer-events-none absolute inset-0 bg-[#0a0a0a]/92 backdrop-blur-[2px]"
        style={{ opacity: 0 }}
      />

      {/* 3D Smartphone Device Stage: Offset to right on desktop for asymmetric hero tension */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[6vw] xl:pr-[9vw]"
        initial={reduce ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: motionEase }}
      >
        <div
          ref={phoneWrapperRef}
          className="relative h-[72vmin] w-[72vmin] max-w-[620px] pointer-events-auto"
        >
          <HeroDeviceModel className="h-full w-full" getProgress={internalGetProgress} />
        </div>
      </motion.div>
    </div>
  )
}
