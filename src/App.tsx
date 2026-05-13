import { AppRouter } from '@/router'
import { ThemeAccentProvider } from '@/app/providers/ThemeAccentProvider'
import { TechnicalViewProvider } from '@/app/providers/TechnicalViewProvider'
import { ScrollRoot } from '@/app/providers/ScrollRoot'
import { ReducedMotionBridge } from '@/app/providers/ReducedMotionBridge'

export default function App() {
  return (
    <TechnicalViewProvider>
      <ThemeAccentProvider>
        <ReducedMotionBridge />
        <ScrollRoot>
          <AppRouter />
        </ScrollRoot>
      </ThemeAccentProvider>
    </TechnicalViewProvider>
  )
}
