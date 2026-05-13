import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import {
  ISO_FUNCTIONAL,
  ISO_PERFORMANCE,
  ISO_PORTABILITY,
  ISO_RELIABILITY,
  ISO_SECURITY,
  ISO_USABILITY,
} from '@/components/projects/pocketpt/pocketptConstants'

const TARGET = [
  { dimension: 'Functional', score: ISO_FUNCTIONAL },
  { dimension: 'Security', score: ISO_SECURITY },
  { dimension: 'Reliability', score: ISO_RELIABILITY },
  { dimension: 'Performance', score: ISO_PERFORMANCE },
  { dimension: 'Usability', score: ISO_USABILITY },
  { dimension: 'Portability', score: ISO_PORTABILITY },
]

const ZEROS = TARGET.map((d) => ({ ...d, score: 0 }))

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export default function PocketPTIsoRadar({ reduce }: { reduce: boolean }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  const [data, setData] = useState(ZEROS)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      queueMicrotask(() => {
        setData(TARGET)
      })
      return
    }
    const start = performance.now()
    const duration = 1200
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const ease = 1 - (1 - t) ** 2
      setData(
        TARGET.map((d, i) => ({
          ...d,
          score: lerp(0, TARGET[i]?.score ?? 0, ease),
        })),
      )
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce])

  return (
    <div ref={ref} className="pkt-mono h-[min(360px,55vw)] w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="52%" outerRadius="68%" data={reduce ? TARGET : data}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: 'var(--pkt-text-dim)', fontSize: 11 }}
          />
          <Radar
            name="ISO 25010"
            dataKey="score"
            stroke="var(--pkt-accent)"
            fill="var(--pkt-accent)"
            fillOpacity={0.28}
            strokeWidth={1.5}
            isAnimationActive={false}
            dot={false}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="sr-only" aria-live="polite">
        ISO IEC 25010 radar: functional suitability {TARGET[0]?.score}, security {TARGET[1]?.score},
        reliability {TARGET[2]?.score}, performance efficiency {TARGET[3]?.score}, usability{' '}
        {TARGET[4]?.score}, portability {TARGET[5]?.score}, on a scale of one to five.
      </p>
    </div>
  )
}
