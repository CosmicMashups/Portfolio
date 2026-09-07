import { useRef } from 'react'

interface UseMagneticEffectOptions {
  strength?: number
}

/**
 * Legacy magnetic-cursor interaction, retained only as a plain ref for call-site
 * compatibility. The corporate redesign drops cursor-linked motion entirely.
 */
export function useMagneticEffect<T extends HTMLElement = HTMLElement>(_options: UseMagneticEffectOptions = {}) {
  const ref = useRef<T | null>(null)
  return { ref }
}
