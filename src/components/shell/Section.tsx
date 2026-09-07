import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { cn } from '@/components/ui/cn'

export const DARK_TONE_VARS: Record<string, string> = {
  '--global-bg': '#121613',
  '--global-surface': '#121613',
  '--global-surface-elevated': '#121613',
  '--global-border': '#fafffa',
  '--global-text': '#fafffa',
  '--global-text-muted': '#516254',
  '--surface-tint': 'rgba(18, 22, 19, 0.9)',
  '--chart-c': '#fafffa',
  '--color-bg-base': '#121613',
  '--color-bg-surface': '#121613',
  '--color-bg-elevated': '#121613',
  '--color-bg-glass': 'rgba(250, 255, 250, 0.04)',
  '--color-bg-glass-hover': 'rgba(250, 255, 250, 0.07)',
  '--color-text-primary': '#fafffa',
  '--color-text-secondary': '#fafffa',
  '--color-text-muted': '#516254',
  '--color-text-inverse': '#121613',
  '--color-border-subtle': 'rgba(250, 255, 250, 0.08)',
  '--color-border-default': '#fafffa',
  '--color-border-strong': 'rgba(250, 255, 250, 0.24)',
}

export const LIGHT_TONE_VARS: Record<string, string> = {
  '--global-bg': '#fafffa',
  '--global-surface': '#fafffa',
  '--global-surface-elevated': '#fafffa',
  '--global-border': '#121613',
  '--global-text': '#121613',
  '--global-text-muted': '#516254',
  '--surface-tint': 'rgba(250, 255, 250, 0.9)',
  '--chart-c': '#121613',
  '--color-bg-base': '#fafffa',
  '--color-bg-surface': '#fafffa',
  '--color-bg-elevated': '#fafffa',
  '--color-bg-glass': 'rgba(18, 22, 19, 0.03)',
  '--color-bg-glass-hover': 'rgba(18, 22, 19, 0.05)',
  '--color-text-primary': '#121613',
  '--color-text-secondary': '#121613',
  '--color-text-muted': '#516254',
  '--color-text-inverse': '#fafffa',
  '--color-border-subtle': 'rgba(18, 22, 19, 0.06)',
  '--color-border-default': '#121613',
  '--color-border-strong': 'rgba(18, 22, 19, 0.22)',
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
      ? // Pinned dark accent band — always dark green/cream, independent of the
        // site's own light/dark toggle (used for hero-adjacent chrome that sits
        // over the fixed dark photo backdrop).
        { ...(paintBackground ? { background: '#121613' } : {}), color: '#fafffa', ...DARK_TONE_VARS }
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
