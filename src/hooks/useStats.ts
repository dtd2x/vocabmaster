import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/config/supabase'
import { useAuthStore } from '@/stores/authStore'
import { format, subDays, addDays } from 'date-fns'
import type { DeckWithStats } from '@/types/card'

interface HeatmapData { review_date: string; review_count: number }
interface AccuracyData { date: string; accuracy: number }
interface ForecastData { date: string; count: number }

export function useStats() {
  const { user } = useAuthStore()
  const [todayReviews, setTodayReviews] = useState(0)
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])
  const [accuracyData, setAccuracyData] = useState<AccuracyData[]>([])
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [deckProgress, setDeckProgress] = useState<DeckWithStats[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    if (!user) return
    setLoading(true)

    try {
      // Today's review count
      const todayStr = format(new Date(), 'yyyy-MM-dd')
      const { count: todayCount } = await supabase
        .from('review_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('reviewed_at', `${todayStr}T00:00:00`)

      setTodayReviews(todayCount ?? 0)

      // Heatmap (last 365 days)
      const { data: heatmap } = await supabase.rpc('get_review_heatmap', {
        p_user_id: user.id,
        p_days: 365,
      })
      setHeatmapData((heatmap as HeatmapData[]) ?? [])

      // Accuracy (last 30 days)
      const thirtyDaysAgo = subDays(new Date(), 30)
      const { data: recentLogs } = await supabase
        .from('review_logs')
        .select('rating, reviewed_at')
        .eq('user_id', user.id)
        .gte('reviewed_at', thirtyDaysAgo.toISOString())
        .order('reviewed_at')

      if (recentLogs && recentLogs.length > 0) {
        const dailyAccuracy = new Map<string, { correct: number; total: number }>()
        for (const log of recentLogs) {
          const day = format(new Date(log.reviewed_at), 'dd/MM')
          const entry = dailyAccuracy.get(day) ?? { correct: 0, total: 0 }
          entry.total++
          if (log.rating >= 3) entry.correct++
          dailyAccuracy.set(day, entry)
        }
        setAccuracyData(
          Array.from(dailyAccuracy.entries()).map(([date, { correct, total }]) => ({
            date,
            accuracy: (correct / total) * 100,
          }))
        )
      }

      // Forecast (next 7 days)
      const forecast: ForecastData[] = []
      for (let i = 0; i < 7; i++) {
        const day = addDays(new Date(), i)
        const dayStart = format(day, 'yyyy-MM-dd') + 'T00:00:00'
        const dayEnd = format(day, 'yyyy-MM-dd') + 'T23:59:59'

        const { count } = await supabase
          .from('card_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('next_review', dayStart)
          .lte('next_review', dayEnd)

        forecast.push({
          date: format(day, 'dd/MM'),
          count: count ?? 0,
        })
      }
      setForecastData(forecast)

      // Deck progress
      const { data: decks } = await supabase
        .from('decks')
        .select('*')
        .or(`user_id.eq.${user.id},is_preset.eq.true`)

      if (decks) {
        const deckStats: DeckWithStats[] = await Promise.all(
          decks.map(async (deck) => {
            const { data: progress } = await supabase
              .from('card_progress')
              .select('status')
              .eq('user_id', user.id)
              .in('card_id', (
                await supabase.from('cards').select('id').eq('deck_id', deck.id)
              ).data?.map(c => c.id) ?? [])

            const counts = { new: 0, learning: 0, review: 0, graduated: 0 }
            for (const p of progress ?? []) {
              counts[p.status as keyof typeof counts]++
            }

            return {
              ...deck,
              new_count: counts.new,
              learning_count: counts.learning,
              review_count: counts.review,
              graduated_count: counts.graduated,
            }
          })
        )
        setDeckProgress(deckStats)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { todayReviews, heatmapData, accuracyData, forecastData, deckProgress, loading, refetch: fetchStats }
}
