import type { ThoughtPost } from '@/data/thoughts'

export const automating50000Rows: ThoughtPost = {
  slug: 'automating-50000-rows',
  title: "I Automated 50,000 Rows of Manual Work in 6 Weeks. Here's What I'd Do Differently.",
  publishedAt: '2026-02-05',
  excerpt:
    'At PASIA, interns and staff were manually categorizing expense data — tens of thousands of rows. A logistic regression classifier fixed most of it. Most.',
  tags: ['machine-learning', 'python', 'automation', 'lessons'],
  featured: false,
  content: `On week one I watched people burn hours categorizing rows by hand. It looked small at first, then the backlog kept growing, and everyone treated it as normal.

I built a logistic regression classifier because it was fast to train, easy to inspect, and good enough to remove most manual passes. It worked, but not magically. Ambiguous entries still needed human review, and edge cases kept exposing assumptions in our labels.

What I'd change: I would define confidence thresholds with stakeholders earlier, and I would log correction reasons from day one instead of treating feedback as ad hoc notes.

Automation isn't about replacing judgment. It's about reserving judgment for the rows that actually deserve it.`,
}
