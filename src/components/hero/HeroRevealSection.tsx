import { Section } from '@/components/shell/Section'
import { LifecycleSection } from '@/components/system-overview/LifecycleSection'
import { ShieldCheck, Zap } from 'lucide-react'

/**
 * How I Build — the chapter opens directly with the engineering lifecycle rail (no
 * separate chapter-title intro beat): on desktop this is a pinned, scroll-scrubbed
 * horizontal storytelling rail carrying its own kicker/title/stage-counter in a fixed
 * text panel, so a standalone ChapterTitleCard above it would be redundant. Touch and
 * reduced-motion visitors get the original drag/snap carousel instead (see
 * LifecycleSection), which keeps its own compact header strip for the same context.
 */
export function HeroRevealSection() {
  return (
    <div id="system-overview" className="scroll-mt-[var(--shell-header-height)]">
      <Section
        id="system-overview-lifecycle"
        tone="light"
        hideHeader
        bleed={false}
        paintBackground={false}
        className="relative z-10 flex flex-col justify-center"
      >
        <div className="flex w-full flex-col justify-center gap-6 py-10 sm:gap-8 sm:py-14 lg:py-16">
          <LifecycleSection />

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
