import type { ComponentProps } from 'react'
import { cn } from '@/components/ui/cn'

type Variant = 'primary' | 'ghost' | 'outline'

const styles: Record<Variant, string> = {
  primary:
    'bg-[color:color-mix(in_oklab,var(--accent-primary)_18%,transparent)] border border-[color:color-mix(in_oklab,var(--accent-primary)_45%,transparent)] text-[var(--global-text)] hover:border-[var(--accent-primary)]',
  ghost: 'bg-transparent hover:bg-white/5 border border-transparent',
  outline:
    'bg-transparent border border-[var(--global-border)] hover:border-[var(--accent-primary)]',
}

export function Button({
  className,
  variant = 'primary',
  ...props
}: ComponentProps<'button'> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-project)] px-4 py-2 text-sm font-medium transition-colors',
        styles[variant],
        className,
      )}
      {...props}
    />
  )
}

export function LinkButton({
  className,
  variant = 'primary',
  ...props
}: ComponentProps<'a'> & { variant?: Variant }) {
  return (
    <a
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-project)] px-4 py-2 text-sm font-medium transition-colors',
        styles[variant],
        className,
      )}
      {...props}
    />
  )
}
