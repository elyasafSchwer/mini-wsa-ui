import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/app/queryClient'
import { ThemeProvider } from '@/hooks/useTheme'
import { PollingProvider } from '@/hooks/usePollingControl'

/** Composes all app-wide context providers in one place. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PollingProvider>{children}</PollingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
