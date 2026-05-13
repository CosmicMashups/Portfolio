import { BorderTrace } from '@/components/ui/BorderTrace'
import { useMagneticEffect } from '@/hooks/useMagneticEffect'
import { cn } from '@/components/ui/cn'

const UPDATED = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date())

export function CredibilityClosingCta({ className }: { className?: string }) {
  const resume = useMagneticEffect({ strength: 0.32 })
  const contact = useMagneticEffect({ strength: 0.32 })

  return (
    <BorderTrace className={cn('rounded-[var(--radius-project)]', className)}>
      <div className="flex flex-col gap-6 rounded-[var(--radius-project)] border border-[color:color-mix(in_oklab,var(--accent-primary)_28%,var(--global-border))] bg-[color:color-mix(in_oklab,var(--surface-tint)_88%,transparent)] px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
        <div className="max-w-xl space-y-2">
          <p className="font-[var(--font-display)] text-xl font-semibold text-[var(--global-text)] md:text-2xl">
            Open to new challenges. Let&apos;s build something meaningful.
          </p>
          <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--global-text-muted)]">
            Last updated: {UPDATED}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            ref={resume.ref as never}
            href="#"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-border-accent)] bg-[var(--color-accent-primary-dim)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-primary)]"
          >
            View full résumé
          </a>
          <a
            ref={contact.ref as never}
            href="#"
            className="inline-flex items-center justify-center rounded-full border border-[var(--global-border)] px-5 py-2.5 text-sm font-medium text-[var(--global-text)] hover:border-[var(--accent-primary)]"
          >
            Get in touch
          </a>
        </div>
      </div>
    </BorderTrace>
  )
}
