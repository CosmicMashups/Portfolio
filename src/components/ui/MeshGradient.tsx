import { useEffect, useRef, type CSSProperties } from 'react'
import { cn } from '@/components/ui/cn'
import { usePerformanceTier } from '@/app/providers/PerformanceTierProvider'

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
  const nodesRef = useRef<HTMLElement[]>([])
  const blobsRef = useRef<BlobState[]>([
    { x: 72, y: 14, driftX: 0.3, driftY: 0.25 },
    { x: 12, y: 78, driftX: 0.2, driftY: 0.22 },
    { x: 52, y: 52, driftX: 0.24, driftY: 0.2 },
    { x: 10, y: 10, driftX: 0.18, driftY: 0.26 },
  ])
  const mouseRef = useRef({ x: 50, y: 50 })
  const { reducedMotion, lowTier } = usePerformanceTier()
  const isHero = variant === 'hero'

  useEffect(() => {
    if (reducedMotion || lowTier) return
    let raf = 0
    let frame = 0
    let active = true
    const onMove = (event: PointerEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    nodesRef.current = Array.from(containerRef.current?.querySelectorAll<HTMLElement>('[data-blob]') ?? [])

    const onVisibility = () => {
      active = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibility)

    const tick = () => {
      if (!active) {
        raf = requestAnimationFrame(tick)
        return
      }
      frame += 1
      blobsRef.current.forEach((blob, index) => {
        const factor = frame * 0.0003
        let x = blob.x + Math.sin(factor * 80 * blob.driftX) * 3
        let y = blob.y + Math.cos(factor * 90 * blob.driftY) * 3
        if (index === 0) {
          x += (mouseRef.current.x - x) * 0.03
          y += (mouseRef.current.y - y) * 0.03
        }
        const node = nodesRef.current[index]
        if (node) {
          node.style.transform = `translate3d(${x}vw, ${y}vh, 0) translate(-50%, -50%)`
        }
      })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
      nodesRef.current = []
    }
  }, [lowTier, reducedMotion])

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
          className="absolute left-0 top-0 rounded-full blur-[120px] will-change-transform"
          style={blobStyle(i)}
        />
      ))}
    </div>
  )
}
