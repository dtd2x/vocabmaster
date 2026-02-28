import { create } from 'zustand'
import type { ReviewCard, ReviewResult, Rating, SessionSummary } from '@/types/review'
import { sm2, getCardStatus } from '@/lib/sm2'
import { calculateXP } from '@/lib/xp'
import { supabase } from '@/config/supabase'

interface ReviewState {
  queue: ReviewCard[]
  currentIndex: number
  isFlipped: boolean
  results: ReviewResult[]
  startTime: number | null
  cardStartTime: number | null
  loading: boolean

  setQueue: (cards: ReviewCard[]) => void
  flipCard: () => void
  rateCard: (userId: string, rating: Rating, streak: number) => Promise<{ xpEarned: number }>
  getCurrentCard: () => ReviewCard | null
  isSessionComplete: () => boolean
  getSessionSummary: (streak: number) => SessionSummary
  resetSession: () => void
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  queue: [],
  currentIndex: 0,
  isFlipped: false,
  results: [],
  startTime: null,
  cardStartTime: null,
  loading: false,

  setQueue: (cards) => set({
    queue: cards,
    currentIndex: 0,
    isFlipped: false,
    results: [],
    startTime: Date.now(),
    cardStartTime: Date.now(),
  }),

  flipCard: () => set({ isFlipped: true }),

  rateCard: async (userId, rating, streak) => {
    const state = get()
    const card = state.queue[state.currentIndex]
    if (!card) throw new Error('No current card')

    const cardState = {
      easeFactor: card.ease_factor,
      interval: card.interval,
      repetitions: card.repetitions,
    }

    const result = sm2(cardState, rating)
    const newStatus = getCardStatus(result.repetitions, result.interval)
    const duration = Date.now() - (state.cardStartTime ?? Date.now())
    const xpEarned = calculateXP(rating, streak)

    // Update card_progress in Supabase
    await supabase
      .from('card_progress')
      .update({
        ease_factor: result.easeFactor,
        interval: result.interval,
        repetitions: result.repetitions,
        next_review: result.nextReview.toISOString(),
        last_reviewed: new Date().toISOString(),
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('card_id', card.card_id)

    // Insert review log
    await supabase.from('review_logs').insert({
      user_id: userId,
      card_id: card.card_id,
      deck_id: card.deck_id,
      rating,
      ease_factor_before: card.ease_factor,
      ease_factor_after: result.easeFactor,
      interval_before: card.interval,
      interval_after: result.interval,
      review_duration_ms: duration,
      quiz_mode: 'flashcard',
    })

    const reviewResult: ReviewResult = {
      card_id: card.card_id,
      rating,
      duration_ms: duration,
      ease_factor_before: card.ease_factor,
      ease_factor_after: result.easeFactor,
      interval_before: card.interval,
      interval_after: result.interval,
    }

    set({
      results: [...state.results, reviewResult],
      currentIndex: state.currentIndex + 1,
      isFlipped: false,
      cardStartTime: Date.now(),
    })

    return { xpEarned }
  },

  getCurrentCard: () => {
    const { queue, currentIndex } = get()
    return queue[currentIndex] ?? null
  },

  isSessionComplete: () => {
    const { queue, currentIndex } = get()
    return currentIndex >= queue.length
  },

  getSessionSummary: (streak) => {
    const { results, startTime } = get()
    const correctCount = results.filter(r => r.rating >= 3).length
    const totalDuration = Date.now() - (startTime ?? Date.now())

    return {
      totalCards: results.length,
      correctCount,
      incorrectCount: results.length - correctCount,
      accuracy: results.length > 0 ? (correctCount / results.length) * 100 : 0,
      xpEarned: results.reduce((sum, r) => sum + calculateXP(r.rating as Rating, streak), 0),
      totalDuration,
      averageTime: results.length > 0 ? totalDuration / results.length : 0,
    }
  },

  resetSession: () => set({
    queue: [],
    currentIndex: 0,
    isFlipped: false,
    results: [],
    startTime: null,
    cardStartTime: null,
  }),
}))
