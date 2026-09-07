import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

type PerformanceTier = 'high' | 'low'

interface PerformanceTierContextValue {
  tier: PerformanceTier
  reducedMotion: boolean
  lowTier: boolean
}

const PerformanceTierContext = createContext<PerformanceTierContextValue | null>(null)

function detectLowTier(reducedMotion: boolean): boolean {
  if (reducedMotion) return true
  if (typeof window === 'undefined') return false

  const nav = window.navigator as Navigator & {
    connection?: { saveData?: boolean }
    deviceMemory?: number
  }

  const cores = typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : 8
  const memory = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : 8
  const saveData = Boolean(nav.connection?.saveData)
  const touchOnly = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(hover: hover)').matches

  return saveData || cores <= 4 || memory <= 4 || touchOnly
}

export function PerformanceTierProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()
  const [tier, setTier] = useState<PerformanceTier>('high')

  useEffect(() => {
    const evaluate = () => setTier(detectLowTier(reducedMotion) ? 'low' : 'high')
    evaluate()

    const nav = window.navigator as Navigator & {
      connection?: { addEventListener?: (name: 'change', listener: () => void) => void; removeEventListener?: (name: 'change', listener: () => void) => void }
    }

    const pointerMq = window.matchMedia('(pointer: coarse)')
    const hoverMq = window.matchMedia('(hover: hover)')
    pointerMq.addEventListener('change', evaluate)
    hoverMq.addEventListener('change', evaluate)
    nav.connection?.addEventListener?.('change', evaluate)

    return () => {
      pointerMq.removeEventListener('change', evaluate)
      hoverMq.removeEventListener('change', evaluate)
      nav.connection?.removeEventListener?.('change', evaluate)
    }
  }, [reducedMotion])

  const value = useMemo<PerformanceTierContextValue>(
    () => ({
      tier,
      reducedMotion,
      lowTier: tier === 'low',
    }),
    [reducedMotion, tier],
  )

  return <PerformanceTierContext.Provider value={value}>{children}</PerformanceTierContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePerformanceTier() {
  const value = useContext(PerformanceTierContext)
  if (!value) {
    throw new Error('usePerformanceTier must be used within PerformanceTierProvider')
  }
  return value
}
