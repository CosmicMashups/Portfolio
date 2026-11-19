import { Section } from '@/components/shell/Section'
import { ChapterTitleCard } from '@/components/shell/ChapterTitleCard'
import { CreativeCosmic } from '@/components/creative/CreativeCosmic'

export function CreativeHomeSection() {
  return (
    <div id="creative" className="scroll-mt-[var(--shell-header-height)]">
      <ChapterTitleCard kicker="06 // Beyond Code" title="Off the Clock, Same Rigor." />
      <Section id="creative-content" tone="dark" hideHeader bleed={false}>
        <CreativeCosmic />
      </Section>
    </div>
  )
}
