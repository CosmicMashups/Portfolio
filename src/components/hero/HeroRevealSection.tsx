import { Section } from '@/components/shell/Section'
import { ChapterTitleCard } from '@/components/shell/ChapterTitleCard'
import { LifecycleCarousel } from '@/components/system-overview/LifecycleCarousel'
import { ShieldCheck, Zap } from 'lucide-react'

/**
 * How I Build — opens with a full-width chapter title card, then the engineering
 * lifecycle carousel at full width (no longer sharing space with a 3D phone stage).
 */
export function HeroRevealSection() {
  return (
    <div id="system-overview" className="scroll-mt-[var(--shell-header-height)]">
      <ChapterTitleCard
        kicker="03 // How I Build"
        title="The Engineering Lifecycle"
        subtitle="Every system advances through 10 disciplined phases from problem formulation to production maintenance."
      />
      <Section
        id="system-overview-lifecycle"
        tone="light"
        hideHeader
        bleed={false}
        paintBackground={false}
        className="relative z-10 flex flex-col justify-center"
      >
        <div className="flex w-full flex-col justify-center gap-6 py-10 sm:gap-8 sm:py-14 lg:py-16">
          <LifecycleCarousel />

          <div className="flex flex-wrap items-center gap-3 pt-0.5 font-[var(--font-mono)] text-[9.5px] text-[var(--color-text-primary)]/60">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-[#ff6b1a]" />
              <span>Zero-Cloud Dependency Where It Matters</span>
            </span>
            <span className="text-white/20">·</span>
            <span className="inline-flex items-center gap-1">
              <Zap className="h-3 w-3 text-[#ff6b1a]" />
              <span>Sub-40ms Inference</span>
            </span>
          </div>
        </div>
      </Section>
    </div>
  )
}
