import * as Dialog from '@radix-ui/react-dialog'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type Ref,
} from 'react'
import { Copy, Github, Linkedin, Mail, X } from 'lucide-react'
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from '@/config/contact'
import { Button, LinkButton } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

const triggerStyles =
  'inline-flex items-center justify-center rounded-full border border-[var(--global-border)] px-5 py-2.5 text-sm font-medium text-[var(--global-text)] hover:border-[var(--accent-primary)]'

const panelStyles =
  'w-[min(100vw-2rem,26rem)] rounded-[var(--radius-project)] border border-[color:color-mix(in_oklab,var(--accent-primary)_28%,var(--global-border))] bg-[color:color-mix(in_oklab,var(--surface-tint)_92%,var(--global-surface))] p-6 shadow-lg'

type ContactDialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const ContactDialogContext = createContext<ContactDialogContextValue | null>(null)

export function useContactDialog() {
  const ctx = useContext(ContactDialogContext)
  if (!ctx) {
    throw new Error('useContactDialog must be used within ContactDialogProvider')
  }
  return ctx
}

export function ContactDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((v) => !v), [])
  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle])

  return (
    <ContactDialogContext.Provider value={value}>
      {children}
      <ContactDialogSurface />
    </ContactDialogContext.Provider>
  )
}

function ContactDialogSurface() {
  const { open, setOpen } = useContactDialog()
  const [copied, setCopied] = useState(false)

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = CONTACT_EMAIL
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      } catch {
        setCopied(false)
      }
    }
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-[color:color-mix(in_oklab,black_55%,transparent)] backdrop-blur-[2px]" />
        <Dialog.Content
          id="contact-dialog-content"
          className={cn(
            'fixed left-1/2 top-1/2 z-[var(--z-overlay)] max-h-[min(90vh,32rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto outline-none',
            panelStyles,
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="font-[var(--font-display)] text-lg font-semibold text-[var(--global-text)]">
                Let&apos;s talk
              </Dialog.Title>
              <Dialog.Description className="mt-1 font-[var(--font-mono)] text-xs leading-relaxed text-[var(--global-text-muted)]">
                Reach out by email or connect on GitHub and LinkedIn. I typically respond within a few business days.
              </Dialog.Description>
            </div>
            <Dialog.Close
              type="button"
              className="rounded-[var(--radius-project)] border border-transparent p-1.5 text-[var(--global-text-muted)] transition-colors hover:border-[var(--global-border)] hover:text-[var(--global-text)]"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden />
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="gap-2 rounded-full text-xs"
                onClick={() => void copyEmail()}
              >
                <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {copied ? 'Copied' : 'Copy email'}
              </Button>
              <LinkButton href={`mailto:${CONTACT_EMAIL}`} variant="primary" className="gap-2 rounded-full text-xs">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Email
              </LinkButton>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-[var(--global-border)] pt-4">
              <LinkButton
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="gap-2 rounded-full text-xs"
              >
                <Github className="h-3.5 w-3.5 shrink-0" aria-hidden />
                GitHub
              </LinkButton>
              <LinkButton
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="gap-2 rounded-full text-xs"
              >
                <Linkedin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                LinkedIn
              </LinkButton>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function ContactDialog({
  magneticRef,
  triggerClassName,
}: {
  magneticRef?: Ref<HTMLButtonElement | null>
  triggerClassName?: string
}) {
  const { setOpen } = useContactDialog()

  return (
    <button
      type="button"
      ref={magneticRef}
      className={cn(triggerStyles, triggerClassName)}
      onClick={() => setOpen(true)}
    >
      Get in touch
    </button>
  )
}
