import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useReviewStore } from '@/stores/reviewStore'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { buildReviewQueue, initializeCardsForUser } from '@/lib/review-queue'
import { calculateStreak } from '@/lib/streak'
import { levelFromXP } from '@/lib/xp'
import { supabase } from '@/config/supabase'
import { FlashcardViewer } from './components/FlashcardViewer'
import { RatingButtons } from './components/RatingButtons'
import { ReviewProgress } from './components/ReviewProgress'
import { SessionSummary } from './components/SessionSummary'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { ROUTES } from '@/config/routes'
import type { Rating } from '@/types/review'
import toast from 'react-hot-toast'

export function ReviewPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const { user, stats, fetchStats } = useAuthStore()
  const { newCardsPerDay, reviewLimit } = useSettingsStore()
  const {
    queue, currentIndex, isFlipped, setQueue, flipCard, rateCard,
    getCurrentCard, isSessionComplete, getSessionSummary, resetSession,
  } = useReviewStore()
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(false)

  const loadQueue = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      // Initialize cards if reviewing a specific deck
      if (deckId) {
        await initializeCardsForUser(supabase, user.id, deckId)
      }

      const cards = await buildReviewQueue(supabase, user.id, deckId, newCardsPerDay, reviewLimit)
      setQueue(cards)
    } catch (err) {
      console.error('Error loading review queue:', err)
      toast.error('Không thể tải danh sách ôn tập')
    } finally {
      setLoading(false)
    }
  }, [user, deckId, newCardsPerDay, reviewLimit, setQueue])

  useEffect(() => {
    loadQueue()
    return () => resetSession()
  }, [loadQueue, resetSession])

  // Keyboard: Space to flip
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space' && !isFlipped && !isSessionComplete()) {
        e.preventDefault()
        flipCard()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFlipped, flipCard, isSessionComplete])

  const handleRate = async (r: Rating) => {
    if (!user || !stats || rating) return
    setRating(true)
    try {
      const { xpEarned } = await rateCard(user.id, r, stats.current_streak)

      // Update user stats
      const { newStreak, isNewDay } = calculateStreak(stats.last_review_date, stats.current_streak)

      await supabase
        .from('user_stats')
        .update({
          xp: stats.xp + xpEarned,
          level: levelFromXP(stats.xp + xpEarned),
          current_streak: newStreak,
          longest_streak: Math.max(stats.longest_streak, newStreak),
          last_review_date: isNewDay ? new Date().toISOString().split('T')[0] : stats.last_review_date,
          total_reviews: stats.total_reviews + 1,
          total_cards_learned: r >= 3 ? stats.total_cards_learned + 1 : stats.total_cards_learned,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      await fetchStats()
    } catch (err) {
      console.error('Error rating card:', err)
      toast.error('Có lỗi khi lưu kết quả')
    } finally {
      setRating(false)
    }
  }

  if (loading) return <PageSpinner />

  if (queue.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-16 flex flex-col items-center text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Không có thẻ nào cần ôn</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
          {deckId ? 'Bộ từ này chưa có thẻ hoặc bạn đã ôn hết rồi!' : 'Tất cả các bộ từ đều đã được ôn tập. Quay lại sau nhé!'}
        </p>
        <Button onClick={() => navigate(ROUTES.DASHBOARD)}>Về Dashboard</Button>
      </div>
    )
  }

  // Session complete
  if (isSessionComplete()) {
    const summary = getSessionSummary(stats?.current_streak ?? 0)
    return (
      <div className="max-w-lg mx-auto py-12">
        <SessionSummary
          summary={summary}
          onGoHome={() => navigate(ROUTES.DASHBOARD)}
          onReviewAgain={() => loadQueue()}
        />
      </div>
    )
  }

  const currentCard = getCurrentCard()
  if (!currentCard) return null

  return (
    <div className="max-w-lg mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Thoát
        </button>
        <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-xs font-medium text-gray-500 dark:text-gray-400">
          {currentCard.deck_name}
        </span>
      </div>

      {/* Progress */}
      <ReviewProgress current={currentIndex} total={queue.length} />

      {/* Flashcard */}
      <div className="my-8">
        <FlashcardViewer
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={() => { if (!isFlipped) flipCard() }}
        />
      </div>

      {/* Rating buttons - only show when flipped */}
      {isFlipped && (
        <div className="mt-6">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-4">Bạn nhớ từ này thế nào?</p>
          <RatingButtons onRate={handleRate} disabled={rating} />
        </div>
      )}

      {!isFlipped && (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
          Nhấn <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-mono border border-gray-200 dark:border-gray-600">Space</kbd> hoặc click để lật thẻ
        </p>
      )}
    </div>
  )
}
