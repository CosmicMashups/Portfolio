import { useRef, useEffect, useState, useCallback } from 'react'
import { ENGINEERING_LIFECYCLE_STEPS } from './lifecycleSteps.data'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { gsap } from '@/lib/motion/gsapScroll'
import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, ArrowRight, CheckCircle2, Terminal, Code2, Database, Layers, GitPullRequest, CloudUpload, Activity, Wrench } from 'lucide-react'

const STEP_ICONS: Record<string, LucideIcon> = {
  requirements: Terminal,
  analysis: Layers,
  architecture: Code2,
  'database-design': Database,
  implementation: Layers,
  testing: CheckCircle2,
  'code-review': GitPullRequest,
  deployment: CloudUpload,
  monitoring: Activity,
  maintenance: Wrench,
}

// Visual color tint accents matching the project's botanical/Seed aesthetic
const CARD_THEMES: Record<string, { bg: string; border: string; badge: string; accent: string }> = {
  strategy: {
    bg: 'from-[#162318]/90 to-[#101811]/90',
    border: 'border-[#d3fa99]/20 hover:border-[#d3fa99]/40',
    badge: 'bg-[#d3fa99]/10 text-[#d3fa99] border-[#d3fa99]/20',
    accent: '#d3fa99',
  },
  architecture: {
    bg: 'from-[#1a2b1d]/90 to-[#121c14]/90',
    border: 'border-[#9f995b]/20 hover:border-[#9f995b]/40',
    badge: 'bg-[#9f995b]/10 text-[#e2dc9d] border-[#9f995b]/20',
    accent: '#e2dc9d',
  },
  execution: {
    bg: 'from-[#142619]/90 to-[#0e1a12]/90',
    border: 'border-[#698e79]/20 hover:border-[#698e79]/40',
    badge: 'bg-[#698e79]/10 text-[#a3d4ba] border-[#698e79]/20',
    accent: '#a3d4ba',
  },
  reliability: {
    bg: 'from-[#152518]/90 to-[#0f1b11]/90',
    border: 'border-[#757c5d]/20 hover:border-[#757c5d]/40',
    badge: 'bg-[#757c5d]/10 text-[#c8d4a6] border-[#757c5d]/20',
    accent: '#c8d4a6',
  },
}

export function LifecycleCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const reduce = usePrefersReducedMotion()

  const totalSteps = ENGINEERING_LIFECYCLE_STEPS.length

  const updateControlsState = useCallback((index: number) => {
    setCurrentIndex(index)
    setCanScrollLeft(index > 0)
    setCanScrollRight(index < totalSteps - 1)
  }, [totalSteps])

  const scrollToIndex = useCallback((index: number) => {
    const targetIdx = Math.max(0, Math.min(index, totalSteps - 1))
    const track = trackRef.current
    const targetCard = cardsRef.current[targetIdx]

    if (!track || !targetCard) return

    const trackLeft = track.getBoundingClientRect().left
    const cardLeft = targetCard.getBoundingClientRect().left
    const offset = cardLeft - trackLeft
    const targetScrollLeft = track.scrollLeft + offset

    if (reduce) {
      track.scrollTo({ left: targetScrollLeft, behavior: 'instant' })
      updateControlsState(targetIdx)
      return
    }

    gsap.to(track, {
      scrollLeft: targetScrollLeft,
      duration: 0.65,
      ease: 'power3.out',
      overwrite: 'auto',
      onComplete: () => {
        updateControlsState(targetIdx)
      },
    })
  }, [reduce, totalSteps, updateControlsState])

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < totalSteps - 1) {
      scrollToIndex(currentIndex + 1)
    }
  }

  // Monitor native track scroll position to sync active index & button states
  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return

    const trackLeft = track.getBoundingClientRect().left
    let closestIdx = 0
    let minDistance = Infinity

    cardsRef.current.forEach((card, idx) => {
      if (!card) return
      const cardLeft = card.getBoundingClientRect().left
      const dist = Math.abs(cardLeft - trackLeft)
      if (dist < minDistance) {
        minDistance = dist
        closestIdx = idx
      }
    })

    if (closestIdx !== currentIndex) {
      updateControlsState(closestIdx)
    }
  }

  // Drag to scroll states
  const [isDragging, setIsDragging] = useState(false)
  const isPointerDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const dragDistanceRef = useRef(0)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only handle primary button (left mouse click)
    if (e.button !== 0) return
    const track = trackRef.current
    if (!track) return

    isPointerDownRef.current = true
    hasDraggedRef.current = false
    dragDistanceRef.current = 0
    startXRef.current = e.pageX - track.offsetLeft
    scrollLeftRef.current = track.scrollLeft

    // Disable scroll snap while actively dragging for fluid physics
    track.style.scrollSnapType = 'none'
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return
    const track = trackRef.current
    if (!track) return

    e.preventDefault()
    const x = e.pageX - track.offsetLeft
    const walk = (x - startXRef.current) * 1.35 // Natural drag friction multiplier
    dragDistanceRef.current = Math.abs(walk)

    if (dragDistanceRef.current > 6) {
      hasDraggedRef.current = true
      setIsDragging(true)
    }

    track.scrollLeft = scrollLeftRef.current - walk
  }

  const handlePointerUpOrLeave = () => {
    if (!isPointerDownRef.current) return
    isPointerDownRef.current = false
    const track = trackRef.current

    if (track) {
      // Re-enable smooth CSS scroll snap
      track.style.scrollSnapType = 'x mandatory'
    }

    // Delay reset so click handlers don't fire if this was a drag
    setTimeout(() => {
      setIsDragging(false)
      hasDraggedRef.current = false
    }, 50)
  }

  // Entrance staggered cards animation with GSAP
  useEffect(() => {
    if (!containerRef.current || reduce) return

    const validCards = cardsRef.current.filter(Boolean)
    if (validCards.length === 0) return

    const ctx = gsap.context(() => {
      gsap.from(validCards, {
        x: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'all',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <div ref={containerRef} className="relative flex flex-col w-full">
      {/* Top Header Controls Bar (Matching Phantom.com style: category chip on left, arrows on right) */}
      <div className="flex items-center justify-between pb-4 sm:pb-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#121613]/70 px-3 py-1 text-[11px] font-[var(--font-mono)] uppercase tracking-[0.16em] text-[#fafffa]/85 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d3fa99]" />
            <span>10-Stage Lifecycle Pipeline</span>
          </div>

          <span className="hidden font-[var(--font-mono)] text-[11px] text-[#fafffa]/40 sm:inline">
            Stage {String(currentIndex + 1).padStart(2, '0')} / {totalSteps}
          </span>
        </div>

        {/* Phantom-Style Circular Pagination Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canScrollLeft}
            aria-label="Previous lifecycle stage"
            className={`group flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
              canScrollLeft
                ? 'border-white/20 bg-white/5 text-[#fafffa] hover:border-[#d3fa99] hover:bg-[#d3fa99]/15 hover:text-[#d3fa99] active:scale-95'
                : 'border-white/5 bg-transparent text-white/20 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canScrollRight}
            aria-label="Next lifecycle stage"
            className={`group flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
              canScrollRight
                ? 'border-white/20 bg-white/5 text-[#fafffa] hover:border-[#d3fa99] hover:bg-[#d3fa99]/15 hover:text-[#d3fa99] active:scale-95'
                : 'border-white/5 bg-transparent text-white/20 cursor-not-allowed'
            }`}
          >
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track:
          - Styled after Phantom.com cards
          - Height-bounded to guarantee fitting in a 16:9 viewport height (max-h-[50vh] or ~360-390px)
          - CSS scroll snap + GSAP smooth scroll
      */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        className={`no-scrollbar flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 sm:gap-6 select-none touch-pan-y ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {ENGINEERING_LIFECYCLE_STEPS.map((step, idx) => {
          const isSelected = idx === currentIndex
          const theme = CARD_THEMES[step.category] ?? CARD_THEMES.strategy
          const Icon = STEP_ICONS[step.id] ?? Terminal

          return (
            <div
              key={step.id}
              ref={(el) => {
                cardsRef.current[idx] = el
              }}
              onClick={() => {
                // If user was dragging, don't trigger click selection
                if (!hasDraggedRef.current) {
                  scrollToIndex(idx)
                }
              }}
              className={`group relative flex flex-col justify-between shrink-0 snap-start select-none rounded-2xl sm:rounded-3xl border bg-gradient-to-b ${theme.bg} ${theme.border} p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 ${
                isSelected
                  ? 'ring-1 ring-[#d3fa99]/30 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                  : 'opacity-70 hover:opacity-100 hover:scale-[1.01]'
              } w-[84vw] max-w-[340px] sm:w-[320px] md:w-[340px] lg:w-[360px] h-[340px] sm:h-[360px] max-h-[50vh]`}
            >
              {/* Card Top: Number, Category Badge & Icon */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-[var(--font-mono)] text-xs font-semibold text-[#d3fa99]">
                      {step.number}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 font-[var(--font-mono)] text-[9.5px] uppercase tracking-wider ${theme.badge}`}>
                      {step.category}
                    </span>
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#fafffa]/80 transition-colors group-hover:border-[#d3fa99]/40 group-hover:text-[#d3fa99]">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="pt-3">
                  <h3 className="font-[var(--font-display)] text-xl font-normal leading-snug text-[#fafffa] group-hover:text-[#d3fa99] transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 font-[var(--font-mono)] text-[11px] text-[#fafffa]/60">
                    {step.subtitle}
                  </p>
                </div>

                {/* Concise 2-line Description */}
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#fafffa]/80">
                  {step.description}
                </p>
              </div>

              {/* Card Bottom: Shipped Exemplar Proof Pill */}
              <div className="mt-auto pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5 pb-1 font-[var(--font-mono)] text-[9.5px] uppercase tracking-wider text-[#d3fa99]">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified Production Proof</span>
                </div>
                <p className="line-clamp-2 text-[11px] text-[#fafffa]/70 leading-relaxed font-light">
                  {step.exemplar}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mini Progress Dot Indicator */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {ENGINEERING_LIFECYCLE_STEPS.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            onClick={() => scrollToIndex(idx)}
            aria-label={`Jump to stage ${step.number}: ${step.title}`}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex
                ? 'w-6 bg-[#d3fa99]'
                : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
