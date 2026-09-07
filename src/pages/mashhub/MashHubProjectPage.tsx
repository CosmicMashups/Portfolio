import { useEffect } from 'react'
import { HeroBand } from './HeroBand'
import { ProblemSection } from './ProblemSection'
import { FuzzyEngineSection } from './FuzzyEngineSection'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { FeatureGrid } from './FeatureGrid'
import { LiveDemoWidget } from './LiveDemoWidget'
import { ResearchFooter } from './ResearchFooter'
import { useThemeAccent } from '@/app/providers/useThemeAccent'

const MASHHUB_THEME_CSS = `
.mashhub-root {
  --mashhub-bg: #000b26;
  --mashhub-surface: #0a1633;
  --mashhub-surface-elevated: #121a3a;
  --mashhub-border: rgba(77, 166, 255, 0.18);
  --mashhub-border-strong: rgba(77, 166, 255, 0.4);
  --mashhub-text: #e8f0ff;
  --mashhub-text-muted: #93a3c4;
  --mashhub-text-dim: #6a7896;
  --mashhub-accent: #4da6ff;
  --mashhub-accent-dim: rgba(77, 166, 255, 0.14);
  --mashhub-accent-glow: rgba(77, 166, 255, 0.32);
  --mashhub-electric: #8b5cf6;
  --mashhub-electric-dim: rgba(139, 92, 246, 0.14);
  --mashhub-neon: #06ffa5;
  --mashhub-neon-dim: rgba(6, 255, 165, 0.14);
  --mashhub-danger: #f48787;
  --mashhub-danger-dim: rgba(244, 135, 135, 0.16);
  --mashhub-warn: #f4be5c;
  --mashhub-warn-dim: rgba(244, 190, 92, 0.16);

  background: var(--mashhub-bg);
  color: var(--mashhub-text);
  font-family: var(--font-body, 'DM Sans', system-ui, sans-serif);
}

.mashhub-root .mh-mono {
  font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', Consolas, monospace;
  font-variant-numeric: tabular-nums;
}

.mashhub-root .mh-display {
  font-family: var(--font-display, 'Space Grotesk', system-ui, sans-serif);
  letter-spacing: -0.015em;
}

.mashhub-root .mh-glow-text {
  text-shadow: 0 0 24px rgba(77, 166, 255, 0.55), 0 0 48px rgba(77, 166, 255, 0.25);
}

.mashhub-root .mh-glow-card {
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1), border-color 220ms;
}

.mashhub-root .mh-glow-card:hover {
  transform: scale(1.015);
  box-shadow: 0 0 28px rgba(77, 166, 255, 0.28);
  border-color: var(--mashhub-border-strong);
}

.mashhub-root .mh-glow-card:active {
  transform: scale(0.985);
}

.mashhub-root .mh-grid-backdrop {
  background-image:
    linear-gradient(to right, rgba(77, 166, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(77, 166, 255, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
}

.mashhub-root .mh-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.mashhub-root .mh-scrollbar::-webkit-scrollbar-thumb {
  background: var(--mashhub-border);
  border-radius: 4px;
}

.mashhub-root .mh-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--mashhub-border-strong);
}

@keyframes mh-pulse-soft {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
}

@keyframes mh-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes mh-waveform-drift {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes mh-equalize {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

@keyframes mh-spectrum-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.9; }
}

.mashhub-root .mh-focus-ring:focus-visible {
  outline: 2px solid var(--mashhub-accent);
  outline-offset: 2px;
  border-radius: 6px;
}

@media (prefers-reduced-motion: reduce) {
  .mashhub-root [data-mh-animate="true"] {
    animation: none !important;
  }
}

@media (prefers-color-scheme: light) {
  html:not([data-theme='dark']) .mashhub-root {
    --mashhub-bg: #f5f8ff;
    --mashhub-surface: #ffffff;
    --mashhub-surface-elevated: #eaf1fd;
    --mashhub-border: rgba(29, 99, 179, 0.18);
    --mashhub-border-strong: rgba(29, 99, 179, 0.38);
    --mashhub-text: #0b1a33;
    --mashhub-text-muted: #445374;
    --mashhub-text-dim: #6b7a9e;
    --mashhub-accent: #1d63b3;
    --mashhub-electric: #6d28d9;
    --mashhub-neon: #059669;
  }
}

html[data-theme='light'] .mashhub-root {
  --mashhub-bg: #f5f8ff;
  --mashhub-surface: #ffffff;
  --mashhub-surface-elevated: #eaf1fd;
  --mashhub-border: rgba(29, 99, 179, 0.18);
  --mashhub-border-strong: rgba(29, 99, 179, 0.38);
  --mashhub-text: #0b1a33;
  --mashhub-text-muted: #445374;
  --mashhub-text-dim: #6b7a9e;
  --mashhub-accent: #1d63b3;
  --mashhub-electric: #6d28d9;
  --mashhub-neon: #059669;
}

html:not([data-theme='dark']) .mashhub-root .mh-glow-text {
  text-shadow: 0 0 18px rgba(29, 99, 179, 0.22), 0 0 36px rgba(29, 99, 179, 0.1);
}
`

export function MashHubProjectPage() {
  const { setActiveProjectId } = useThemeAccent()

  useEffect(() => {
    setActiveProjectId('mashhub')
    return () => setActiveProjectId(null)
  }, [setActiveProjectId])

  return (
    <div className="mashhub-root relative overflow-hidden rounded-[var(--radius-project)] border border-[color:var(--mashhub-border)] shadow-[0_0_60px_rgba(0,11,38,0.5)]">
      <style>{MASHHUB_THEME_CSS}</style>
      <main id="main-content" tabIndex={-1} className="outline-none">
        <HeroBand />
        <ProblemSection />
        <FuzzyEngineSection />
        <ArchitectureDiagram />
        <FeatureGrid />
        <LiveDemoWidget />
        <ResearchFooter />
      </main>
    </div>
  )
}
