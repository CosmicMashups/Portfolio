import { type ReactNode, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { ProjectId } from '@/config/project.types'
import { PROJECTS } from '@/config/projects.registry'
import { ProjectModule } from '@/components/projects/ProjectModule'

export function ProjectSystem({
  registerProjectNode,
}: {
  registerProjectNode?: (id: ProjectId, el: HTMLElement | null) => void
}) {
  const reg = useCallback(
    (id: ProjectId, el: HTMLElement | null) => {
      registerProjectNode?.(id, el)
    },
    [registerProjectNode],
  )

  const { scrollYProgress } = useScroll()

  return (
    <div className="space-y-8 md:space-y-10">
      {PROJECTS.map((p, index) => (
        <ParallaxCard key={p.id} index={index} progress={scrollYProgress}>
          <ProjectModule project={p} registerNode={reg} />
        </ParallaxCard>
      ))}
    </div>
  )
}

function ParallaxCard({
  children,
  index,
  progress,
}: {
  children: ReactNode
  index: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const speed = index % 2 === 0 ? 1 : 0.85
  // Reduce vertical overlap perception between stacked cards during scroll.
  const y = useTransform(progress, [0, 1], [0, -8 * speed])
  return <motion.div style={{ y }}>{children}</motion.div>
}
