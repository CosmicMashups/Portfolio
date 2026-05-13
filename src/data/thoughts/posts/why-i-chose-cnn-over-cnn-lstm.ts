import type { ThoughtPost } from '@/data/thoughts'

export const whyIChoseCnnOverCnnLstm: ThoughtPost = {
  slug: 'why-i-chose-cnn-over-cnn-lstm',
  title: 'Why Our CNN Beat the CNN-LSTM Hybrid (And What I Learned From Being Wrong)',
  publishedAt: '2025-12-20',
  excerpt:
    "We designed PocketPT with a CNN-LSTM architecture for pose estimation. The LSTM lost. Here's why that was actually the right outcome.",
  tags: ['machine-learning', 'cnn', 'lstm', 'pocketpt', 'lessons'],
  featured: true,
  content: `We spent weeks believing sequence memory would save us. It felt obvious: rehabilitation is movement over time, so an LSTM should help. Then the baseline CNN won cleanly.

I was frustrated for a day. Then I looked at our data quality and the way real users moved during tests. Most sessions were short, noisy, and inconsistent. The LSTM was learning instability as often as it was learning form. The CNN handled that chaos better because it did less and did it reliably.

The lesson wasn't "never use LSTMs." The lesson was that architecture follows data reality, not the elegance of our original idea. If your data doesn't support temporal structure, your temporal model is just expensive confidence.

Being wrong in public as a team made the model better and the product safer. I'll take that trade every time.`,
}
