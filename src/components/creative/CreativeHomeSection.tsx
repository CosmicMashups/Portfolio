import { Section } from '@/components/shell/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { RevealText } from '@/components/ui/RevealText'
import { CreativeCosmic } from '@/components/creative/CreativeCosmic'

export function CreativeHomeSection() {
  return (
    <Section
      id="creative"
      tone="light"
      kicker={<SectionEyebrow>Beyond Code</SectionEyebrow>}
      title={
        <span className="font-[var(--font-display)] uppercase">
          <RevealText>Off the Clock, Same Rigor.</RevealText>
        </span>
      }
    >
      <CreativeCosmic />
    </Section>
  )
}
