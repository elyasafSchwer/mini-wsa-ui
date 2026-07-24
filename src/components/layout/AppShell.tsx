import { useLocation, Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

const TITLES: Record<string, string> = {
  '/': 'Security Overview',
  '/events': 'Event Explorer',
}

export function AppShell() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'Web Security Analytics'

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
