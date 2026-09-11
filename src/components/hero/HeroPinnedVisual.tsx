import { motion } from 'framer-motion'
import { type RefObject, useEffect, useRef } from 'react'
import { HeroDeviceModel } from '@/components/hero/HeroDeviceModel'
import { motionEase } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { gsap } from '@/lib/motion/gsapScroll'
import deskBackgroundUrl from '@/assets/bg.jpg'

/**
 * Sticky desk + 3D phone backdrop shared by the hero and capability map.
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
      {/* Base background texture */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{ backgroundImage: `url(${deskBackgroundUrl})` }}
      />

      {/* Atmospheric depth: rich deep blackened walnut brown gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#18110c]/35 via-[#140e0a]/10 to-[#120b08]/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(20,13,9,0.42)_100%)]" />

      {/* GSAP scroll-linked progressive darkening for Capability Map clarity */}
      <div
        ref={revealOverlayRef}
        className="pointer-events-none absolute inset-0 bg-[#120c08]/92 backdrop-blur-[2px]"
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
