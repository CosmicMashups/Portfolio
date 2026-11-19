import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { ArrowUpRight, FileText, ChevronDown } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { fadeInUp, motionEase } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { PROJECTS } from '@/config/projects.registry'
import { RESUME_PDF_URL } from '@/config/resume'
import { smoothScrollTo } from '@/lib/motion/gsapScroll'
import { gsap, ScrollTrigger } from '@/lib/motion/gsapScroll'

import mainPortraitUrl from '@/assets/main.png'
import mainAltPortraitUrl from '@/assets/main_alt.png'

const HERO_NAME = 'Yuri Brown'

/**
 * Origin — the opening chapter beat. Left-anchored typographic composition with a
 * two-image portrait (smiling default, serious on hover) as the single photographic
 * element in the hero. The GSAP scale/parallax on the portrait is tied to the hero
 * pin's own scroll progress, so holding on this beat does more storytelling work than
 * a static fade-out.
 */
export function HeroSystemEntry() {
  const reduce = usePrefersReducedMotion()
  const portraitRef = useRef<HTMLDivElement>(null)

  const handleExplore = () => {
    smoothScrollTo('projects', { updateHash: true })
  }

  const handleScrollToMap = () => {
    smoothScrollTo('system-overview', { updateHash: true })
  }

  useGSAP(() => {
    if (reduce || !portraitRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        portraitRef.current,
        { scale: 1 },
        {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })
    return () => ctx.revert()
  }, [reduce])

  return (
    <header
      id="hero"
      className="relative z-10 flex min-h-svh w-full flex-col justify-between px-[var(--shell-gutter-sm)] pb-10 pt-24 sm:px-[var(--shell-gutter-md)] sm:pt-28 lg:px-[var(--shell-gutter-lg)] lg:pb-14 lg:pt-32"
    >
      {/* Top Status Strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: motionEase }}
        className="flex items-center justify-between"
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

      {/* Main Editorial Core (Left-anchored to give 3D model space on desktop) */}
      <div className="my-auto flex max-w-2xl flex-col gap-6 lg:max-w-3xl">
        {/* Name + Portrait Badge Lockup */}
        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:gap-6"
        >
          <h1 className="font-[var(--font-display)] text-[16vw] uppercase leading-[0.86] tracking-[-0.01em] text-[var(--color-text-primary)] sm:text-[11vw] md:text-[8vw] lg:text-[6.25rem]">
            {HERO_NAME}
          </h1>

          {/* Portrait badge: smiling default, crossfades to serious on hover */}
          <div ref={portraitRef} className="group relative flex-shrink-0">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[var(--color-accent-primary)]/30 to-white/10 opacity-75 blur-md transition-all group-hover:opacity-100 group-hover:blur-lg" />
            <div className="relative h-20 w-16 overflow-hidden rounded-2xl border border-white/15 bg-[var(--color-bg-elevated)]/90 shadow-2xl backdrop-blur-md sm:h-24 sm:w-20 md:h-28 md:w-24">
              <img
                src={mainPortraitUrl}
                alt="Yuri Brown"
                className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 group-hover:opacity-0"
              />
              <img
                src={mainAltPortraitUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-bg-elevated)]/80 via-transparent to-transparent" />
              <div className="absolute bottom-1.5 left-2 flex items-center gap-1 font-[var(--font-mono)] text-[8px] uppercase tracking-wider text-[var(--color-accent-primary)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-primary)]" />
                <span className="font-semibold">YURI</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="max-w-xl text-lg font-light leading-relaxed text-[var(--color-text-primary)]/85 sm:text-xl md:text-2xl"
        >
          I architect and ship machine learning systems, full-stack platforms, and offline-first mobile applications for real-world constraints.
        </motion.p>

        {/* Shipped Signal Proof Strip */}
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
          <span className="text-white/20" aria-hidden>·</span>
          <span>Edge Neural Nets & Full-Stack</span>
        </motion.div>

        {/* Action Controls */}
        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="flex flex-wrap items-center gap-4 pt-2"
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
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-[var(--color-bg-elevated)]/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-primary)] backdrop-blur-md transition-all hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] active:scale-[0.98]"
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
      </div>

      {/* Bottom Cue to next chapter */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="flex items-center justify-between pt-6"
      >
        <button
          type="button"
          onClick={handleScrollToMap}
          className="group flex items-center gap-2.5 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-primary)]/60 transition-colors hover:text-[var(--color-accent-primary)]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 transition-all group-hover:border-[var(--color-accent-primary)] group-hover:bg-[var(--color-accent-primary)]/10">
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden />
          </span>
          <span>Next: How I Build</span>
        </button>

        <span className="hidden font-[var(--font-mono)] text-[10px] tracking-[0.15em] text-[var(--color-text-primary)]/40 sm:block">
          SCROLL TO CONTINUE THE STORY
        </span>
      </motion.div>
    </header>
  )
}
