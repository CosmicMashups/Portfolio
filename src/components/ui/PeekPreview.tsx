import type { ReactNode } from 'react'

interface PeekPreviewProps {
  previewContent: ReactNode
  children: ReactNode
}

export function PeekPreview({ previewContent, children }: PeekPreviewProps) {
  return (
    <div className="peek-card group relative overflow-hidden">
      <div className="transition-opacity duration-300 group-hover:opacity-70">{children}</div>
      <div
        className="peek-layer pointer-events-none absolute inset-x-0 bottom-0 h-[40%] translate-y-full transition-transform duration-300 group-hover:translate-y-0"
        style={{
          background: 'linear-gradient(to top, var(--color-bg-surface), transparent)',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      >
        {previewContent}
      </div>
    </div>
  )
}
