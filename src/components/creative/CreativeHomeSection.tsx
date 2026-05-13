import { Section } from '@/components/shell/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { RevealText } from '@/components/ui/RevealText'
import { CreativeCosmic } from '@/components/creative/CreativeCosmic'

export function CreativeHomeSection() {
  return (
    <Section
      id="creative"
      kicker={<SectionEyebrow>// 06 — CREATIVE LAYER</SectionEyebrow>}
      title={
        <span className="font-[var(--font-display)]">
          <RevealText>Engineering with Intent.</RevealText>
        </span>
      }
    >
      <CreativeCosmic />
    </Section>
  )
}
