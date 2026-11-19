import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { chapterEnter } from '@/lib/motion/presets'
import { TopographicTexture } from '@/components/hero/TopographicTexture'

/**
 * Full-width all-caps title band opening a chapter — landonorris.com's "OFF THE
 * TRACK" / "REDEFINING LIMITS" treatment between photo/content sections. One-shot
 * reveal (not scroll-linked) since this is a title card, not a storytelling scrub.
 */
export function ChapterTitleCard({
  kicker,
  title,
  subtitle,
}: {
  kicker: string
  title: ReactNode
  subtitle?: string
}) {
  const reduce = usePrefersReducedMotion()

  return (
    <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden bg-[#0a0a0a] px-[var(--shell-gutter-sm)] py-20 text-center sm:px-[var(--shell-gutter-md)] sm:py-28 lg:px-[var(--shell-gutter-lg)]">
      <TopographicTexture />
      <motion.span
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={chapterEnter}
        className="relative z-10 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-[#ff6b1a]"
      >
        {kicker}
      </motion.span>
      <motion.h2
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={chapterEnter}
        className="relative z-10 max-w-5xl font-[var(--font-display)] text-[12vw] uppercase leading-[0.9] tracking-[-0.01em] text-[#f5f5f0] sm:text-7xl md:text-8xl"
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, margin: '-10% 0px' }}
          variants={chapterEnter}
          className="relative z-10 max-w-xl text-sm text-[#f5f5f0]/70 sm:text-base"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </div>
  )
}
