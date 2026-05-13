import { useContext } from 'react'
import {
  ThemeAccentContext,
  type ThemeAccentContextValue,
} from '@/app/providers/themeAccentContext'

export function useThemeAccent(): ThemeAccentContextValue {
  const ctx = useContext(ThemeAccentContext)
  if (!ctx) throw new Error('ThemeAccentProvider missing')
  return ctx
}
