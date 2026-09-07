import { Section } from '@/components/shell/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { DrawUnderline } from '@/components/ui/DrawUnderline'
import { CapabilityClusters } from '@/components/system-overview/CapabilityClusters'
import { LifecycleTimeline } from '@/components/system-overview/LifecycleTimeline'

export function SystemOverview() {
  return (
    <Section
      id="system-overview"
      kicker={<SectionEyebrow>Capability Map</SectionEyebrow>}
      title={
        <span className="font-[var(--font-display)]">
          How I ship <DrawUnderline color="var(--accent-primary)">Systems</DrawUnderline>
        </span>
      }
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-5">
          <p className="text-sm leading-relaxed text-[var(--global-text-muted)]">
            Lifecycle phases compress into a signal path instead of a résumé stack. Hover or focus a phase for a
            concrete example from shipped work.
          </p>
          <LifecycleTimeline />
        </div>
        <CapabilityClusters />
      </div>
    </Section>
  )
}
