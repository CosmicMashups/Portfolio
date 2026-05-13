import type { ReactNode } from 'react'
import { cn } from '@/components/ui/cn'

export function SectionEyebrow({
  children,
  className,
  accent,
}: {
  children: ReactNode
  className?: string
  /** When true, use accent color for eyebrow (default: secondary/mono look) */
  accent?: boolean
}) {
  return (
    <p
      className={cn(
        'font-[var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em]',
        accent ? 'text-[var(--accent-primary)]' : 'text-[var(--color-text-secondary)]',
        className,
      )}
    >
      {children}
    </p>
  )
}
