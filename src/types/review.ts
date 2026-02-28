export type Rating = 1 | 2 | 3 | 4

export interface CardState {
  easeFactor: number
  interval: number
  repetitions: number
}

export interface SM2Result extends CardState {
  nextReview: Date
}

export interface ReviewCard {
  card_id: string
  front: string
  back: string
  example_sentence: string | null
  pronunciation: string | null
  audio_url: string | null
  ease_factor: number
  interval: number
  repetitions: number
  status: string
  deck_id: string
  deck_name: string
}

export interface ReviewSession {
  cards: ReviewCard[]
  currentIndex: number
  isFlipped: boolean
  startTime: number
  cardStartTime: number
  results: ReviewResult[]
}

export interface ReviewResult {
  card_id: string
  rating: Rating
  duration_ms: number
  ease_factor_before: number
  ease_factor_after: number
  interval_before: number
  interval_after: number
}

export interface SessionSummary {
  totalCards: number
  correctCount: number
  incorrectCount: number
  accuracy: number
  xpEarned: number
  totalDuration: number
  averageTime: number
}
