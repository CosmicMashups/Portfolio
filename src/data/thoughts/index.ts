import { differenceInMinutes, parseISO } from 'date-fns'
import readingTime from 'reading-time/lib/reading-time'
import { automating50000Rows } from '@/data/thoughts/posts/automating-50000-rows'
import { buildingForYourselfFirst } from '@/data/thoughts/posts/building-for-yourself-first'
import { whyIChoseCnnOverCnnLstm } from '@/data/thoughts/posts/why-i-chose-cnn-over-cnn-lstm'

export interface ThoughtPost {
  slug: string
  title: string
  publishedAt: string
  readingTime?: number
  excerpt: string
  tags: string[]
  content: string
  featured?: boolean
}

const seedPosts: ThoughtPost[] = [whyIChoseCnnOverCnnLstm, buildingForYourselfFirst, automating50000Rows]

export const THOUGHT_POSTS: ThoughtPost[] = seedPosts
  .map((post) => ({
    ...post,
    readingTime: readingTime(post.content).minutes,
  }))
  .sort((a, b) => differenceInMinutes(parseISO(b.publishedAt), parseISO(a.publishedAt)))

export function thoughtBySlug(slug?: string) {
  return THOUGHT_POSTS.find((post) => post.slug === slug)
}
