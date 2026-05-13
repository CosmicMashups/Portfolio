import { useEffect, useRef, type CSSProperties } from 'react'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { cn } from '@/components/ui/cn'

interface BlobState {
  x: number
  y: number
  driftX: number
  driftY: number
}

export interface MeshGradientProps {
  /** `global` = fixed full-viewport (App shell). `hero` = in-flow absolute layer using accent tokens. */
  variant?: 'global' | 'hero'
  className?: string
}

export function MeshGradient({ variant = 'global', className }: MeshGradientProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const blobsRef = useRef<BlobState[]>([
    { x: 72, y: 14, driftX: 0.3, driftY: 0.25 },
    { x: 12, y: 78, driftX: 0.2, driftY: 0.22 },
    { x: 52, y: 52, driftX: 0.24, driftY: 0.2 },
    { x: 10, y: 10, driftX: 0.18, driftY: 0.26 },
  ])
  const mouseRef = useRef({ x: 50, y: 50 })
  const reduce = usePrefersReducedMotion()
  const isHero = variant === 'hero'

  useEffect(() => {
    if (reduce) return
    let raf = 0
    let frame = 0
    const onMove = (event: PointerEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const tick = () => {
      frame += 1
      const nodes = containerRef.current?.querySelectorAll<HTMLElement>('[data-blob]')
      blobsRef.current.forEach((blob, index) => {
        const factor = frame * 0.0003
        let x = blob.x + Math.sin(factor * 80 * blob.driftX) * 3
        let y = blob.y + Math.cos(factor * 90 * blob.driftY) * 3
        if (index === 0) {
          x += (mouseRef.current.x - x) * 0.03
          y += (mouseRef.current.y - y) * 0.03
        }
        const node = nodes?.[index]
        if (node) {
          node.style.left = `${x}%`
          node.style.top = `${y}%`
        }
      })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduce])

  const blobStyle = (i: number) => {
    if (isHero) {
      const opacities = ['14%', '10%', '8%', '10%']
      return {
        width: i === 0 ? 520 : i === 1 ? 420 : i === 2 ? 320 : 400,
        height: i === 0 ? 520 : i === 1 ? 420 : i === 2 ? 320 : 400,
        background: `color-mix(in oklab, var(--accent-primary) ${opacities[i] ?? '10%'}, transparent)`,
      } as CSSProperties
    }
    const sizes = [800, 600, 400, 500]
    const colors = [
      'rgba(34,211,238,0.06)',
      'rgba(167,139,250,0.05)',
      'rgba(251,191,36,0.03)',
      'rgba(34,211,238,0.03)',
    ]
    return {
      width: sizes[i],
      height: sizes[i],
      background: colors[i],
    } as CSSProperties
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none overflow-hidden',
        isHero ? 'absolute inset-0 z-0' : 'fixed inset-0 z-0',
        className,
      )}
      aria-hidden
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          data-blob
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={blobStyle(i)}
        />
      ))}
    </div>
  )
}
