import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useStats } from '@/hooks/useStats'
import { StatsOverview } from './components/StatsOverview'
import { StreakCalendar } from './components/StreakCalendar'
import { DailyGoalWidget } from './components/DailyGoalWidget'
import { ReviewForecast } from './components/ReviewForecast'
import { AccuracyChart } from './components/AccuracyChart'
import { DeckProgressList } from './components/DeckProgressList'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ROUTES } from '@/config/routes'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Chào buổi sáng'
  if (h < 18) return 'Chao buoi chieu'
  return 'Chao buoi toi'
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { stats, profile } = useAuthStore()
  const { todayReviews, heatmapData, accuracyData, forecastData, deckProgress, loading } = useStats()

  if (loading) {
    return <LoadingSpinner className="min-h-[calc(100vh-4rem)] flex items-center justify-center" size="lg" />
  }

  const displayName = profile?.display_name || 'ban'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getGreeting()}, {displayName}!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Tổng quan quá trình học của bạn</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate(ROUTES.REVIEW)}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Ôn tập ngay
          </Button>
          <Button variant="outline" onClick={() => navigate(ROUTES.QUIZ)}>
            Quiz
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <StatsOverview stats={stats} todayReviews={todayReviews} />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StreakCalendar data={heatmapData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AccuracyChart data={accuracyData} />
            <ReviewForecast data={forecastData} />
          </div>
        </div>

        <div className="space-y-6">
          <DailyGoalWidget current={todayReviews} goal={stats?.daily_goal ?? 30} />
          <DeckProgressList decks={deckProgress} />
        </div>
      </div>
    </div>
  )
}
