declare module 'reading-time/lib/reading-time' {
  interface ReadTimeResults {
    text: string
    minutes: number
    time: number
    words: number
  }

  export default function readingTime(text: string): ReadTimeResults
}
