import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { FullPageLoader } from '@/components/shared/LoadingSpinner'
import { ROUTES } from '@/config/routes'

export function AuthLayout() {
  const { user, loading } = useAuthStore()

  if (loading) return <FullPageLoader />
  if (user) return <Navigate to={ROUTES.DASHBOARD} replace />

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark p-4">
      <div className="w-full max-w-md animate-page-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">VocabMaster</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Học từ vựng thông minh</p>
        </div>

        {/* Auth form */}
        <div className="bg-white dark:bg-sidebar rounded-xl border border-border-light dark:border-border-dark p-6 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
