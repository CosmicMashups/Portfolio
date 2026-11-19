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
          // Starts as soon as the chapter begins entering the viewport (not
          // only once it's fully in view / pinned) — end stays tied to the
          // chapter's natural exit.
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            if (steps > 1) setFrame(Math.min(steps - 1, Math.floor(self.progress * steps)))
          },
        },
      })

      // Diagonal path: starts upper-right at a moderate size, travels down-left
      // through the center at its largest, then continues down well clear of
      // the quote's own text block so it never overlaps on exit.
      tl.fromTo(
        insetRef.current,
        { x: '28vw', y: '-26vh', scale: 0.55, autoAlpha: 0.9 },
        { x: '-4vw', y: '2vh', scale: 1.2, autoAlpha: 1, duration: 0.5, ease: 'none' },
        0,
      ).to(insetRef.current, { x: 0, y: '30vh', scale: 0.3, autoAlpha: 1, duration: 0.5, ease: 'none' }, 0.5)
    }, sectionRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <div ref={sectionRef} id="manifesto" className="relative min-h-[280vh] w-full bg-[#0a0a0a]">
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden px-[var(--shell-gutter-sm)] sm:px-[var(--shell-gutter-md)] lg:px-[var(--shell-gutter-lg)]">
        <TopographicTexture />

        <h2 className="relative z-0 max-w-6xl text-center font-[var(--font-display)] text-[clamp(2.75rem,9vw,7.5rem)] uppercase leading-[0.95] tracking-[-0.01em] text-[#f5f5f0]">
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
