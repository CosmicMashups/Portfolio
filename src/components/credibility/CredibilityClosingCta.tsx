import { RESUME_PDF_URL } from '@/config/resume'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { ContactDialog } from '@/components/ui/ContactDialog'
import { useMagneticEffect } from '@/hooks/useMagneticEffect'
import { cn } from '@/components/ui/cn'

const UPDATED = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date())

export function CredibilityClosingCta({ className }: { className?: string }) {
  const resume = useMagneticEffect<HTMLAnchorElement>({ strength: 0.32 })
  const contact = useMagneticEffect<HTMLButtonElement>({ strength: 0.32 })

  return (
    <BorderTrace className={cn('rounded-[var(--radius-project)]', className)}>
      <div className="flex flex-col gap-6 rounded-[var(--radius-project)] border border-[var(--global-border)] px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
        <div className="max-w-xl space-y-2">
          <p className="font-[var(--font-display)] text-xl font-normal text-[var(--global-text)] md:text-2xl">
            Open to new challenges. Let&apos;s build something meaningful.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--global-text-muted)]">
            Last updated: {UPDATED}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            ref={
              // eslint-disable-next-line react-hooks/refs -- useMagneticEffect ref object; not reading .current
              resume.ref
            }
            href={RESUME_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-[1000px] bg-[var(--global-accent)] px-5 py-2.5 text-sm font-medium text-[var(--global-bg)]"
            download="Brown_Resume.pdf"
          >
            View full résumé
          </a>
          <ContactDialog magneticRef={contact.ref} />
        </div>
      </div>
    </BorderTrace>
  )
}
