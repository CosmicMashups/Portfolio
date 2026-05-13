import { useTechnicalView } from '@/app/providers/useTechnicalView'
import { cn } from '@/components/ui/cn'

export function ToggleTechnical({ className }: { className?: string }) {
  const { technical, toggleTechnical } = useTechnicalView()

  return (
    <button
      type="button"
      onClick={toggleTechnical}
      className={cn(
        'fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-[var(--global-border)] px-4 py-2 text-xs font-medium backdrop-blur-md transition-colors',
        technical
          ? 'border-[var(--accent-primary)] bg-[color:color-mix(in_oklab,var(--accent-primary)_18%,transparent)]'
          : 'bg-[var(--global-surface)]/90 hover:border-[var(--accent-primary)]',
        className,
      )}
      aria-pressed={technical}
    >
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          technical ? 'bg-[var(--accent-primary)]' : 'bg-[var(--global-text-muted)]',
        )}
      />
      Technical view
    </button>
  )
}
