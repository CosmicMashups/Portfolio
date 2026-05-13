import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/components/ui/cn'

const HUD_STATES = [
  { pain: 'LOW', arom: '142°' },
  { pain: 'MOD', arom: '118°' },
  { pain: 'LOW', arom: '156°' },
] as const

const EASE = [0.16, 1, 0.3, 1] as const

/** 17 keypoints (COCO-style indices), viewBox 0 0 120 200 */
function PoseSvg() {
  const edges: [number, number, number, number][] = [
    [50, 28, 47, 22],
    [50, 28, 53, 22],
    [47, 22, 44, 26],
    [53, 22, 56, 26],
    [50, 28, 38, 48],
    [50, 28, 62, 48],
    [38, 48, 34, 68],
    [62, 48, 66, 68],
    [34, 68, 30, 92],
    [66, 68, 70, 92],
    [38, 48, 44, 78],
    [62, 48, 56, 78],
    [44, 78, 42, 110],
    [56, 78, 58, 110],
    [42, 110, 40, 148],
    [58, 110, 60, 148],
  ]
  const joints: [number, number][] = [
    [50, 28],
    [47, 22],
    [53, 22],
    [44, 26],
    [56, 26],
    [38, 48],
    [62, 48],
    [34, 68],
    [66, 68],
    [30, 92],
    [70, 92],
    [44, 78],
    [56, 78],
    [42, 110],
    [58, 110],
    [40, 148],
    [60, 148],
  ]
  return (
    <svg viewBox="0 0 120 200" className="h-full w-full" aria-hidden>
      {edges.map(([x1, y1, x2, y2], i) => (
        <line
          key={`l-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(232,227,220,0.35)"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      ))}
      {joints.map(([cx, cy], i) => (
        <circle
          key={`j-${i}`}
          cx={cx}
          cy={cy}
          r={2.4}
          className="pkt-joint fill-[var(--pkt-accent)]"
        />
      ))}
    </svg>
  )
}

export function PocketPTHero({ reduce }: { reduce: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const titleFade = useTransform(scrollYProgress, [0, 0.42], [1, 0.15])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 0.85])
  const [hudIdx, setHudIdx] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      setHudIdx((i) => (i + 1) % HUD_STATES.length)
    }, 4000)
    return () => window.clearInterval(id)
  }, [reduce])

  const hud = useMemo(() => HUD_STATES[hudIdx], [hudIdx])

  return (
    <section
      ref={sectionRef}
      id="pocketpt-hero"
      className="relative scroll-mt-[calc(var(--shell-header-height)+2rem)] border-b border-[var(--pkt-border)] pb-12 pt-8 sm:pb-16 sm:pt-10"
    >
      <div className="pkt-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="max-w-xl">
          <p className="pkt-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--pkt-text-dim)]">
            Thesis project · 2025 · De La Salle University–Dasmariñas
          </p>
          <div className="relative mt-4">
            <motion.h1
              className="pkt-display text-5xl leading-[0.95] text-[var(--pkt-text)] sm:text-6xl lg:text-7xl xl:text-8xl"
              style={{ opacity: reduce ? 1 : titleFade }}
            >
              PocketPT
            </motion.h1>
            {!reduce ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[var(--pkt-bg)] to-[var(--pkt-bg)]"
                style={{ opacity: overlayOpacity }}
              />
            ) : null}
          </div>
          <p className="mt-4 text-lg font-medium text-[var(--pkt-text)] sm:text-xl">
            AI-Driven Physical Rehabilitation — On Your Device
          </p>
          <p className="mt-3 text-base italic text-[var(--pkt-accent)] sm:text-lg">
            Bridging a 1:18,000 therapist-to-patient gap with on-device machine learning.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--pkt-border)] bg-[var(--pkt-surface)] px-3 py-1.5 text-xs text-[var(--pkt-text-dim)]">
              Flutter · Firebase · Hive
            </span>
            <span className="rounded-full border border-[var(--pkt-border)] bg-[var(--pkt-surface)] px-3 py-1.5 text-xs text-[var(--pkt-text-dim)]">
              CNN · LSTM · ONNX
            </span>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-[var(--pkt-mono)] underline-offset-4 hover:underline"
            >
              ← Home
            </Link>
            <a
              href="#pocketpt-metrics"
              className="text-sm font-medium text-[var(--pkt-accent)] underline-offset-4 hover:underline"
            >
              Read the thesis metrics
            </a>
          </div>
        </div>

        <div className="hidden justify-center lg:flex">
          <div
            className={cn(
              'relative w-full max-w-[220px] rounded-[2.25rem] border p-2 shadow-[0_0_40px_var(--pkt-accent-glow)]',
              'border-[var(--pkt-border)] bg-[color:color-mix(in_oklab,var(--pkt-surface)_92%,black)]',
            )}
            style={{ aspectRatio: '390 / 780' }}
          >
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.85rem] border border-[var(--pkt-border)] bg-[#07090b]">
              <div className="pkt-scanline" data-animate={reduce ? undefined : 'true'} />
              <div className="relative flex flex-1 flex-col p-3">
                <div className="pkt-mono text-[8px] uppercase tracking-wider text-[var(--pkt-text-dim)]">
                  Live assessment
                </div>
                <div className="relative mt-2 flex-1 min-h-[120px]">
                  <PoseSvg />
                </div>
                <div className="relative mt-2 rounded-md border border-[var(--pkt-border)] bg-[var(--pkt-surface)] px-2 py-1.5">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`${hud.pain}-${hud.arom}`}
                      initial={reduce ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="pkt-mono text-[9px] leading-snug text-[var(--pkt-mono)]"
                    >
                      PAIN: {hud.pain} · AROM: {hud.arom}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
