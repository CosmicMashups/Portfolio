import type { ComponentProps } from 'react'
import { cn } from '@/components/ui/cn'

export function Panel({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-project)] border border-dashed border-[color:color-mix(in_oklab,var(--accent-primary)_25%,transparent)] bg-[color:color-mix(in_oklab,var(--accent-primary)_6%,var(--global-surface))] p-6 sm:p-6',
        className,
      )}
      {...props}
    />
  )
}
