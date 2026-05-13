import { createContext } from 'react'

export interface TechnicalViewContextValue {
  technical: boolean
  setTechnical: (v: boolean) => void
  toggleTechnical: () => void
}

export const TechnicalViewContext = createContext<TechnicalViewContextValue | null>(null)
