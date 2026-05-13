import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-start justify-center gap-4 px-4 outline-none"
    >
      <p className="font-mono text-sm tracking-[0.18em] text-[var(--accent-primary)]">// 404 — PAGE NOT FOUND</p>
      <h1 className="text-4xl font-semibold text-[var(--global-text)] md:text-5xl">You took a wrong turn.</h1>
      <p className="text-[var(--global-text-muted)]">Happens to the best models.</p>
      <Link to="/" className="text-sm text-[var(--accent-primary)]">
        Return home
      </Link>
    </main>
  )
}
