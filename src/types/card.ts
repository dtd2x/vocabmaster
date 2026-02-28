export interface Card {
  id: string
  deck_id: string
  front: string
  back: string
  example_sentence: string | null
  pronunciation: string | null
  audio_url: string | null
  image_url: string | null
  tags: string[] | null
  position: number
  created_at: string
  updated_at: string
}

export interface Deck {
  id: string
  user_id: string | null
  name: string
  description: string | null
  cover_image_url: string | null
  is_preset: boolean
  is_public: boolean
  category: string | null
  card_count: number
  created_at: string
  updated_at: string
}

export interface CardProgress {
  id: string
  user_id: string
  card_id: string
  ease_factor: number
  interval: number
  repetitions: number
  next_review: string
  last_reviewed: string | null
  status: 'new' | 'learning' | 'review' | 'graduated'
  created_at: string
  updated_at: string
}

export interface CardWithProgress extends Card {
  progress: CardProgress | null
}

export interface DeckWithStats extends Deck {
  new_count: number
  learning_count: number
  review_count: number
  graduated_count: number
}

export interface CreateCardInput {
  deck_id: string
  front: string
  back: string
  example_sentence?: string
  pronunciation?: string
  audio_url?: string | null
  tags?: string[]
}

export interface CreateDeckInput {
  name: string
  description?: string
  category?: string
}
