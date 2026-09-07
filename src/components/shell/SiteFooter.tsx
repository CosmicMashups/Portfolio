import { Github, Linkedin, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from '@/config/contact'
import { RESUME_PDF_URL } from '@/config/resume'
import { useContactDialog } from '@/components/ui/ContactDialog'

const FOOTER_LINK_CLASS =
  'text-sm text-[rgba(252,252,247,0.72)] transition-colors hover:text-[#fcfcf7]'

/**
 * Site-wide footer, dark Forest Depths band — fixed to that surface regardless of the
 * light/dark toggle, same treatment as the alternating project sections and the old
 * decorative band this replaces. Unlike that band, every element here is a real,
 * keyboard-reachable link (not `aria-hidden`).
 */
export function SiteFooter() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toggle: toggleContactDialog } = useContactDialog()
  const year = new Date().getFullYear()

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname === '/') {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      void navigate({ pathname: '/', hash: 'projects' })
    }
  }

  return (
    <footer
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#1c3a13] text-[#fcfcf7]"
      style={{ '--accent-primary': '#d3fa99', '--color-accent-primary': '#d3fa99' } as React.CSSProperties}
    >
      <div className="mx-auto max-w-[var(--shell-content-max-width)] px-[var(--shell-gutter-sm)] py-16 sm:px-[var(--shell-gutter-md)] md:py-20 lg:px-[var(--shell-gutter-lg)]">
        <span className="block font-[var(--font-display)] text-4xl font-normal tracking-[-0.02em] md:text-6xl">
          Yuri Brown
        </span>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[rgba(252,252,247,0.72)]">
          Software / ML Engineer — I build systems for the problems I&apos;ve lived through myself.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:mt-12">
          <nav aria-label="Footer navigation">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgba(252,252,247,0.5)]">
              Site
            </p>
            <ul className="mt-3 space-y-2.5">
              <li>
                <Link to="/" className={FOOTER_LINK_CLASS}>
                  Home
                </Link>
              </li>
              <li>
                <a href="/#projects" onClick={scrollToProjects} className={FOOTER_LINK_CLASS}>
                  Selected Work
                </a>
              </li>
              <li>
                <Link to="/thoughts" className={FOOTER_LINK_CLASS}>
                  Thoughts
                </Link>
              </li>
              <li>
                <a
                  href={RESUME_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Brown_Resume.pdf"
                  className={FOOTER_LINK_CLASS}
                >
                  Résumé
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Footer contact">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgba(252,252,247,0.5)]">
              Contact
            </p>
            <ul className="mt-3 space-y-2.5">
              <li>
                <button type="button" onClick={() => toggleContactDialog()} className={FOOTER_LINK_CLASS}>
                  Get in touch
                </button>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className={`inline-flex items-center gap-1.5 ${FOOTER_LINK_CLASS}`}>
                  <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Footer social">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgba(252,252,247,0.5)]">
              Elsewhere
            </p>
            <ul className="mt-3 space-y-2.5">
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 ${FOOTER_LINK_CLASS}`}
                >
                  <Github className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 ${FOOTER_LINK_CLASS}`}
                >
                  <Linkedin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  LinkedIn
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[rgba(252,252,247,0.15)] pt-6 text-xs text-[rgba(252,252,247,0.5)] sm:flex-row sm:items-center sm:justify-between md:mt-14">
          <span>© {year} Yuri Brown. All rights reserved.</span>
          <span>Built with React, TypeScript, and Tailwind.</span>
        </div>
      </div>
    </footer>
  )
}
