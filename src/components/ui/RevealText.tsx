import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/components/ui/cn'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

interface RevealTextProps {
  children: string
  className?: string
  delay?: number
  staggerDelay?: number
}

export function RevealText({ children, className, delay = 0, staggerDelay = 0.06 }: RevealTextProps) {
  const words = children.split(' ')
  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true })
  const reduce = usePrefersReducedMotion()

  if (reduce) {
    return <span className={className}>{children}</span>
  }

  return (
    <motion.span
      ref={ref}
      className={cn('inline-flex flex-wrap gap-x-[0.35ch]', className)}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={{
        show: {
          transition: { staggerChildren: staggerDelay, delayChildren: delay },
        },
      }}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%' },
              show: { y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
