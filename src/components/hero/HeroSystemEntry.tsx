import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
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

/**
 * Origin — full-bleed portrait hero. The name renders as a massive wordmark
 * overlapping the bottom third of the photo (landonorris.com's actual
 * composition), not a small side-by-side badge. Hover/tap crossfades the
 * portrait from smiling (default) to serious.
 */
export function HeroSystemEntry() {
  const reduce = usePrefersReducedMotion()
  const [altPortrait, setAltPortrait] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)

  const handleExplore = () => {
    smoothScrollTo('projects', { updateHash: true })
  }

  const handleScrollToMap = () => {
    smoothScrollTo('system-overview', { updateHash: true })
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
    <header
      id="hero"
      className="relative flex min-h-svh w-full flex-col overflow-hidden bg-[#0a0a0a]"
      onMouseEnter={() => setAltPortrait(true)}
      onMouseLeave={() => setAltPortrait(false)}
    >
      {/* Full-bleed portrait, crossfades smiling -> serious on hover */}
      <div ref={frameRef} className="absolute inset-0">
        <img
          src={mainPortraitUrl}
          alt="Yuri Brown"
          className="absolute inset-0 h-full w-full object-cover grayscale transition-opacity duration-700"
          style={{ opacity: altPortrait ? 0 : 1 }}
        />
        <img
          src={mainAltPortraitUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover grayscale transition-opacity duration-700"
          style={{ opacity: altPortrait ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/35 to-[#0a0a0a]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(255,107,26,0.12),transparent_60%)]" />
      </div>

      <TopographicTexture />

      {/* Top status strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: motionEase }}
        className="relative z-10 flex items-center justify-between px-[var(--shell-gutter-sm)] pt-24 sm:px-[var(--shell-gutter-md)] sm:pt-28 lg:px-[var(--shell-gutter-lg)] lg:pt-32"
      >
        <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[#ff6b1a]">
          01 // Origin
        </span>
        <div className="hidden items-center gap-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[#f5f5f0]/60 md:flex">
          <span>Manila</span>
          <span className="text-white/25">·</span>
          <span>UTC+8</span>
          <span className="text-white/25">·</span>
          <span className="text-[#ff6b1a]">Available for High-Impact Roles</span>
        </div>
      </motion.div>

      {/* Wordmark overlapping the bottom third of the photo */}
      <div className="relative z-10 mt-auto flex flex-col gap-4 px-[var(--shell-gutter-sm)] pb-10 sm:px-[var(--shell-gutter-md)] lg:px-[var(--shell-gutter-lg)] lg:pb-14">
        <motion.h1
          ref={nameRef}
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="font-[var(--font-display)] text-[18vw] uppercase leading-[0.82] tracking-[-0.01em] text-[#f5f5f0] sm:text-[13vw] md:text-[10vw] lg:text-[8rem]"
        >
          {HERO_NAME}
        </motion.h1>

        <motion.p
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="max-w-xl text-sm font-medium uppercase tracking-[0.1em] text-[#f5f5f0]/80 sm:text-base"
        >
          Software / ML engineer — systems portfolio since {new Date().getFullYear() - 2}
        </motion.p>

        <motion.p
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="max-w-xl text-base font-light leading-relaxed text-[#f5f5f0]/85 sm:text-lg"
        >
          I architect and ship machine learning systems, full-stack platforms, and offline-first mobile applications
          for real-world constraints.
        </motion.p>

        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="flex flex-wrap items-center gap-3 pt-1 font-[var(--font-mono)] text-xs text-[#f5f5f0]/70"
        >
          <span className="inline-flex items-center gap-1.5">
            <strong className="text-sm font-semibold text-[#ff6b1a]">{PROJECTS.length}</strong> Shipped Systems
          </span>
          <span className="text-white/20" aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <strong className="text-sm font-semibold text-[#ff6b1a]">1</strong> Published Thesis
          </span>
        </motion.div>

        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <button
            type="button"
            onClick={handleExplore}
            className="group inline-flex items-center gap-2 rounded-full border border-[#ff6b1a] bg-[#ff6b1a] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0a0a0a] shadow-[0_2px_16px_rgba(255,107,26,0.3)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
          >
            <span>Explore the Work</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </button>

          <a
            href={RESUME_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            download="Brown_Resume.pdf"
            className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#f5f5f0] backdrop-blur-md transition-all hover:border-[#ff6b1a] hover:text-[#ff6b1a] active:scale-[0.98]"
          >
            <FileText className="h-4 w-4 text-[#ff6b1a] transition-transform group-hover:scale-110" aria-hidden />
            <span>Résumé / CV</span>
          </a>

          <Link
            to="/thoughts"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#f5f5f0]/75 underline-offset-4 hover:text-[#f5f5f0] hover:underline"
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
          className="group mt-4 flex items-center gap-2.5 self-start font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[#f5f5f0]/60 transition-colors hover:text-[#ff6b1a]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/25 transition-all group-hover:border-[#ff6b1a] group-hover:bg-[#ff6b1a]/10">
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden />
          </span>
          <span>Next: How I Build</span>
        </motion.button>
      </div>
    </header>
  )
}
