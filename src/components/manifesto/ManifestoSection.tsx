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
 * Manifesto — full-screen quote chapter inserted right after Origin. The
 * quote itself stays a fixed size; only the image panel scrubs continuously
 * with scroll (small, upper-right -> large, centered -> small again), its
 * source photo swapping at scroll-progress steps, matching landonorris.com's
 * "CHALLENGING THE LIMITS..." section.
 */
export function ManifestoSection() {
  const reduce = usePrefersReducedMotion()
  const [frame, setFrame] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const insetRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (reduce || !sectionRef.current || !insetRef.current) return
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
        insetRef.current,
        { x: '26vw', y: '-24vh', scale: 0.4, autoAlpha: 0.85 },
        { x: 0, y: 0, scale: 1.15, autoAlpha: 1, duration: 0.65, ease: 'none' },
        0,
      ).to(insetRef.current, { x: 0, y: '4vh', scale: 0.42, duration: 0.35, ease: 'none' }, 0.65)
    }, sectionRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <div ref={sectionRef} id="manifesto" className="relative min-h-[280vh] w-full bg-[#0a0a0a]">
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden px-[var(--shell-gutter-sm)] sm:px-[var(--shell-gutter-md)] lg:px-[var(--shell-gutter-lg)]">
        <TopographicTexture />

        <h2 className="relative z-0 max-w-5xl text-center font-[var(--font-display)] text-[7vw] uppercase leading-[0.95] tracking-[-0.01em] text-[#f5f5f0] sm:text-6xl">
          <span className="text-[#ff6b1a]">Challenging the limits</span>, shipping systems that hold up under real
          use, bringing <span className="text-[#ff6b1a]">the rigor</span> to every release.
        </h2>

        {CASUAL_IMAGES.length > 0 && (
          <div
            ref={insetRef}
            className="pointer-events-none absolute z-10 aspect-[3/4] h-[26vh] overflow-hidden rounded-md border border-white/15 shadow-2xl sm:h-[34vh]"
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
