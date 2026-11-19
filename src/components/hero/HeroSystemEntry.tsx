import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { ArrowUpRight, FileText, ChevronDown } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { fadeInUp, motionEase } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { PROJECTS } from '@/config/projects.registry'
import { RESUME_PDF_URL } from '@/config/resume'
import { smoothScrollTo } from '@/lib/motion/gsapScroll'
import { gsap } from '@/lib/motion/gsapScroll'
import { TopographicTexture } from '@/components/hero/TopographicTexture'

import mainPortraitUrl from '@/assets/main.png'
import mainAltPortraitUrl from '@/assets/main_alt.png'

const HERO_NAME = 'Yuri Brown'
const REVEAL_RADIUS_PX = 170

/**
 * Origin — full-bleed portrait hero. The name renders as a massive wordmark
 * overlapping the bottom third of the photo (landonorris.com's actual
 * composition), not a small side-by-side badge. Hovering the portrait reveals
 * the serious (main_alt) photo only in a circular region following the cursor
 * (landonorris.com's actual hover treatment), not a full-image crossfade.
 */
export function HeroSystemEntry() {
  const reduce = usePrefersReducedMotion()
  const [revealing, setRevealing] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const altImgRef = useRef<HTMLImageElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)

  const handlePointerMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const frame = frameRef.current
    const altImg = altImgRef.current
    if (!frame || !altImg) return
    const rect = frame.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    altImg.style.setProperty('--mx', `${x}px`)
    altImg.style.setProperty('--my', `${y}px`)
  }

  const handleExplore = () => {
    smoothScrollTo('projects', { updateHash: true })
  }

  const handleScrollToMap = () => {
    smoothScrollTo('manifesto', { updateHash: true })
  }

  useGSAP(() => {
    if (reduce || !frameRef.current || !nameRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frameRef.current,
        { scale: 1 },
        {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
        },
      )
      gsap.fromTo(
        nameRef.current,
        { y: 0 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
        },
      )
    })
    return () => ctx.revert()
  }, [reduce])

  return (
    <header id="hero" className="relative flex min-h-svh w-full flex-col overflow-hidden bg-[var(--color-bg-base)]">
      {/* Ambient amber glow behind the portrait panel — a single full-bleed radial gradient
          (no blur filter, nothing for the header's overflow-hidden to clip into a hard
          edge) that fades to fully transparent well before every edge of the viewport, so
          it reads as a soft ambient wash rather than a hard-edged patch or visible seam. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 62% 40%, color-mix(in oklab, var(--color-accent-primary) 18%, transparent), transparent 70%)',
        }}
      />

      {/* Portrait panel, right-anchored at full height so the near-square source photo
          isn't forced to cover the full (much wider) viewport width — that was cropping
          it down to an over-zoomed close-up of just the face. Hovering reveals the serious
          (main_alt) photo only in a circular region that follows the cursor, matching
          landonorris.com's hover treatment — not a full-image crossfade. */}
      <div
        ref={frameRef}
        className="absolute inset-y-0 right-0 w-full sm:w-[72%] md:w-[60%] lg:w-[52%]"
        onMouseEnter={() => setRevealing(true)}
        onMouseLeave={() => setRevealing(false)}
        onMouseMove={handlePointerMove}
      >
        <img
          src={mainPortraitUrl}
          alt="Yuri Brown"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <img
          ref={altImgRef}
          src={mainAltPortraitUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-100"
          style={{
            opacity: revealing ? 1 : 0,
            // Hard-edged circle (no soft falloff) — landonorris.com's actual hover patch is a
            // crisp cutout, not a blurred spotlight.
            maskImage: `radial-gradient(${REVEAL_RADIUS_PX}px circle at var(--mx, 50%) var(--my, 50%), black 99%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(${REVEAL_RADIUS_PX}px circle at var(--mx, 50%) var(--my, 50%), black 99%, transparent 100%)`,
          }}
        />
        {/* Blend the photo's left edge into the near-black background so the text column reads cleanly */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-base)] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-base)] via-[var(--color-bg-base)]/20 to-transparent" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[var(--color-bg-base)]" />

      <TopographicTexture />

      {/* Top status strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: motionEase }}
        className="relative z-10 flex items-center justify-between px-[var(--shell-gutter-sm)] pt-24 sm:px-[var(--shell-gutter-md)] sm:pt-28 lg:px-[var(--shell-gutter-lg)] lg:pt-32"
      >
        <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent-primary)]">
          01 // Origin
        </span>
        <div className="hidden items-center gap-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-primary)]/60 md:flex">
          <span>Manila</span>
          <span className="text-white/25">·</span>
          <span>UTC+8</span>
          <span className="text-white/25">·</span>
          <span className="text-[var(--color-accent-primary)]">Available for High-Impact Roles</span>
        </div>
      </motion.div>

      {/* Wordmark overlapping the bottom third of the photo. pointer-events-none here (with
          pointer-events-auto on each interactive child below) so this full-width flex item
          doesn't sit over — and block hover on — the portrait's lower portion. */}
      <div className="relative z-10 mt-auto flex flex-col gap-4 px-[var(--shell-gutter-sm)] pb-10 pointer-events-none sm:px-[var(--shell-gutter-md)] lg:px-[var(--shell-gutter-lg)] lg:pb-14">
        <motion.h1
          ref={nameRef}
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="font-[var(--font-display)] text-[18vw] uppercase leading-[0.82] tracking-[-0.01em] text-[var(--color-text-primary)] sm:text-[13vw] md:text-[10vw] lg:text-[8rem]"
        >
          {HERO_NAME}
        </motion.h1>

        <motion.p
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="max-w-xl text-sm font-medium uppercase tracking-[0.1em] text-[var(--color-text-primary)]/80 sm:text-base"
        >
          Software / ML engineer
        </motion.p>

        <motion.p
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="max-w-xl text-base font-light leading-relaxed text-[var(--color-text-primary)]/85 sm:text-lg"
        >
          I architect and ship machine learning systems, full-stack platforms, and offline-first mobile applications
          for real-world constraints.
        </motion.p>

        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="flex flex-wrap items-center gap-3 pt-1 font-[var(--font-mono)] text-xs text-[var(--color-text-primary)]/70"
        >
          <span className="inline-flex items-center gap-1.5">
            <strong className="text-sm font-semibold text-[var(--color-accent-primary)]">{PROJECTS.length}</strong> Shipped Systems
          </span>
          <span className="text-white/20" aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <strong className="text-sm font-semibold text-[var(--color-accent-primary)]">1</strong> Published Thesis
          </span>
        </motion.div>

        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="pointer-events-auto flex flex-wrap items-center gap-4 pt-2"
        >
          <button
            type="button"
            onClick={handleExplore}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-inverse)] shadow-[0_2px_16px_rgba(255,107,26,0.3)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
          >
            <span>Explore the Work</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </button>

          <a
            href={RESUME_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            download="Brown_Resume.pdf"
            className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-primary)] backdrop-blur-md transition-all hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] active:scale-[0.98]"
          >
            <FileText className="h-4 w-4 text-[var(--color-accent-primary)] transition-transform group-hover:scale-110" aria-hidden />
            <span>Résumé / CV</span>
          </a>

          <Link
            to="/thoughts"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[var(--color-text-primary)]/75 underline-offset-4 hover:text-[var(--color-text-primary)] hover:underline"
          >
            <span>Engineering notes</span>
            <span aria-hidden>→</span>
          </Link>
        </motion.div>

        <motion.button
          type="button"
          onClick={handleScrollToMap}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="group pointer-events-auto mt-4 flex items-center gap-2.5 self-start font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-primary)]/60 transition-colors hover:text-[var(--color-accent-primary)]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/25 transition-all group-hover:border-[var(--color-accent-primary)] group-hover:bg-[var(--color-accent-primary-dim)]">
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden />
          </span>
          <span>Next: Manifesto</span>
        </motion.button>
      </div>
    </header>
  )
}
