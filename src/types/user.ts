export interface UserProfile {
  id: string
  display_name: string | null
  avatar_url: string | null
  native_language: string
  daily_new_cards_limit: number
  daily_review_limit: number
  timezone: string
  created_at: string
  updated_at: string
}

export interface UserStats {
  user_id: string
  xp: number
  level: number
  current_streak: number
  longest_streak: number
  last_review_date: string | null
  total_reviews: number
  total_cards_learned: number
  badges: string[]
  daily_goal: number
  updated_at: string
}
