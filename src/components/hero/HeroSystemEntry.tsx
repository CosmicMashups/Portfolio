import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { ScrollHint } from '@/components/shell/ScrollHint'
import { fadeInUp } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { PROJECTS } from '@/config/projects.registry'
import { RESUME_PDF_URL } from '@/config/resume'
import profilePhotoUrl from '@/assets/profile.png'

const HERO_NAME = 'Yuri Brown'

/**
 * Hero text content — headline, body copy, and the bottom info/résumé cards.
 * Renders over the shared sticky backdrop from `HeroPinnedVisual`, which a
 * parent (`HeroPinnedSection`) positions behind this as a sibling.
 */
export function HeroSystemEntry() {
  const reduce = usePrefersReducedMotion()

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      id="hero"
      className="relative z-10 flex min-h-svh w-full flex-col text-[#fafffa] md:min-h-[100svh]"
    >
      {/* Vertically-centered open wood band: tagline + wordmark + body copy,
          kept clear of the plant (top-left), laptop (top-right) and keys
          (right edge) in the desk photo. */}
      <div className="relative z-20 flex flex-1 flex-col justify-center gap-4 px-[var(--shell-gutter-sm)] pt-24 sm:px-[var(--shell-gutter-md)] lg:px-[var(--shell-gutter-lg)] lg:pt-0">
        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="max-w-2xl md:mx-auto md:text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#fafffa]/75">
            AI · ML · Full-Stack
          </p>
          <h1 className="mt-2 font-[var(--font-display)] text-[15vw] font-normal leading-[0.85] tracking-[-0.02em] text-[#fafffa] sm:text-[11vw] md:text-[7vw] lg:text-[5.5rem]">
            {HERO_NAME}
          </h1>
        </motion.div>

        <motion.p
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="max-w-sm text-base leading-snug text-[#fafffa]/85 md:mx-auto md:max-w-md md:text-center md:text-lg"
        >
          I build systems for the problems I&apos;ve lived through myself.
        </motion.p>
      </div>

      {/* Bottom-left/center open wood area: info card + résumé card, kept
          clear of the notebook + coffee cup in the bottom-right corner. */}
      <div className="relative z-20 flex flex-col gap-4 px-[var(--shell-gutter-sm)] pb-8 sm:px-[var(--shell-gutter-md)] lg:flex-row lg:items-end lg:justify-start lg:gap-6 lg:px-[var(--shell-gutter-lg)] lg:pb-12">
        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="max-w-sm rounded-[14px] border border-[#fafffa]/25 bg-[#121613]/55 p-5 backdrop-blur-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#fafffa]">
            Software / ML Engineer
          </p>
          <div className="my-3 border-t border-dashed border-[#fafffa]/30" />
          <p className="text-sm leading-relaxed text-[#fafffa]/75">
            {PROJECTS.length} shipped projects and one published thesis — systems built from problems lived
            through firsthand.
          </p>
          <button
            type="button"
            onClick={scrollToProjects}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#d3fa99] hover:underline"
          >
            View work
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </motion.div>

        <motion.a
          href={RESUME_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          download="Brown_Resume.pdf"
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="group flex w-full max-w-[220px] items-center gap-3 self-end rounded-[14px] border border-dashed border-[#d3fa99]/70 bg-[#121613]/55 p-3 backdrop-blur-sm transition-colors hover:border-[#d3fa99] lg:self-auto"
        >
          <img
            src={profilePhotoUrl}
            alt="Yuri Brown"
            className="h-14 w-14 shrink-0 rounded-[10px] object-cover"
          />
          <span className="flex flex-1 items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[#d3fa99]">
            Résumé
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </motion.a>
      </div>

      <Link
        to="/thoughts"
        className="relative z-20 mb-3 self-center text-xs text-[#fafffa]/70 underline-offset-4 hover:text-[#fafffa] hover:underline"
      >
        Read thoughts →
      </Link>

      <div className="relative z-20 mb-5 hidden self-center md:block">
        <ScrollHint className="mt-0 text-[#fafffa]/70" />
      </div>
    </header>
  )
}
