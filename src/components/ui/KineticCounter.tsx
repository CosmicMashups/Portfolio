import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/components/ui/cn'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

interface KineticCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  decimals?: number
  className?: string
}

export function KineticCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  decimals = 0,
  className,
}: KineticCounterProps) {
  const [display, setDisplay] = useState(0)
  const [shimmer, setShimmer] = useState(false)
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })
  const reduce = usePrefersReducedMotion()
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    if (reduce) {
      setDisplay(value)
      return
    }
    setShimmer(true)
    const obj = { val: 0 }
    gsap.to(obj, {
      val: value,
      duration: duration / 1000,
      ease: 'power2.out',
      onUpdate: () => setDisplay(obj.val),
      onComplete: () => setShimmer(false),
    })
  }, [duration, inView, reduce, value])

  const formatted = `${prefix}${display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`

  return (
    <span
      ref={ref}
      className={cn(
        'inline-block font-[var(--font-display)] text-[var(--color-accent-primary)]',
        'font-bold [background-size:200%_100%]',
        shimmer &&
          'animate-[shimmer_1.2s_linear_infinite] bg-gradient-to-r from-[var(--color-accent-primary)] via-white to-[var(--color-accent-primary)] bg-clip-text text-transparent',
        className,
      )}
    >
      {formatted}
    </span>
  )
}
