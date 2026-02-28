import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { FullPageLoader } from './LoadingSpinner'
import { ROUTES } from '@/config/routes'

export function ProtectedRoute() {
  const { user, loading } = useAuthStore()

  if (loading) return <FullPageLoader />
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />

  return <Outlet />
}
