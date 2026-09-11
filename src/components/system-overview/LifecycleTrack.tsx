import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ENGINEERING_LIFECYCLE_STEPS } from './lifecycleSteps.data'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { motionEase } from '@/lib/motion/presets'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export function LifecycleTrack() {
  const reduce = usePrefersReducedMotion()
  const [activeStepId, setActiveStepId] = useState<string>(ENGINEERING_LIFECYCLE_STEPS[0].id)

  const activeStep =
    ENGINEERING_LIFECYCLE_STEPS.find((s) => s.id === activeStepId) ?? ENGINEERING_LIFECYCLE_STEPS[0]

  return (
    <div className="flex flex-col gap-8">
      {/* 10-Step Sequential Stage Rail */}
      <div className="relative">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2 pt-1 sm:gap-3">
          {ENGINEERING_LIFECYCLE_STEPS.map((step, idx) => {
            const isSelected = step.id === activeStep.id
            const isPassed = idx < ENGINEERING_LIFECYCLE_STEPS.findIndex((s) => s.id === activeStep.id)

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStepId(step.id)}
                className={`group relative flex flex-shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3fa99] ${
                  isSelected
                    ? 'border-[#d3fa99] bg-[#d3fa99]/15 text-[#fafffa]'
                    : isPassed
                      ? 'border-white/20 bg-white/5 text-[#fafffa]/80 hover:border-white/40'
                      : 'border-white/10 bg-[#121613]/40 text-[#fafffa]/50 hover:border-white/25 hover:text-[#fafffa]/80'
                }`}
              >
                <span
                  className={`font-[var(--font-mono)] text-[11px] font-semibold transition-colors ${
                    isSelected ? 'text-[#d3fa99]' : isPassed ? 'text-[#d3fa99]/70' : 'text-[#fafffa]/40'
                  }`}
                >
                  {step.number}
                </span>
                <span className="font-[var(--font-display)] text-xs font-medium tracking-tight">
                  {step.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Stage Editorial Card: Negative space, high clarity, and 3D phone staging buffer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.id}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: motionEase }}
          className="relative max-w-xl rounded-2xl border border-white/12 bg-[#121613]/70 p-6 shadow-2xl backdrop-blur-md sm:p-8"
        >
          {/* Header Info */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d3fa99]/40 bg-[#d3fa99]/10 font-[var(--font-mono)] text-xs font-semibold text-[#d3fa99]">
                {activeStep.number}
              </span>
              <div>
                <h3 className="font-[var(--font-display)] text-xl font-normal text-[#fafffa] sm:text-2xl">
                  {activeStep.title}
                </h3>
                <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[#d3fa99]/90">
                  {activeStep.subtitle}
                </p>
              </div>
            </div>

            <span className="hidden font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#fafffa]/40 sm:block">
              Stage {activeStep.number} of 10
            </span>
          </div>

          {/* Description */}
          <p className="pt-4 text-sm leading-relaxed text-[#fafffa]/85 sm:text-base">
            {activeStep.description}
          </p>

          {/* Deliverables / Verifiable Output */}
          <div className="mt-5 space-y-2 pt-2">
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[#fafffa]/50">
              Verified Production Deliverables
            </span>
            <ul className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
              {activeStep.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 font-[var(--font-mono)] text-xs text-[#fafffa]/80"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-[#d3fa99]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Real Shipped Exemplar Proof */}
          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-3.5 backdrop-blur-sm">
            <div className="flex items-center gap-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[#d3fa99]">
              <span>Production Exemplar</span>
              <ArrowRight className="h-3 w-3" aria-hidden />
            </div>
            <p className="mt-1 text-xs text-[#fafffa]/70">
              {activeStep.exemplar}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
