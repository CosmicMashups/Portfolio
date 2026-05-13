import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { cn } from '@/components/ui/cn'

export function Section({
  id,
  title,
  kicker,
  className,
  headerClassName,
  children,
  hideHeader = false,
}: {
  id: string
  title?: ReactNode
  kicker?: ReactNode
  className?: string
  headerClassName?: string
  children: ReactNode
  hideHeader?: boolean
}) {
  const reduce = usePrefersReducedMotion()

  return (
    <motion.section
      id={id}
      className={cn(
        'scroll-mt-[calc(var(--shell-header-height)+2.5rem)] sm:scroll-mt-[calc(var(--shell-header-height)+3rem)] py-[var(--section-vertical-rhythm)] md:py-[var(--section-vertical-rhythm-md)] lg:py-[var(--section-vertical-rhythm-lg)]',
        className,
      )}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, margin: '-12% 0px' }}
      variants={fadeInUp}
    >
      {!hideHeader && (kicker != null || title != null) ? (
        <div
          className={cn(
            'mb-10 flex flex-col gap-3 border-b border-[var(--global-border)] pb-7 md:mb-14 md:pb-9',
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
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--global-text)] md:text-3xl">{title}</h2>
          ) : null}
        </div>
      ) : null}
      {children}
    </motion.section>
  )
}
