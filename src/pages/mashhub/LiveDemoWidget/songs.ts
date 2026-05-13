import type { Song } from './fuzzyEngine'

export const DEMO_SONGS: Song[] = [
  {
    id: 'blue-bird',
    title: 'Blue Bird',
    artist: 'Ikimono-gakari',
    sections: [
      { part: 'Verse', bpm: 154, key: 'G Major' },
      { part: 'Chorus', bpm: 154, key: 'G Major' },
    ],
  },
  {
    id: 'gurenge',
    title: 'Gurenge',
    artist: 'LiSA',
    sections: [
      { part: 'Verse', bpm: 174, key: 'F# Minor' },
      { part: 'Chorus', bpm: 174, key: 'A Major' },
    ],
  },
  {
    id: 'silhouette',
    title: 'Silhouette',
    artist: 'KANA-BOON',
    sections: [
      { part: 'Verse', bpm: 195, key: 'C Major' },
      { part: 'Chorus', bpm: 195, key: 'C Major' },
    ],
  },
  {
    id: 'again',
    title: 'Again',
    artist: 'YUI',
    sections: [
      { part: 'Verse', bpm: 176, key: 'B Minor' },
      { part: 'Chorus', bpm: 176, key: 'D Major' },
    ],
  },
  {
    id: 'unravel',
    title: 'Unravel',
    artist: 'TK from Ling Tosite Sigure',
    sections: [
      { part: 'Verse', bpm: 130, key: 'B Minor' },
      { part: 'Chorus', bpm: 130, key: 'G# Minor' },
    ],
  },
  {
    id: 'crossing-field',
    title: 'Crossing Field',
    artist: 'LiSA',
    sections: [
      { part: 'Verse', bpm: 146, key: 'E Minor' },
      { part: 'Chorus', bpm: 150, key: 'G Major' },
    ],
  },
]
