import { Section } from '@/components/shell/Section'
import { ChapterTitleCard } from '@/components/shell/ChapterTitleCard'
import { GitHubCredibility } from '@/components/credibility/GitHubCredibility'
import { BuiltWith } from '@/components/credibility/BuiltWith'
import { CredibilityClosingCta } from '@/components/credibility/CredibilityClosingCta'

export function CredibilityHomeSection() {
  return (
    <div id="credibility" className="scroll-mt-[var(--shell-header-height)]">
      <ChapterTitleCard kicker="08 // Proof" title="Consistent. Curious. Compounding." />
      <Section id="credibility-content" tone="dark" hideHeader bleed={false}>
        <GitHubCredibility />
        <div className="mt-10 md:mt-12">
          <BuiltWith />
        </div>
        <CredibilityClosingCta className="mt-12 md:mt-14" />
      </Section>
    </div>
  )
}
