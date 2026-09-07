import { type ReactNode } from 'react'
import { cn } from '@/components/ui/cn'

interface BorderTraceProps {
  children: ReactNode
  className?: string
}

/**
 * Legacy animated-border wrapper, now a plain passthrough. Kept as a component so
 * call sites don't need to be rewired; the hairline border comes from the child.
 */
export function BorderTrace({ children, className }: BorderTraceProps) {
  return <div className={cn('relative', className)}>{children}</div>
}
