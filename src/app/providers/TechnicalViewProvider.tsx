import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { TechnicalViewContext } from '@/app/providers/technicalViewContext'

const STORAGE_KEY = 'yuri-portfolio-technical-view'

function readInitial(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) === '1'
}

export function TechnicalViewProvider({ children }: { children: ReactNode }) {
  const [technical, setTechnicalState] = useState(readInitial)

  const setTechnical = useCallback((v: boolean) => {
    setTechnicalState(v)
    try {
      window.localStorage.setItem(STORAGE_KEY, v ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [])

  const toggleTechnical = useCallback(() => {
    setTechnicalState((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ technical, setTechnical, toggleTechnical }),
    [technical, setTechnical, toggleTechnical],
  )

  return (
    <TechnicalViewContext.Provider value={value}>{children}</TechnicalViewContext.Provider>
  )
}
