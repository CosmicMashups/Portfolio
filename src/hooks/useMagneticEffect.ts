import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

interface UseMagneticEffectOptions {
  strength?: number
}

export function useMagneticEffect({ strength = 0.4 }: UseMagneticEffectOptions = {}) {
  const ref = useRef<HTMLElement | null>(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reduce) return
    element.setAttribute('data-cursor', 'hover')

    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const offsetX = event.clientX - (rect.left + rect.width / 2)
      const offsetY = event.clientY - (rect.top + rect.height / 2)
      gsap.to(element, {
        x: offsetX * strength,
        y: offsetY * strength,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    element.addEventListener('mousemove', handleMove)
    element.addEventListener('mouseleave', handleLeave)
    return () => {
      element.removeEventListener('mousemove', handleMove)
      element.removeEventListener('mouseleave', handleLeave)
    }
  }, [reduce, strength])

  return { ref }
}
