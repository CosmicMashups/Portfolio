import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, FileText, ChevronDown } from 'lucide-react'
import { fadeInUp, motionEase } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { PROJECTS } from '@/config/projects.registry'
import { RESUME_PDF_URL } from '@/config/resume'
import { smoothScrollTo } from '@/lib/motion/gsapScroll'

import yuriPortraitUrl from '@/assets/yuri-portrait.jpg'

const HERO_NAME = 'Yuri Brown'

/**
 * Editorial Hero Entry: Left-anchored typographic composition designed in harmony
 * with Yuri's portrait badge and the 3D smartphone resting in the right-hand visual stage.
 */
export function HeroSystemEntry() {
  const reduce = usePrefersReducedMotion()

  const handleExplore = () => {
    smoothScrollTo('projects', { updateHash: true })
  }

  const handleScrollToMap = () => {
    smoothScrollTo('system-overview', { updateHash: true })
  }

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
        <div />

        <div className="hidden items-center gap-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[#fafffa]/60 md:flex">
          <span>Manila</span>
          <span className="text-white/25">·</span>
          <span>UTC+8</span>
          <span className="text-white/25">·</span>
          <span className="text-[#d3fa99]">Available for High-Impact Roles</span>
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
          <h1 className="font-[var(--font-display)] text-[14vw] font-normal leading-[0.86] tracking-[-0.03em] text-[#fafffa] sm:text-[10vw] md:text-[7vw] lg:text-[5.75rem]">
            {HERO_NAME}
          </h1>

          {/* Yuri's Cutout Portrait Badge with Glow & Ring */}
          <div className="group relative flex-shrink-0">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#d3fa99]/30 to-white/10 opacity-75 blur-md transition-all group-hover:opacity-100 group-hover:blur-lg" />
            <div className="relative h-20 w-16 overflow-hidden rounded-2xl border border-white/20 bg-[#121613]/90 shadow-2xl backdrop-blur-md sm:h-24 sm:w-20 md:h-28 md:w-24">
              <img
                src={yuriPortraitUrl}
                alt="Yuri Brown"
                className="h-full w-full object-cover object-top filter grayscale contrast-110 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121613]/80 via-transparent to-transparent" />
              <div className="absolute bottom-1.5 left-2 flex items-center gap-1 font-[var(--font-mono)] text-[8px] uppercase tracking-wider text-[#d3fa99]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d3fa99]" />
                <span className="font-semibold">YURI</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="max-w-xl text-lg font-light leading-relaxed text-[#fafffa]/85 sm:text-xl md:text-2xl"
        >
          I architect and ship machine learning systems, full-stack platforms, and offline-first mobile applications for real-world constraints.
        </motion.p>

        {/* Shipped Signal Proof Strip */}
        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="flex flex-wrap items-center gap-3 pt-1 font-[var(--font-mono)] text-xs text-[#fafffa]/70"
        >
          <span className="inline-flex items-center gap-1.5">
            <strong className="text-sm font-semibold text-[#d3fa99]">{PROJECTS.length}</strong> Shipped Systems
          </span>
          <span className="text-white/20" aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <strong className="text-sm font-semibold text-[#d3fa99]">1</strong> Published Thesis
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
            className="group inline-flex items-center gap-2 rounded-full border border-[#d3fa99] bg-[#d3fa99] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#121613] shadow-[0_2px_16px_rgba(211,250,153,0.25)] transition-all hover:bg-[#c4f285] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Architecture</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </button>

          <a
            href={RESUME_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            download="Brown_Resume.pdf"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#121613]/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#fafffa] backdrop-blur-md transition-all hover:border-[#d3fa99] hover:text-[#d3fa99] active:scale-[0.98]"
          >
            <FileText className="h-4 w-4 text-[#d3fa99] transition-transform group-hover:scale-110" aria-hidden />
            <span>Résumé / CV</span>
          </a>

          <Link
            to="/thoughts"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#fafffa]/75 underline-offset-4 hover:text-[#fafffa] hover:underline"
          >
            <span>Engineering notes</span>
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>

      {/* Bottom Cue to Capability Map */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="flex items-center justify-between pt-6"
      >
        <button
          type="button"
          onClick={handleScrollToMap}
          className="group flex items-center gap-2.5 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[#fafffa]/60 transition-colors hover:text-[#d3fa99]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 transition-all group-hover:border-[#d3fa99] group-hover:bg-[#d3fa99]/10">
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden />
          </span>
          <span>Capability Architecture Map</span>
        </button>

        <span className="hidden font-[var(--font-mono)] text-[10px] tracking-[0.15em] text-[#fafffa]/40 sm:block">
          SCROLL TO INSPECT LIVE HARDWARE RUNTIME
        </span>
      </motion.div>
    </header>
  )
}
