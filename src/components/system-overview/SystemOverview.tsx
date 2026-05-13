import { Section } from '@/components/shell/Section'
import { CapabilityClusters } from '@/components/system-overview/CapabilityClusters'
import { LifecycleTimeline } from '@/components/system-overview/LifecycleTimeline'
import { RevealText } from '@/components/ui/RevealText'

export function SystemOverview() {
  return (
    <Section id="system-overview" kicker="// SYSTEM OVERVIEW" title="System overview">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <RevealText className="text-sm leading-relaxed text-[var(--global-text-muted)]">
            This page is a single narrative system: lifecycle phases compress into a signal path instead of a résumé
            stack. The clusters on the right are intentionally schematic — they encode relationships, not departments.
          </RevealText>
          <LifecycleTimeline />
        </div>
        <CapabilityClusters />
      </div>
    </Section>
  )
}
