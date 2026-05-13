export const POCKETPT_THEME_CSS = `
.pocketpt-root {
  --pkt-bg: #0A0D0F;
  --pkt-surface: #111518;
  --pkt-border: rgba(255, 255, 255, 0.07);
  --pkt-accent: #C0392B;
  --pkt-accent-dim: #8B1A1A;
  --pkt-accent-glow: rgba(192, 57, 43, 0.18);
  --pkt-text: #E8E3DC;
  --pkt-text-dim: #7A7570;
  --pkt-mono: #A8D5C2;
  --color-accent-primary: var(--pkt-accent);
  background: var(--pkt-bg);
  color: var(--pkt-text);
  font-family: 'DM Sans', system-ui, sans-serif;
}

.pocketpt-root .pkt-display {
  font-family: 'DM Serif Display', Georgia, serif;
  font-weight: 400;
  letter-spacing: -0.02em;
}

.pocketpt-root .pkt-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}

.pocketpt-root .pkt-grid-bg {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
}

.pocketpt-root .pkt-scanline {
  pointer-events: none;
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
}

.pocketpt-root .pkt-scanline::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 18%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(192, 57, 43, 0.12),
    transparent
  );
  animation: pkt-scanline-move 3s linear infinite;
}

@keyframes pkt-scanline-move {
  0% { top: -18%; }
  100% { top: 100%; }
}

@keyframes pkt-joint-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(192, 57, 43, 0.35); }
  50% { box-shadow: 0 0 12px 2px rgba(192, 57, 43, 0.45); }
}

.pocketpt-root .pkt-joint {
  animation: pkt-joint-pulse 2.2s ease-in-out infinite;
}

.pocketpt-root .pkt-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.pocketpt-root .pkt-scrollbar::-webkit-scrollbar-thumb {
  background: var(--pkt-border);
  border-radius: 4px;
}

.pocketpt-root :focus-visible {
  outline: 2px solid var(--pkt-accent);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .pocketpt-root .pkt-scanline::after {
    animation: none !important;
  }
  .pocketpt-root .pkt-joint {
    animation: none !important;
  }
}
`
