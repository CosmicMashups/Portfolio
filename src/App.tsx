import { AppRouter } from '@/router'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { ThemeAccentProvider } from '@/app/providers/ThemeAccentProvider'
import { TechnicalViewProvider } from '@/app/providers/TechnicalViewProvider'
import { ScrollRoot } from '@/app/providers/ScrollRoot'
import { PerformanceTierProvider } from '@/app/providers/PerformanceTierProvider'
import { ContactDialogProvider } from '@/components/ui/ContactDialog'

export default function App() {
  return (
    <ThemeProvider>
      <TechnicalViewProvider>
        <ThemeAccentProvider>
          <PerformanceTierProvider>
            <ScrollRoot>
              <ContactDialogProvider>
                <AppRouter />
              </ContactDialogProvider>
            </ScrollRoot>
          </PerformanceTierProvider>
        </ThemeAccentProvider>
      </TechnicalViewProvider>
    </ThemeProvider>
  )
}
