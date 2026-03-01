import type { Rating } from '@/types/review'

// SM-2 defaults
export const DEFAULT_EASE_FACTOR = 2.5
export const MIN_EASE_FACTOR = 1.3

// XP rewards per rating
export const BASE_XP: Record<Rating, number> = {
  1: 2,   // Again
  2: 5,   // Hard
  3: 10,  // Good
  4: 15,  // Easy
}

// Streak multiplier cap
export const MAX_STREAK_MULTIPLIER = 2.0
export const STREAK_MULTIPLIER_STEP = 0.1

// Level system
export const XP_PER_LEVEL_UNIT = 100

// Default study settings
export const DEFAULT_NEW_CARDS_PER_DAY = 20
export const DEFAULT_REVIEW_LIMIT = 100
export const DEFAULT_DAILY_GOAL = 30

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_REVIEW: 'first_review',
  STREAK_3: 'streak_3',
  STREAK_7: 'streak_7',
  STREAK_30: 'streak_30',
  CARDS_50: 'cards_50',
  CARDS_100: 'cards_100',
  CARDS_500: 'cards_500',
  CARDS_1000: 'cards_1000',
  LEVEL_5: 'level_5',
  LEVEL_10: 'level_10',
  PERFECT_SESSION: 'perfect_session',
  SPEED_DEMON: 'speed_demon',
} as const

// Rating labels
export const RATING_LABELS: Record<Rating, string> = {
  1: 'Quên',
  2: 'Khó',
  3: 'Tốt',
  4: 'Dễ',
}

export const RATING_COLORS: Record<Rating, string> = {
  1: 'bg-danger-500',
  2: 'bg-warning-500',
  3: 'bg-success-500',
  4: 'bg-primary-500',
}

// Language support
export const LANGUAGES = [
  { value: 'en' as const, label: 'Tiếng Anh', flag: '🇬🇧' },
  { value: 'ja' as const, label: 'Tiếng Nhật', flag: '🇯🇵' },
]

// Deck categories per language
export const DECK_CATEGORIES_EN = [
  { value: 'ielts', label: 'IELTS' },
  { value: 'toeic', label: 'TOEIC' },
  { value: 'toefl', label: 'TOEFL' },
  { value: 'common', label: 'Giao tiếp thường ngày' },
  { value: 'business', label: 'Tiếng Anh thương mại' },
  { value: 'academic', label: 'Học thuật' },
  { value: 'custom', label: 'Tùy chỉnh' },
] as const

export const DECK_CATEGORIES_JA = [
  { value: 'jlpt_n5', label: 'JLPT N5' },
  { value: 'jlpt_n4', label: 'JLPT N4' },
  { value: 'jlpt_n3', label: 'JLPT N3' },
  { value: 'jlpt_n2', label: 'JLPT N2' },
  { value: 'jlpt_n1', label: 'JLPT N1' },
  { value: 'common_ja', label: 'Giao tiếp hàng ngày' },
  { value: 'business_ja', label: 'Tiếng Nhật thương mại' },
  { value: 'custom', label: 'Tùy chỉnh' },
] as const

// Keep backward-compatible DECK_CATEGORIES (English)
export const DECK_CATEGORIES = DECK_CATEGORIES_EN

export function getDeckCategories(language: string) {
  return language === 'ja' ? DECK_CATEGORIES_JA : DECK_CATEGORIES_EN
}
