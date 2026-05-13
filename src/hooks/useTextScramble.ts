import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#@$%&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

interface UseTextScrambleOptions {
  targetText: string
  trigger?: boolean
  chars?: string
  /** Scramble resolve duration in ms (default 800). */
  durationMs?: number
}

function randomChar(pool: string) {
  return pool[Math.floor(Math.random() * pool.length)] ?? ''
}

export function useTextScramble({
  targetText,
  trigger = true,
  chars = DEFAULT_CHARS,
  durationMs = 800,
}: UseTextScrambleOptions) {
  const [displayText, setDisplayText] = useState(targetText)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const reduce = usePrefersReducedMotion()
  const rafRef = useRef<number>(0)

  const shouldRun = useMemo(() => trigger && inView && !hasAnimated, [trigger, inView, hasAnimated])

  useEffect(() => {
    if (reduce) {
      setDisplayText(targetText)
      return
    }
    if (!shouldRun) return

    const start = performance.now()

    const tick = (time: number) => {
      const elapsed = time - start
      const progress = Math.min(elapsed / durationMs, 1)
      const resolvedChars = Math.floor(progress * targetText.length)
      const next = targetText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' '
          if (index <= resolvedChars) return targetText[index] ?? ''
          return randomChar(chars)
        })
        .join('')
      setDisplayText(next)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplayText(targetText)
        setHasAnimated(true)
      }
    }

    setDisplayText(targetText.replace(/[^\s]/g, () => randomChar(chars)))
    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [chars, durationMs, reduce, shouldRun, targetText])

  return { displayText, ref }
}
