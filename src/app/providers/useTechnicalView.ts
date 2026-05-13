import { useContext } from 'react'
import {
  TechnicalViewContext,
  type TechnicalViewContextValue,
} from '@/app/providers/technicalViewContext'

export function useTechnicalView(): TechnicalViewContextValue {
  const ctx = useContext(TechnicalViewContext)
  if (!ctx) throw new Error('useTechnicalView must be used within TechnicalViewProvider')
  return ctx
}
