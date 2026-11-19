import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ImageOff } from 'lucide-react'
import { ENGINEERING_LIFECYCLE_STEPS } from './lifecycleSteps.data'
import { STEP_ICONS, CARD_THEMES, workflowImageFor } from './lifecycleVisuals'
import { gsap, ScrollTrigger } from '@/lib/motion/gsapScroll'
import { useLenis } from '@/app/providers/lenisContext'
import { cn } from '@/components/ui/cn'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

const TOTAL = ENGINEERING_LIFECYCLE_STEPS.length

/** Active card width/height; flanking cards shrink and offset from these. */
const ACTIVE_WIDTH_VW = 30
const FLANK_WIDTH_VW = 17
const CARD_GAP_VW = 4

/**
 * Desktop-only pinned horizontal storytelling rail for "How I Build" — modeled on
 * landonorris.com/off-track's "Personal Projects" section (landscape layout): a
 * single pinned viewport where vertical scroll continuously scrubs the row of stage
 * cards horizontally, the active (centered) card rendering large while neighbors
 * shrink and offset vertically, and a fixed text panel swaps title/description/proof
 * to match whichever stage is currently active. All text lives in that panel — the
 * cards themselves carry only imagery (or, until the user supplies real photos, the
 * project's existing icon+tint "coming soon" placeholder).
 *
 * Only ever rendered when `useLenis()` is non-null (see LifecycleSection) — reduced
 * motion and touch users get the existing LifecycleCarousel instead, unchanged.
 */
export function LifecycleScrollRail() {
  // The pin TRIGGER is a plain, normal-flow block (no breakout styling) purely for
  // GSAP to measure scroll position against. The actual full-bleed visual content is
  // a SEPARATE element passed as `pin` — pinning an element that itself carries the
  // `-mx-[50vw] w-screen` breakout trick corrupts GSAP's pre/post-pin geometry
  // measurement (the negative margins shift its in-flow position, so GSAP's spacer
  // sizing and this component's own trigger.start/end become inconsistent with the
  // visually rendered scroll range). Separating trigger vs. pin target is GSAP's own
  // supported pattern for exactly this case.
  const triggerElRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(() => {
    const triggerEl = triggerElRef.current
    const visual = visualRef.current
    const track = trackRef.current
    if (!triggerEl || !visual || !track) return

    const ctx = gsap.context(() => {
      const cardWidth = (ACTIVE_WIDTH_VW / 100) * window.innerWidth
      const flankWidth = (FLANK_WIDTH_VW / 100) * window.innerWidth
      const gap = (CARD_GAP_VW / 100) * window.innerWidth
      // Rail width if every card sat at flank size, plus the extra room the active
      // card needs over flank size — close enough to the real laid-out width for a
      // stable pin distance (exact per-frame widths are applied visually below).
      const railWidth = TOTAL * flankWidth + (TOTAL - 1) * gap + (cardWidth - flankWidth)
      // Pixel distance the track itself needs to translate — independent of how much
      // page scroll that translation is spread across (see pinDistance below). Using
      // the rail's own width for BOTH would make the pin's total scroll distance only
      // a few hundred px (barely one wheel gesture), racing through all 10 stages
      // almost instantly instead of giving each stage room to read as its own beat.
      const trackTravelPx = Math.max(0, railWidth - window.innerWidth)
      // Deliberately paced scroll distance for the pin itself: roughly two-thirds of a
      // viewport height per stage, so scrolling through all 10 stages feels like a
      // sustained sequence (continuous scrub per the chosen interaction model) rather
      // than completing within a stage or two.
      const pinDistance = TOTAL * window.innerHeight * 0.65

      const trigger = ScrollTrigger.create({
        trigger: triggerEl,
        pin: visual,
        start: 'top top',
        end: () => '+=' + pinDistance,
        scrub: 0.4,
        onUpdate: (self) => {
          const progress = self.progress
          gsap.set(track, { x: -progress * trackTravelPx })

          const idx = Math.min(TOTAL - 1, Math.round(progress * (TOTAL - 1)))
          setActiveIndex((prev) => (prev === idx ? prev : idx))

          cardRefs.current.forEach((card, i) => {
            if (!card) return
            const dist = Math.abs(i - progress * (TOTAL - 1))
            const closeness = Math.max(0, 1 - dist)
            const width = flankWidth + (cardWidth - flankWidth) * closeness
            const yOffset = (1 - closeness) * (i % 2 === 0 ? -1 : 1) * 36
            gsap.set(card, {
              width,
              y: yOffset,
              opacity: 0.45 + 0.55 * closeness,
              zIndex: Math.round(closeness * 100),
            })
          })
        },
      })
      triggerRef.current = trigger

      return () => trigger.kill()
    }, triggerElRef)

    return () => {
      ctx.revert()
      triggerRef.current = null
    }
  }, [])

  const lenis = useLenis()

  const jumpTo = (index: number) => {
    const trigger = triggerRef.current
    if (!trigger) return
    const y = trigger.start + (index / (TOTAL - 1)) * (trigger.end - trigger.start)
    // Lenis owns window scroll here (see ScrollRoot); driving window.scrollTo directly via
    // GSAP's ScrollToPlugin fights Lenis's own momentum/target tracking and overshoots.
    // lenis.scrollTo updates Lenis's own target instead, matching useChapterSnap's approach.
    if (lenis) {
      lenis.scrollTo(y, { duration: 0.8, easing: easeOutCubic })
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const active = ENGINEERING_LIFECYCLE_STEPS[activeIndex]
  const activeTheme = CARD_THEMES[active.category] ?? CARD_THEMES.strategy

  return (
    <div ref={triggerElRef} className="relative w-full">
      <div ref={visualRef} className="relative left-1/2 right-1/2 -mx-[50vw] w-screen h-svh overflow-hidden">
        <div className="flex h-full w-full items-center">
          {/* Fixed text panel */}
          <div className="relative z-10 w-full max-w-sm shrink-0 pl-[var(--shell-gutter-sm)] sm:pl-[var(--shell-gutter-md)] lg:max-w-md lg:pl-[var(--shell-gutter-lg)]">
            <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[#ff6b1a]">
              03 // How I Build
            </p>
            <p className="mt-1 font-[var(--font-mono)] text-[11px] text-[var(--color-text-primary)]/40">
              Stage {String(activeIndex + 1).padStart(2, '0')} / {TOTAL}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mt-4"
              >
                <h3 className="font-[var(--font-display)] text-3xl uppercase leading-[0.95] text-[var(--color-text-primary)] lg:text-4xl">
                  {active.title}
                </h3>
                <p className="mt-2 font-[var(--font-mono)] text-[11px] text-[var(--color-text-primary)]/60">
                  {active.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-primary)]/80">
                  {active.description}
                </p>
                <div className="mt-5 flex items-center gap-1.5 font-[var(--font-mono)] text-[9.5px] uppercase tracking-wider text-[#ff6b1a]">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified Production Proof</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-text-primary)]/70">
                  {active.exemplar}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center gap-1.5">
              {ENGINEERING_LIFECYCLE_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => jumpTo(idx)}
                  aria-label={`Jump to stage ${step.number}: ${step.title}`}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    idx === activeIndex ? 'w-6 bg-[#ff6b1a]' : 'w-1.5 bg-white/20 hover:bg-white/40',
                  )}
                />
              ))}
            </div>
          </div>

          {/* Image rail */}
          <div className="relative h-[46vh] flex-1 overflow-visible">
            <div
              ref={trackRef}
              className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center"
              style={{ gap: `${CARD_GAP_VW}vw` }}
            >
              {ENGINEERING_LIFECYCLE_STEPS.map((step, idx) => {
                const Icon = STEP_ICONS[step.id] ?? ImageOff
                const theme = CARD_THEMES[step.category] ?? CARD_THEMES.strategy
                const image = workflowImageFor(step.id)
                return (
                  <div
                    key={step.id}
                    ref={(el) => {
                      cardRefs.current[idx] = el
                    }}
                    className="aspect-[3/4] shrink-0 overflow-hidden rounded-[20px] border"
                    style={{ width: `${FLANK_WIDTH_VW}vw`, borderColor: `${theme.accent}33` }}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={`${step.title} — workflow visual`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className={cn('flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b', theme.bg)}
                      >
                        <Icon className="h-8 w-8" style={{ color: theme.accent }} aria-hidden />
                        <div className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.18em] text-[var(--color-text-primary)]/50">
                          <ImageOff className="h-3 w-3" aria-hidden />
                          Image coming soon
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {/* Keeps the active card's accent subtly present in the ambient background. */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-20 transition-colors duration-500"
          style={{ background: `radial-gradient(ellipse 60% 50% at 70% 50%, ${activeTheme.accent}, transparent 70%)` }}
        />
      </div>
    </div>
  )
}
