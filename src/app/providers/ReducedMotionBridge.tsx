import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

/**
 * Placeholder for future context wiring; hooks are consumed per-component.
 */
export function ReducedMotionBridge({ children }: { children?: ReactNode }) {
  usePrefersReducedMotion()
  return children ?? null
}
