import { ChevronDown } from 'lucide-react'
import { cn } from '@/components/ui/cn'

export function ScrollHint({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mt-10 flex flex-col items-center gap-1 text-[11px] text-[var(--global-text-muted)]',
        className,
      )}
    >
      <span className="uppercase tracking-[0.25em]">Scroll</span>
      <ChevronDown
        className="scroll-hint-chevron-motion h-4 w-4 opacity-70"
        style={{ animation: 'scroll-hint-chevron 2.2s ease-in-out infinite' }}
        aria-hidden
      />
    </div>
  )
}
