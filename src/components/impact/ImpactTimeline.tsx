import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projectById } from '@/config/projects.registry'
import { IMPACT_MILESTONES } from '@/components/impact/impactMilestones'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { fadeInUp, motionEase } from '@/lib/motion/presets'
import { cn } from '@/components/ui/cn'

export function ImpactTimeline() {
  const reduce = usePrefersReducedMotion()

  return (
    <div className="relative">
      <motion.div
        className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-[color:color-mix(in_oklab,var(--accent-primary)_55%,var(--global-border))] md:left-[11px]"
        initial={reduce ? { scaleY: 1 } : { scaleY: 0 }}
        whileInView={reduce ? undefined : { scaleY: 1 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: reduce ? 0 : 1.1, ease: motionEase }}
        aria-hidden
      />

      <ul className="relative z-[1] space-y-10 pl-6 md:space-y-14 md:pl-10">
        {IMPACT_MILESTONES.map((m, i) => {
          const project = projectById(m.projectId)
          const title = project?.title ?? m.projectId
          const slug = project?.slug ?? m.projectId
          const flip = i % 2 === 1

          return (
            <motion.li
              key={m.projectId}
              className="relative"
              variants={fadeInUp}
              initial={reduce ? false : 'hidden'}
              whileInView={reduce ? undefined : 'show'}
              viewport={{ once: true, margin: '-10% 0px' }}
            >
              <span className="absolute left-[-23px] top-1.5 z-[2] h-2.5 w-2.5 rounded-full border-2 border-[var(--accent-primary)] bg-[var(--global-bg)] md:left-[-31px]" />

              <div
                className={cn(
                  'grid gap-4 md:grid-cols-2 md:items-start md:gap-10',
                  flip && 'md:[direction:rtl]',
                )}
              >
                <div className={cn('md:[direction:ltr]', flip && 'md:text-right')}>
                  <p className="font-[var(--font-mono)] text-[10px] text-[var(--global-text-muted)]">{m.year}</p>
                  <Link
                    to={`/projects/${slug}`}
                    className="mt-1 inline-flex rounded-md font-[var(--font-display)] text-lg font-semibold text-[var(--global-text)] outline-offset-2 hover:text-[var(--accent-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)]"
                  >
                    <span className="rounded-full border border-[color:color-mix(in_oklab,var(--accent-primary)_35%,var(--global-border))] bg-[color:color-mix(in_oklab,var(--accent-primary)_12%,transparent)] px-2.5 py-0.5 text-sm">
                      {title}
                    </span>
                  </Link>
                </div>
                <div className={cn('md:[direction:ltr]', flip && 'md:text-right')}>
                  <p className="text-sm leading-relaxed text-[var(--global-text-muted)]">{m.impact}</p>
                  <ul className={cn('mt-3 flex flex-wrap gap-2', flip && 'md:justify-end')}>
                    {m.metrics.map((x) => (
                      <li
                        key={x.label}
                        className="rounded-md border border-[var(--global-border)] px-2 py-1 font-[var(--font-mono)] text-[10px] text-[var(--global-text)]"
                      >
                        <span className="text-[var(--global-text-muted)]">{x.label}: </span>
                        {x.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
