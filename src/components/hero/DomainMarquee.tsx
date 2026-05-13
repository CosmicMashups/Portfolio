const TAGS = [
  '[ AI/ML Engineer ]',
  '[ Flutter Developer ]',
  '[ React Architect ]',
  '[ Data Visualiser ]',
  '[ Thesis Researcher ]',
] as const

export function DomainMarquee() {
  const strip = TAGS.join('     ')

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[12%] z-[1] overflow-hidden md:top-[18%]"
      aria-hidden
    >
      <div
        className="hero-domain-marquee-track flex min-w-[200%] gap-16 whitespace-nowrap font-[var(--font-mono)] text-[10px] uppercase tracking-[0.35em] text-[var(--global-text-muted)] opacity-[0.14] motion-reduce:translate-x-0 md:text-[11px]"
        style={{ animation: 'hero-domain-marquee 28s linear infinite' }}
      >
        <span>{strip}</span>
        <span>{strip}</span>
      </div>
    </div>
  )
}
