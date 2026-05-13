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
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    const handleFocus = () => {
      gsap.to(element, {
        scale: 1.02,
        duration: 0.2,
        ease: 'power2.out',
      })
    }

    const handleBlur = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: 'power2.out',
      })
    }

    element.addEventListener('mousemove', handleMove)
    element.addEventListener('mouseleave', handleLeave)
    element.addEventListener('focus', handleFocus)
    element.addEventListener('blur', handleBlur)
    return () => {
      element.removeEventListener('mousemove', handleMove)
      element.removeEventListener('mouseleave', handleLeave)
      element.removeEventListener('focus', handleFocus)
      element.removeEventListener('blur', handleBlur)
    }
  }, [reduce, strength])

  return { ref }
}
