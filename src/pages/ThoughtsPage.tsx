import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { THOUGHT_POSTS } from '@/data/thoughts'
import { RevealText } from '@/components/ui/RevealText'
import { DrawUnderline } from '@/components/ui/DrawUnderline'
import { TiltCard } from '@/components/ui/TiltCard'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { useTextScramble } from '@/hooks/useTextScramble'

export function ThoughtsPage() {
  const featured = THOUGHT_POSTS.filter((post) => post.featured).slice(0, 2)
  const rest = THOUGHT_POSTS.filter((post) => !post.featured)
  const scramble = useTextScramble({ targetText: '// THOUGHTS' })

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl space-y-8 pt-6 outline-none sm:space-y-10 sm:pt-8">
      <header className="space-y-4">
        <p ref={scramble.ref} className="font-mono text-sm tracking-[0.2em] text-[var(--color-accent-primary)]">
          {scramble.displayText}
        </p>
        <RevealText className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
          Engineering notes, honest postmortems, and the things I wish someone had told me.
        </RevealText>
      </header>

      <section className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {featured.map((post) => (
          <TiltCard key={post.slug}>
            <BorderTrace>
              <Link to={`/thoughts/${post.slug}`} data-cursor="link" className="block rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                  <DrawUnderline>{post.title}</DrawUnderline>
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-secondary)]">{post.excerpt}</p>
                <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                  {format(new Date(post.publishedAt), 'MMM d, yyyy')} · {Math.ceil(post.readingTime ?? 1)} min read
                </p>
              </Link>
            </BorderTrace>
          </TiltCard>
        ))}
      </section>

      <section className="space-y-4">
        {rest.map((post) => (
          <Link
            key={post.slug}
            to={`/thoughts/${post.slug}`}
            data-cursor="link"
            className="block rounded-xl border border-[var(--color-border-subtle)] p-6 transition-colors hover:border-[var(--color-border-accent)]"
          >
            <h3 className="font-semibold text-[var(--color-text-primary)]">{post.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-secondary)]">{post.excerpt}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
