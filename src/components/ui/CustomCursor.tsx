import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

type CursorMode = 'default' | 'hover' | 'link' | 'drag' | 'text' | 'magnetic'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const [mode, setMode] = useState<CursorMode>('default')
  const [coarse, setCoarse] = useState(false)
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const ringRefPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)')
    const update = () => setCoarse(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (coarse || reduce) {
      document.body.style.cursor = 'auto'
      return
    }
    document.body.style.cursor = 'none'
    const handleMove = (event: PointerEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY }
      if (dotRef.current) {
        gsap.set(dotRef.current, { x: event.clientX - 4, y: event.clientY - 4 })
      }
    }
    const handleOver = (event: Event) => {
      const target = event.target as HTMLElement | null
      const attr = target?.closest('[data-cursor]')?.getAttribute('data-cursor') as CursorMode | null
      setMode(attr ?? 'default')
    }
    const handleOut = () => setMode('default')

    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('mouseover', handleOver)
    window.addEventListener('mouseout', handleOut)

    let raf = 0
    const tick = () => {
      ringRefPos.current.x += (mouseRef.current.x - ringRefPos.current.x) * 0.12
      ringRefPos.current.y += (mouseRef.current.y - ringRefPos.current.y) * 0.12
      if (ringRef.current) gsap.set(ringRef.current, { x: ringRefPos.current.x - 16, y: ringRefPos.current.y - 16 })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('mouseover', handleOver)
      window.removeEventListener('mouseout', handleOut)
      cancelAnimationFrame(raf)
    }
  }, [coarse, reduce])

  if (coarse || reduce) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div ref={dotRef} className="absolute h-2 w-2 rounded-full bg-[var(--color-accent-primary)]" />
      <div
        ref={ringRef}
        className="absolute flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-accent-primary)] text-[9px] font-semibold tracking-wider text-[var(--color-accent-primary)] transition-all duration-200"
        style={{
          background: mode === 'hover' ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
          width: mode === 'hover' || mode === 'link' || mode === 'drag' ? 48 : mode === 'text' ? 2 : 32,
          height: mode === 'text' ? 24 : mode === 'hover' || mode === 'link' || mode === 'drag' ? 48 : 32,
          borderRadius: mode === 'text' ? 1 : 999,
          transform: mode === 'drag' ? 'rotate(-6deg)' : 'none',
        }}
      >
        {mode === 'link' ? 'OPEN' : null}
        {mode === 'drag' ? 'DRAG' : null}
      </div>
    </div>,
    document.body,
  )
}
