import { type ReactNode, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '@/components/ui/cn'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  glareEnabled?: boolean
  maxTilt?: number
  glareMaxOpacity?: number
  /** Omit default glass box-shadow (e.g. hero portrait on solid photo background). */
  noShadow?: boolean
  /** Omit glass backdrop blur / saturate (hero photo should stay sharp on its own pixels). */
  noBackdrop?: boolean
}

export function TiltCard({
  children,
  className,
  glareEnabled = true,
  maxTilt = 12,
  glareMaxOpacity = 0.15,
  noShadow = false,
  noBackdrop = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const glareRef = useRef<HTMLDivElement | null>(null)
  const reduce = usePrefersReducedMotion()

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card || reduce) return
    const rect = card.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    const rotateY = (px - 0.5) * maxTilt * 2
    const rotateX = -(py - 0.5) * maxTilt * 2

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out',
    })

    if (glareEnabled && glareRef.current) {
      glareRef.current.style.opacity = String(glareMaxOpacity)
      glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.15), transparent 60%)`
    }
  }

  const onLeave = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.7)',
    })
    if (glareRef.current) {
      gsap.to(glareRef.current, { opacity: 0, duration: 0.2, ease: 'power1.out' })
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        'relative overflow-hidden rounded-2xl border',
        noBackdrop
          ? 'border-transparent bg-transparent'
          : 'border-[var(--color-border-subtle)] bg-[var(--color-bg-glass)] backdrop-blur-[24px] backdrop-saturate-[180%]',
        className,
      )}
      style={noShadow ? undefined : { boxShadow: 'var(--shadow-glass)' }}
    >
      {children}
      {glareEnabled ? <div ref={glareRef} className="pointer-events-none absolute inset-0 opacity-0" /> : null}
    </div>
  )
}
