import { Section } from '@/components/shell/Section'
import { ChapterTitleCard } from '@/components/shell/ChapterTitleCard'
import { AggregateMetricsBar } from '@/components/impact/AggregateMetricsBar'
import { ImpactTimeline } from '@/components/impact/ImpactTimeline'

export function ImpactHomeSection() {
  return (
    <div id="impact" className="scroll-mt-[var(--shell-header-height)]">
      <ChapterTitleCard kicker="04 // Impact" title="Built to Last." />
      <Section id="impact-content" tone="dark" hideHeader bleed={false}>
        <AggregateMetricsBar />
        <ImpactTimeline />
      </Section>
    </div>
  )
}
