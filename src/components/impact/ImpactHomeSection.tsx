import { Section } from '@/components/shell/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { RevealText } from '@/components/ui/RevealText'
import { AggregateMetricsBar } from '@/components/impact/AggregateMetricsBar'
import { ImpactTimeline } from '@/components/impact/ImpactTimeline'

export function ImpactHomeSection() {
  return (
    <Section
      id="impact"
      tone="light"
      kicker={<SectionEyebrow>Impact</SectionEyebrow>}
      title={
        <span className="font-[var(--font-display)]">
          <RevealText>Built to Last.</RevealText>
        </span>
      }
    >
      <AggregateMetricsBar />
      <ImpactTimeline />
    </Section>
  )
}
