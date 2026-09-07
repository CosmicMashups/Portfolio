import { Section } from '@/components/shell/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { RevealText } from '@/components/ui/RevealText'
import { GitHubCredibility } from '@/components/credibility/GitHubCredibility'
import { BuiltWith } from '@/components/credibility/BuiltWith'
import { CredibilityClosingCta } from '@/components/credibility/CredibilityClosingCta'

export function CredibilityHomeSection() {
  return (
    <Section
      id="credibility"
      tone="light"
      kicker={<SectionEyebrow>Proof of Work</SectionEyebrow>}
      title={
        <span className="font-[var(--font-display)]">
          <RevealText>Consistent. Curious. Compounding.</RevealText>
        </span>
      }
    >
      <GitHubCredibility />
      <div className="mt-10 md:mt-12">
        <BuiltWith />
      </div>
      <CredibilityClosingCta className="mt-12 md:mt-14" />
    </Section>
  )
}
