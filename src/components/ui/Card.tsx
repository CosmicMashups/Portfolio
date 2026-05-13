import { forwardRef, type ComponentProps } from 'react'
import { cn } from '@/components/ui/cn'

export const Card = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  function Card({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--surface-tint)] p-6 sm:p-7 lg:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]',
          className,
        )}
        {...props}
      />
    )
  },
)
