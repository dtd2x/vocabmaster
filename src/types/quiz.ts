export type QuizMode = 'multiple-choice' | 'typing' | 'matching'

export interface QuizQuestion {
  card_id: string
  question: string
  correctAnswer: string
  options?: string[]
  deck_id: string
  audioUrl?: string | null
  language?: string
  hiragana?: string
  romaji?: string
}

export interface QuizResult {
  card_id: string
  correct: boolean
  userAnswer: string
  correctAnswer: string
  duration_ms: number
}

export interface QuizSessionResult {
  mode: QuizMode
  deck_id: string
  questions: QuizResult[]
  totalCorrect: number
  totalQuestions: number
  accuracy: number
  xpEarned: number
  duration: number
}

export interface MatchingPair {
  id: string
  front: string
  back: string
  matched: boolean
}
