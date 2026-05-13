import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/components/ui/cn'

interface BorderTraceProps {
  children: ReactNode
  className?: string
}

export function BorderTrace({ children, className }: BorderTraceProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    const element = wrapperRef.current
    if (!element) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const perimeter = (size.width + size.height) * 2

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={cn('relative', className)}
    >
      {children}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <rect
          x="0.75"
          y="0.75"
          width={Math.max(size.width - 1.5, 0)}
          height={Math.max(size.height - 1.5, 0)}
          rx="16"
          ry="16"
          fill="none"
          stroke="var(--color-accent-primary)"
          strokeWidth="1.5"
          strokeDasharray={perimeter}
          strokeDashoffset={active ? 0 : perimeter}
          style={{
            transition: active
              ? 'stroke-dashoffset 0.5s ease-in-out'
              : 'stroke-dashoffset 0.3s ease-in-out',
          }}
        />
      </svg>
    </div>
  )
}
