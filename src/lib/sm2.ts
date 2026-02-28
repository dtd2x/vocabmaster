import type { Rating, CardState, SM2Result } from '@/types/review'
import { MIN_EASE_FACTOR } from '@/config/constants'

/**
 * Maps our 1-4 rating scale to SM-2's 0-5 quality scale.
 * Again(1) -> 1, Hard(2) -> 3, Good(3) -> 4, Easy(4) -> 5
 */
function ratingToQuality(rating: Rating): number {
  const map: Record<Rating, number> = { 1: 1, 2: 3, 3: 4, 4: 5 }
  return map[rating]
}

/**
 * SM-2 Spaced Repetition Algorithm.
 * Pure function: takes current card state and rating, returns new state.
 */
export function sm2(card: CardState, rating: Rating): SM2Result {
  const quality = ratingToQuality(rating)
  let { easeFactor, interval, repetitions } = card

  // Calculate new ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEaseFactor = Math.max(
    MIN_EASE_FACTOR,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  if (quality < 3) {
    // Failed: reset repetitions, review again tomorrow
    repetitions = 0
    interval = 1
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.ceil(interval * newEaseFactor)
    }
    repetitions += 1
  }

  // Apply modifiers for Hard and Easy (Anki-style)
  if (rating === 2) {
    interval = Math.max(interval, Math.ceil(card.interval * 1.2))
  } else if (rating === 4) {
    interval = Math.ceil(interval * 1.3)
  }

  // Add small random fuzz (+/- 5%) to avoid review clumping
  const fuzz = 1 + (Math.random() * 0.1 - 0.05)
  interval = Math.max(1, Math.round(interval * fuzz))

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return {
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    interval,
    repetitions,
    nextReview,
  }
}

/**
 * Determine the status of a card based on its progress.
 */
export function getCardStatus(repetitions: number, interval: number): 'new' | 'learning' | 'review' | 'graduated' {
  if (repetitions === 0) return 'new'
  if (interval < 21) return 'learning'
  if (interval < 90) return 'review'
  return 'graduated'
}
