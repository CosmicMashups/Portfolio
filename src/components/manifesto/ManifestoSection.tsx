import { useEffect, useRef, useState } from 'react'
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

const SWITCH_INTERVAL_MS = 2600

/**
 * Manifesto — full-screen quote chapter inserted right after Origin, matching
 * landonorris.com's "CHALLENGING THE LIMITS, WINNING RACES..." pull-quote
 * treatment: a bold multi-line statement with a small photo inset that
 * auto-cycles through a rotating set of casual/candid shots.
 */
export function ManifestoSection() {
  const reduce = usePrefersReducedMotion()
  const [frame, setFrame] = useState(0)
  const insetRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduce || CASUAL_IMAGES.length < 2) return
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % CASUAL_IMAGES.length)
    }, SWITCH_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reduce])

  useGSAP(() => {
    if (reduce || !insetRef.current || !ghostRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        insetRef.current,
        { scale: 0.92 },
        {
          scale: 1.05,
          ease: 'none',
          scrollTrigger: { trigger: '#manifesto', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.fromTo(
        ghostRef.current,
        { xPercent: -4 },
        {
          xPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: '#manifesto', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })
    return () => ctx.revert()
  }, [reduce])

  return (
    <section
      id="manifesto"
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#0a0a0a] px-[var(--shell-gutter-sm)] py-24 sm:px-[var(--shell-gutter-md)] lg:px-[var(--shell-gutter-lg)]"
    >
      <TopographicTexture />

      <span className="relative z-10 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-[#ff6b1a]">
        02 // Manifesto
      </span>

      <div className="relative mt-20 flex max-w-5xl flex-wrap items-center justify-center gap-x-4 text-center">
        <span
          ref={ghostRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none font-[var(--font-display)] text-[16vw] uppercase leading-none text-[#f5f5f0]/[0.06] sm:text-[11vw]"
        >
          Rigor
        </span>

        <h2 className="relative z-10 font-[var(--font-display)] text-[11vw] uppercase leading-[0.95] tracking-[-0.01em] text-[#f5f5f0] sm:text-6xl md:text-7xl">
          Shipping systems that hold up under real use, bringing{' '}
          {CASUAL_IMAGES.length > 0 && (
            <span
              ref={insetRef}
              className="relative mx-2 inline-block h-[0.9em] w-[1.6em] align-middle overflow-hidden rounded-xl border border-white/15 sm:mx-3"
            >
              {CASUAL_IMAGES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                  style={{ opacity: i === frame ? 1 : 0 }}
                />
              ))}
            </span>
          )}{' '}
          the rigor to every release, every chapter of this page.
        </h2>
      </div>
    </section>
  )
}
