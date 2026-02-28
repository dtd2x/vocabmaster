import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar />
      <MobileNav />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 flex flex-col p-4 lg:p-8 animate-page-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
