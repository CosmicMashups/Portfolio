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
      <ChevronDown className="h-4 w-4 animate-bounce opacity-60" aria-hidden />
    </div>
  )
}
