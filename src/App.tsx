import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'

// Auth pages
import { LoginPage } from '@/features/auth/LoginPage'
import { SignupPage } from '@/features/auth/SignupPage'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'

// Feature pages
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { DecksPage } from '@/features/decks/DecksPage'
import { DeckDetailPage } from '@/features/decks/DeckDetailPage'
import { PresetDecksPage } from '@/features/decks/PresetDecksPage'
import { ReviewPage } from '@/features/review/ReviewPage'
import { QuizPage } from '@/features/quiz/QuizPage'
import { QuizSessionPage } from '@/features/quiz/QuizSessionPage'
import { AchievementsPage } from '@/features/gamification/AchievementsPage'
import { SettingsPage } from '@/features/settings/SettingsPage'

const router = createBrowserRouter([
  // Public routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/decks', element: <DecksPage /> },
          { path: '/decks/preset', element: <PresetDecksPage /> },
          { path: '/decks/:deckId', element: <DeckDetailPage /> },
          { path: '/review', element: <ReviewPage /> },
          { path: '/review/:deckId', element: <ReviewPage /> },
          { path: '/quiz', element: <QuizPage /> },
          { path: '/quiz/:mode/:deckId', element: <QuizSessionPage /> },
          { path: '/achievements', element: <AchievementsPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])

export default function App() {
  const initialize = useAuthStore(state => state.initialize)

  useEffect(() => {
    const unsubscribe = initialize()
    return unsubscribe
  }, [initialize])

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
          },
        }}
      />
    </ErrorBoundary>
  )
}
