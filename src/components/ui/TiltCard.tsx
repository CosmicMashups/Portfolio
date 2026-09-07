import { type ReactNode } from 'react'
import { cn } from '@/components/ui/cn'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Omit default box-shadow (e.g. hero portrait on solid photo background). */
  noShadow?: boolean
  /** Omit backdrop blur/saturate (hero photo should stay sharp on its own pixels). */
  noBackdrop?: boolean
  /** @deprecated tilt/glare removed for the corporate redesign; props kept for call-site compatibility. */
  maxTilt?: number
  /** @deprecated tilt/glare removed for the corporate redesign; props kept for call-site compatibility. */
  glareEnabled?: boolean
  /** @deprecated tilt/glare removed for the corporate redesign; props kept for call-site compatibility. */
  glareMaxOpacity?: number
}

/** Plain card shell with a restrained shadow-lift on hover — no tilt or glare. */
export function TiltCard({ children, className, noBackdrop = false }: TiltCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-shadow duration-200',
        noBackdrop
          ? 'border-transparent bg-transparent'
          : 'border-[var(--color-border-default)] bg-[var(--color-bg-surface)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
