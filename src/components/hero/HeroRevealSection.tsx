import { Section } from '@/components/shell/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { CapabilityClusters } from '@/components/system-overview/CapabilityClusters'
import { LifecycleTimeline } from '@/components/system-overview/LifecycleTimeline'

/**
 * Reveal text content that follows the hero — absorbs SystemOverview's
 * copy/content into a denser, 3-column composition. Renders over the shared
 * sticky backdrop from `HeroPinnedVisual` (a sibling positioned behind it by
 * `HeroPinnedSection`), so it carries no background of its own.
 */
export function HeroRevealSection() {
  return (
    <Section
      id="system-overview"
      tone="dark"
      hideHeader
      bleed={false}
      paintBackground={false}
      className="relative z-10 min-h-svh"
    >
      <div className="flex min-h-svh w-full flex-col justify-center gap-10 py-16">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-14">
          <div className="lg:col-span-1">
            <SectionEyebrow className="text-[#fafffa]/60">Capability Map</SectionEyebrow>
            <h2 className="mt-3 font-[var(--font-display)] text-4xl font-normal leading-[0.95] tracking-[-0.02em] text-[#fafffa] md:text-5xl">
              How I ship
              <br />
              Systems
            </h2>
          </div>

          <div className="lg:col-span-2 lg:text-right">
            <p className="ml-auto max-w-xl text-base leading-relaxed text-[#fafffa]/70 md:text-lg">
              Lifecycle phases compress into a signal path instead of a résumé stack. Hover or focus a phase for a
              concrete example from shipped work.
            </p>
          </div>

          <div className="lg:col-span-1">
            <LifecycleTimeline />
          </div>
          <div className="lg:col-span-2">
            <CapabilityClusters />
          </div>
        </div>
      </div>
    </Section>
  )
}
