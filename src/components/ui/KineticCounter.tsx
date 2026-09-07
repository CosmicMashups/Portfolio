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
  duration = 1200,
  decimals = 0,
  className,
}: KineticCounterProps) {
  const [display, setDisplay] = useState(0)
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
    const obj = { val: 0 }
    gsap.to(obj, {
      val: value,
      duration: duration / 1000,
      ease: 'power2.out',
      onUpdate: () => setDisplay(obj.val),
    })
  }, [duration, inView, reduce, value])

  const formatted = `${prefix}${display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`

  return (
    <span
      ref={ref}
      className={cn('inline-block font-[var(--font-mono)] font-semibold text-[var(--color-text-primary)]', className)}
    >
      {formatted}
    </span>
  )
}
