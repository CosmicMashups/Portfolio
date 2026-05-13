import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

interface BlobState {
  x: number
  y: number
  driftX: number
  driftY: number
}

export function MeshGradient() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const blobsRef = useRef<BlobState[]>([
    { x: 72, y: 14, driftX: 0.3, driftY: 0.25 },
    { x: 12, y: 78, driftX: 0.2, driftY: 0.22 },
    { x: 52, y: 52, driftX: 0.24, driftY: 0.2 },
    { x: 10, y: 10, driftX: 0.18, driftY: 0.26 },
  ])
  const mouseRef = useRef({ x: 50, y: 50 })
  const reduce = usePrefersReducedMotion()

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

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        data-blob
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ width: 800, height: 800, background: 'rgba(34,211,238,0.06)' }}
      />
      <div
        data-blob
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ width: 600, height: 600, background: 'rgba(167,139,250,0.05)' }}
      />
      <div
        data-blob
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ width: 400, height: 400, background: 'rgba(251,191,36,0.03)' }}
      />
      <div
        data-blob
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ width: 500, height: 500, background: 'rgba(34,211,238,0.03)' }}
      />
    </div>
  )
}
