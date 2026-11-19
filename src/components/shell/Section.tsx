import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { cn } from '@/components/ui/cn'

/** Deepest near-black band — used for high-contrast chapter beats. */
export const DARK_TONE_VARS: Record<string, string> = {
  '--global-bg': '#0a0a0a',
  '--global-surface': '#0a0a0a',
  '--global-surface-elevated': '#141414',
  '--global-border': '#f5f5f0',
  '--global-text': '#f5f5f0',
  '--global-text-muted': '#9a9a94',
  '--surface-tint': 'rgba(10, 10, 10, 0.9)',
  '--chart-c': '#f5f5f0',
  '--color-bg-base': '#0a0a0a',
  '--color-bg-surface': '#0a0a0a',
  '--color-bg-elevated': '#141414',
  '--color-bg-glass': 'rgba(245, 245, 240, 0.04)',
  '--color-bg-glass-hover': 'rgba(245, 245, 240, 0.07)',
  '--color-text-primary': '#f5f5f0',
  '--color-text-secondary': '#f5f5f0',
  '--color-text-muted': '#9a9a94',
  '--color-text-inverse': '#0a0a0a',
  '--color-border-subtle': 'rgba(245, 245, 240, 0.08)',
  '--color-border-default': '#f5f5f0',
  '--color-border-strong': 'rgba(245, 245, 240, 0.24)',
}

/** Slightly elevated tonal band — still near-black-first, used to vary rhythm between chapters without breaking the cinematic feel. */
export const LIGHT_TONE_VARS: Record<string, string> = {
  '--global-bg': '#1a1a1a',
  '--global-surface': '#1a1a1a',
  '--global-surface-elevated': '#242424',
  '--global-border': '#f5f5f0',
  '--global-text': '#f5f5f0',
  '--global-text-muted': '#9a9a94',
  '--surface-tint': 'rgba(26, 26, 26, 0.9)',
  '--chart-c': '#f5f5f0',
  '--color-bg-base': '#1a1a1a',
  '--color-bg-surface': '#1a1a1a',
  '--color-bg-elevated': '#242424',
  '--color-bg-glass': 'rgba(245, 245, 240, 0.05)',
  '--color-bg-glass-hover': 'rgba(245, 245, 240, 0.08)',
  '--color-text-primary': '#f5f5f0',
  '--color-text-secondary': '#f5f5f0',
  '--color-text-muted': '#9a9a94',
  '--color-text-inverse': '#1a1a1a',
  '--color-border-subtle': 'rgba(245, 245, 240, 0.1)',
  '--color-border-default': '#f5f5f0',
  '--color-border-strong': 'rgba(245, 245, 240, 0.26)',
}

export function Section({
  id,
  title,
  kicker,
  className,
  headerClassName,
  children,
  hideHeader = false,
  tone,
  bleed = true,
  paintBackground = true,
}: {
  id: string
  title?: ReactNode
  kicker?: ReactNode
  className?: string
  headerClassName?: string
  children: ReactNode
  hideHeader?: boolean
  tone?: 'light' | 'dark'
  /** Set false when already nested inside a full-bleed ancestor (skips the -50vw breakout). */
  bleed?: boolean
  /** Set false to apply the tone's text color/CSS vars without painting an opaque
   * background — for sections layered over shared visuals (e.g. a pinned hero backdrop). */
  paintBackground?: boolean
}) {
  const reduce = usePrefersReducedMotion()

  const toneStyle =
    tone === 'dark'
      ? // Pinned near-black/signal band — always dark, independent of the
        // site's own light/dark toggle (used for hero-adjacent chrome that sits
        // over the fixed dark photo backdrop).
        { ...(paintBackground ? { background: '#0a0a0a' } : {}), color: '#f5f5f0', ...DARK_TONE_VARS }
      : tone === 'light'
        ? // Theme-aware surface: `--global-*` already flips correctly with
          // `data-theme`, so this just paints using the live variables instead of
          // hardcoding light-mode hex values that used to ignore the toggle.
          { ...(paintBackground ? { background: 'var(--global-bg)' } : {}), color: 'var(--global-text)' }
        : undefined

  return (
    <motion.section
      id={id}
      data-tone={tone}
      style={toneStyle}
      className={cn(
        // Full-bleed breakout: the ancestor page wrapper is a centered max-width column,
        // so this cancels that constraint and re-centers on the true viewport — the
        // section's own background always spans edge-to-edge. Content width/padding is
        // reapplied by the inner wrapper below, not by this element. Skipped via `bleed`
        // when the caller is already nested inside a full-bleed ancestor.
        bleed && 'relative left-1/2 right-1/2 -mx-[50vw] w-screen',
        'scroll-mt-[calc(var(--shell-header-height)+2.5rem)] sm:scroll-mt-[calc(var(--shell-header-height)+3rem)] py-[var(--section-vertical-rhythm)] md:py-[var(--section-vertical-rhythm-md)] lg:py-[var(--section-vertical-rhythm-lg)]',
      )}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, margin: '-12% 0px' }}
      variants={fadeInUp}
    >
      <div
        className={cn(
          'mx-auto max-w-[var(--shell-content-max-width)] px-[var(--shell-gutter-sm)] sm:px-[var(--shell-gutter-md)] lg:px-[var(--shell-gutter-lg)]',
          className,
        )}
      >
        {!hideHeader && (kicker != null || title != null) ? (
          <div
            className={cn(
              'mb-8 flex flex-col gap-3 border-b border-[var(--global-border)] pb-6 md:mb-10 md:pb-7',
              headerClassName,
            )}
          >
            {kicker != null ? (
              typeof kicker === 'string' ? (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">{kicker}</p>
              ) : (
                <div>{kicker}</div>
              )
            ) : null}
            {title != null ? (
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--global-text)] md:text-4xl">{title}</h2>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </motion.section>
  )
}
