import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { projectById } from '@/config/projects.registry'
import { IMPACT_MILESTONES } from '@/components/impact/impactMilestones'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { fadeInUp } from '@/lib/motion/presets'
import { cn } from '@/components/ui/cn'
import { gsap, ScrollTrigger } from '@/lib/motion/gsapScroll'

export function ImpactTimeline() {
  const reduce = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  // Scrub-tied draw-on: the line's length is literally progress-over-time, so it
  // tracks scroll position through the whole timeline instead of a one-shot reveal.
  useGSAP(() => {
    if (reduce || !rootRef.current || !lineRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 85%',
            end: 'bottom 60%',
            scrub: true,
          },
        },
      )
    })
    return () => ctx.revert()
  }, [reduce])

  return (
    <div ref={rootRef} className="relative">
      <div
        ref={lineRef}
        className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-[color:color-mix(in_oklab,var(--accent-primary)_55%,var(--global-border))] md:left-[11px]"
        style={reduce ? undefined : { transform: 'scaleY(0)' }}
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
