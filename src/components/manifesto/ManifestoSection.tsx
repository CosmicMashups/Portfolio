import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { gsap } from '@/lib/motion/gsapScroll'
import { TopographicTexture } from '@/components/hero/TopographicTexture'

// Auto-discovers whatever images get dropped into src/assets/casual/ — no code
// change needed when photos are added. Renders the quote alone if the folder
// is still empty.
const CASUAL_MODULES = import.meta.glob<{ default: string }>(
  '/src/assets/casual/*.{jpg,jpeg,png,webp}',
  { eager: true },
)
const CASUAL_IMAGES = Object.keys(CASUAL_MODULES)
  .sort()
  .map((key) => CASUAL_MODULES[key].default)

/**
 * Manifesto — full-screen quote chapter inserted right after Origin. Checked
 * directly against landonorris.com's "CHALLENGING THE LIMITS, WINNING
 * RACES..." section: it's a single scroll-pinned chapter where one image
 * panel scrubs continuously (small + right-anchored -> large + centered ->
 * small again) while its source photo swaps at scroll-progress steps, and the
 * quote's own font-size grows with scroll — not a timer-driven crossfade in a
 * static layout.
 */
export function ManifestoSection() {
  const reduce = usePrefersReducedMotion()
  const [frame, setFrame] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const insetRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    if (reduce || !sectionRef.current || !quoteRef.current) return
    const steps = CASUAL_IMAGES.length

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            if (steps > 1) setFrame(Math.min(steps - 1, Math.floor(self.progress * steps)))
          },
        },
      })

      tl.fromTo(
        quoteRef.current,
        { fontSize: '7vw' },
        { fontSize: '10.5vw', duration: 1, ease: 'none' },
        0,
      )

      if (insetRef.current) {
        tl.fromTo(
          insetRef.current,
          { x: '32vw', y: '-6vh', scale: 0.4, autoAlpha: 0.85 },
          { x: 0, y: 0, scale: 1.15, autoAlpha: 1, duration: 0.65, ease: 'none' },
          0,
        ).to(insetRef.current, { x: 0, y: '4vh', scale: 0.42, duration: 0.35, ease: 'none' }, 0.65)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <div ref={sectionRef} id="manifesto" className="relative min-h-[280vh] w-full bg-[#0a0a0a]">
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden px-[var(--shell-gutter-sm)] sm:px-[var(--shell-gutter-md)] lg:px-[var(--shell-gutter-lg)]">
        <TopographicTexture />

        <span className="absolute left-[var(--shell-gutter-sm)] top-24 z-10 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-[#ff6b1a] sm:left-[var(--shell-gutter-md)] lg:left-[var(--shell-gutter-lg)]">
          02 // Manifesto
        </span>

        <h2
          ref={quoteRef}
          className="relative z-0 max-w-5xl text-center font-[var(--font-display)] uppercase leading-[0.95] tracking-[-0.01em] text-[#f5f5f0]"
          style={{ fontSize: '7vw' }}
        >
          Challenging the limits, shipping systems that hold up under real use, bringing the rigor to every release.
        </h2>

        {CASUAL_IMAGES.length > 0 && (
          <div
            ref={insetRef}
            className="pointer-events-none absolute z-10 h-[22vh] w-[22vh] overflow-hidden rounded-xl border border-white/15 shadow-2xl sm:h-[30vh] sm:w-[30vh]"
          >
            {CASUAL_IMAGES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: i === frame ? 1 : 0 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
