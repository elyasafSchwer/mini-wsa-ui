import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { OverviewPage } from '@/features/overview/OverviewPage'
import { ExplorerPage } from '@/features/explorer/ExplorerPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'events', element: <ExplorerPage /> },
    ],
  },
])
