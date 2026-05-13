import { Link, useParams } from 'react-router-dom'
import { useRef } from 'react'
import { format } from 'date-fns'
import { thoughtBySlug } from '@/data/thoughts'
import { RevealText } from '@/components/ui/RevealText'
import { ReadingProgress } from '@/components/ui/ReadingProgress'
import { CodeBlock } from '@/components/ui/CodeBlock'

export function ThoughtPostPage() {
  const { slug } = useParams()
  const post = thoughtBySlug(slug)
  const articleRef = useRef<HTMLElement | null>(null)

  if (!post) {
    return (
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl pt-8 outline-none">
        <p className="text-[var(--color-text-secondary)]">Post not found.</p>
        <Link to="/thoughts" className="mt-3 inline-flex text-sm text-[var(--color-accent-primary)]">
          ← Thoughts
        </Link>
      </main>
    )
  }

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl pt-8 outline-none">
      <ReadingProgress content={post.content} postRef={articleRef as never} />
      <Link to="/thoughts" className="inline-flex text-sm text-[var(--color-accent-primary)]">
        ← Thoughts
      </Link>
      <article ref={articleRef} className="mt-6 space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[var(--color-accent-secondary-dim)] px-2 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-[var(--color-text-primary)]">
            <RevealText>{post.title}</RevealText>
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {format(new Date(post.publishedAt), 'MMM d, yyyy')} · {Math.ceil(post.readingTime ?? 1)} min read
          </p>
          <div className="h-px w-full bg-[var(--color-border-default)]" />
        </header>
        <div className="space-y-4 text-[1.02rem] leading-[1.8] text-[var(--color-text-secondary)]">
          {post.content.split('\n\n').map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <CodeBlock
          filename="decision.ts"
          language="typescript"
          code={`const stance = "Architecture follows data reality.";\nconsole.log(stance);`}
        />
      </article>
      <footer className="mt-10 border-t border-[var(--color-border-subtle)] pt-6">
        <Link to="/thoughts" className="text-[var(--color-accent-primary)]">
          If this was useful, the next one might be too.
        </Link>
      </footer>
    </main>
  )
}
