import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export function Header() {
  const { profile } = useAuthStore()
  const { toggleSidebar } = useUIStore()

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-sidebar border-b border-border-light dark:border-border-dark">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">VocabMaster</h1>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
            {profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}
