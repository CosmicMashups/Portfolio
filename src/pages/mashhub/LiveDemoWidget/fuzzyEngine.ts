export type SectionPart = 'Intro' | 'Verse' | 'Chorus' | 'Bridge' | 'Outro'

export interface SongSection {
  part: SectionPart
  bpm: number
  key: string
}

export interface Song {
  id: string
  title: string
  artist: string
  sections: SongSection[]
}

export type AffinityTier = 'HIGH' | 'MEDIUM' | 'LOW'

const KEY_MAP: Record<string, number> = {
  'C Major': 0,
  'C# Major': 1,
  'D Major': 2,
  'D# Major': 3,
  'E Major': 4,
  'F Major': 5,
  'F# Major': 6,
  'G Major': 7,
  'G# Major': 8,
  'A Major': 9,
  'A# Major': 10,
  'B Major': 11,
  'C Minor': 0,
  'C# Minor': 1,
  'D Minor': 2,
  'D# Minor': 3,
  'E Minor': 4,
  'F Minor': 5,
  'F# Minor': 6,
  'G Minor': 7,
  'G# Minor': 8,
  'A Minor': 9,
  'A# Minor': 10,
  'B Minor': 11,
}

export function bpmScore(bpm1: number, bpm2: number): number {
  const diff = Math.abs(bpm1 - bpm2)
  if (diff <= 10) return Math.max(0, 1 - diff * 0.02)
  return Math.max(0, 0.7 - (diff - 11) * (0.7 / 9))
}

export function keyScore(key1: string, key2: string): number {
  const pc1 = KEY_MAP[key1] ?? 0
  const pc2 = KEY_MAP[key2] ?? 0
  const raw = Math.abs(pc1 - pc2)
  const dist = Math.min(raw, 12 - raw)

  const sameRoot = pc1 === pc2
  const sameMode = key1.includes('Major') === key2.includes('Major')

  if (sameRoot && !sameMode) return 0.85
  return Math.max(0, 1 - dist / 6)
}

export function semitoneDistance(key1: string, key2: string): number {
  const pc1 = KEY_MAP[key1] ?? 0
  const pc2 = KEY_MAP[key2] ?? 0
  const raw = Math.abs(pc1 - pc2)
  return Math.min(raw, 12 - raw)
}

export interface MatchOutcome {
  score: number
  bpmMu: number
  keyMu: number
  pairs: SectionPairScore[]
  fallback: boolean
}

export interface SectionPairScore {
  part: SectionPart
  bpmDiff: number
  bpmMu: number
  keyDist: number
  keyMu: number
}

const BASE_OFFSET = 0.1
const WEIGHT_BPM = 0.45
const WEIGHT_KEY = 0.45

export function matchScore(target: Song, candidate: Song): MatchOutcome {
  const pairs: SectionPairScore[] = []
  let totalBpm = 0
  let totalKey = 0

  for (const ts of target.sections) {
    for (const cs of candidate.sections) {
      if (ts.part === cs.part) {
        const bpmMu = bpmScore(ts.bpm, cs.bpm)
        const keyMu = keyScore(ts.key, cs.key)
        pairs.push({
          part: ts.part,
          bpmDiff: Math.abs(ts.bpm - cs.bpm),
          bpmMu,
          keyDist: semitoneDistance(ts.key, cs.key),
          keyMu,
        })
        totalBpm += bpmMu
        totalKey += keyMu
      }
    }
  }

  let fallback = false
  let pairCount = pairs.length
  if (pairCount === 0) {
    fallback = true
    const ts = target.sections[0]
    const cs = candidate.sections[0]
    if (ts && cs) {
      const bpmMu = bpmScore(ts.bpm, cs.bpm)
      const keyMu = keyScore(ts.key, cs.key)
      totalBpm = bpmMu
      totalKey = keyMu
      pairs.push({
        part: ts.part,
        bpmDiff: Math.abs(ts.bpm - cs.bpm),
        bpmMu,
        keyDist: semitoneDistance(ts.key, cs.key),
        keyMu,
      })
      pairCount = 1
    } else {
      return { score: 0, bpmMu: 0, keyMu: 0, pairs: [], fallback: true }
    }
  }

  const avgBpm = totalBpm / pairCount
  const avgKey = totalKey / pairCount
  const score = avgBpm * WEIGHT_BPM + avgKey * WEIGHT_KEY + BASE_OFFSET

  return {
    score: Math.max(0, Math.min(1, score)),
    bpmMu: avgBpm,
    keyMu: avgKey,
    pairs,
    fallback,
  }
}

export function affinityTier(score: number): AffinityTier {
  if (score > 0.7) return 'HIGH'
  if (score >= 0.4) return 'MEDIUM'
  return 'LOW'
}

function describePair(pair: SectionPairScore): string {
  if (pair.keyDist === 0 && pair.bpmDiff === 0) {
    return `${pair.part} locks perfectly (same key, same BPM)`
  }
  if (pair.keyDist === 0) {
    return `${pair.part} keys identical · ${pair.bpmDiff} BPM apart (μ ${pair.bpmMu.toFixed(2)})`
  }
  if (pair.bpmDiff === 0) {
    return `${pair.part} BPM identical · keys ${pair.keyDist} semitone${pair.keyDist === 1 ? '' : 's'} apart (μ ${pair.keyMu.toFixed(2)})`
  }
  if (pair.keyDist === 6) {
    return `${pair.part} keys are a tritone apart — incompatible (μ 0.00)`
  }
  return `${pair.part}: ${pair.bpmDiff} BPM apart (μ ${pair.bpmMu.toFixed(2)}) · ${pair.keyDist} semitone${pair.keyDist === 1 ? '' : 's'} apart (μ ${pair.keyMu.toFixed(2)})`
}

export function buildReason(outcome: MatchOutcome): string {
  if (outcome.fallback) {
    const p = outcome.pairs[0]
    if (!p) return 'No comparable sections.'
    return `No shared section labels — compared whole-song: ${p.bpmDiff} BPM apart (μ ${p.bpmMu.toFixed(2)}) · keys ${p.keyDist} semitones apart (μ ${p.keyMu.toFixed(2)})`
  }

  if (outcome.pairs.length === 0) {
    return 'No comparable sections.'
  }

  if (outcome.pairs.length === 1) {
    const pair = outcome.pairs[0]
    return pair ? describePair(pair) : 'No comparable sections.'
  }

  const sorted = [...outcome.pairs].sort((a, b) => b.bpmMu + b.keyMu - (a.bpmMu + a.keyMu))
  const top = sorted[0]
  const tail = sorted.length > 1 ? `+ ${sorted.length - 1} more section pair${sorted.length - 1 === 1 ? '' : 's'}` : ''
  return top ? `${describePair(top)} ${tail}`.trim() : 'No comparable sections.'
}
