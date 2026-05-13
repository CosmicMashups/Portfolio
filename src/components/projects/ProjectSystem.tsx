import { type ReactNode, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { ProjectId } from '@/config/project.types'
import { PROJECTS } from '@/config/projects.registry'
import { ProjectModule } from '@/components/projects/ProjectModule'
import { fadeInUp } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { cn } from '@/components/ui/cn'

export function ProjectSystem({
  registerProjectNode,
}: {
  registerProjectNode?: (id: ProjectId, el: HTMLElement | null) => void
}) {
  const reduce = usePrefersReducedMotion()
  const reg = useCallback(
    (id: ProjectId, el: HTMLElement | null) => {
      registerProjectNode?.(id, el)
    },
    [registerProjectNode],
  )

  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="space-y-8 md:space-y-10"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
      }}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, margin: '-10% 0px' }}
    >
      {PROJECTS.map((p, index) => (
        <motion.div key={p.id} variants={fadeInUp} className={cn(index % 2 === 1 && 'md:pl-10 lg:pl-16', index % 2 === 0 && 'md:pr-6')}>
          <ParallaxCard index={index} progress={scrollYProgress} reduce={reduce}>
            <ProjectModule project={p} registerNode={reg} />
          </ParallaxCard>
        </motion.div>
      ))}
    </motion.div>
  )
}

function ParallaxCard({
  children,
  index,
  progress,
  reduce,
}: {
  children: ReactNode
  index: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduce: boolean
}) {
  const speed = index % 2 === 0 ? 1 : 0.85
  const y = useTransform(progress, [0, 1], [0, reduce ? 0 : -8 * speed])
  return <motion.div style={{ y }}>{children}</motion.div>
}
