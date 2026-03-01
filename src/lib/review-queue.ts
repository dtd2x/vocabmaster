import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { ReviewCard } from '@/types/review'

/**
 * Fetch cards due for review (next_review <= now).
 */
async function fetchDueCards(
  supabase: SupabaseClient<Database>,
  userId: string,
  deckId?: string,
  limit = 100
): Promise<ReviewCard[]> {
  let query = supabase
    .from('card_progress')
    .select(`
      card_id,
      ease_factor,
      interval,
      repetitions,
      status,
      cards!inner (
        id,
        front,
        back,
        example_sentence,
        pronunciation,
        audio_url,
        extra_fields,
        deck_id,
        decks!inner ( name, language )
      )
    `)
    .eq('user_id', userId)
    .lte('next_review', new Date().toISOString())
    .neq('status', 'new')
    .order('next_review', { ascending: true })
    .limit(limit)

  if (deckId) {
    query = query.eq('cards.deck_id', deckId)
  }

  const { data, error } = await query

  if (error) throw error
  if (!data) return []

  return data.map((row) => {
    const card = row.cards as unknown as {
      id: string; front: string; back: string;
      example_sentence: string | null; pronunciation: string | null;
      audio_url: string | null; extra_fields: Record<string, unknown> | null;
      deck_id: string;
      decks: { name: string; language: string }
    }
    return {
      card_id: card.id,
      front: card.front,
      back: card.back,
      example_sentence: card.example_sentence,
      pronunciation: card.pronunciation,
      audio_url: card.audio_url,
      extra_fields: card.extra_fields,
      language: card.decks.language,
      ease_factor: row.ease_factor,
      interval: row.interval,
      repetitions: row.repetitions,
      status: row.status,
      deck_id: card.deck_id,
      deck_name: card.decks.name,
    }
  })
}

/**
 * Fetch new cards that haven't been studied yet.
 */
async function fetchNewCards(
  supabase: SupabaseClient<Database>,
  userId: string,
  deckId?: string,
  limit = 20
): Promise<ReviewCard[]> {
  let query = supabase
    .from('card_progress')
    .select(`
      card_id,
      ease_factor,
      interval,
      repetitions,
      status,
      cards!inner (
        id,
        front,
        back,
        example_sentence,
        pronunciation,
        audio_url,
        extra_fields,
        deck_id,
        decks!inner ( name, language )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'new')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (deckId) {
    query = query.eq('cards.deck_id', deckId)
  }

  const { data, error } = await query

  if (error) throw error
  if (!data) return []

  return data.map((row) => {
    const card = row.cards as unknown as {
      id: string; front: string; back: string;
      example_sentence: string | null; pronunciation: string | null;
      audio_url: string | null; extra_fields: Record<string, unknown> | null;
      deck_id: string;
      decks: { name: string; language: string }
    }
    return {
      card_id: card.id,
      front: card.front,
      back: card.back,
      example_sentence: card.example_sentence,
      pronunciation: card.pronunciation,
      audio_url: card.audio_url,
      extra_fields: card.extra_fields,
      language: card.decks.language,
      ease_factor: row.ease_factor,
      interval: row.interval,
      repetitions: row.repetitions,
      status: row.status,
      deck_id: card.deck_id,
      deck_name: card.decks.name,
    }
  })
}

/**
 * Interleave new cards among review cards for a balanced session.
 */
function interleaveCards(review: ReviewCard[], newCards: ReviewCard[]): ReviewCard[] {
  if (newCards.length === 0) return review
  if (review.length === 0) return newCards

  const ratio = Math.max(1, Math.ceil(review.length / newCards.length))
  const result: ReviewCard[] = []
  let newIdx = 0

  for (let i = 0; i < review.length; i++) {
    const card = review[i]
    if (card) result.push(card)
    if ((i + 1) % ratio === 0 && newIdx < newCards.length) {
      const newCard = newCards[newIdx++]
      if (newCard) result.push(newCard)
    }
  }

  while (newIdx < newCards.length) {
    const newCard = newCards[newIdx++]
    if (newCard) result.push(newCard)
  }

  return result
}

/**
 * Build the complete review queue for a study session.
 */
export async function buildReviewQueue(
  supabase: SupabaseClient<Database>,
  userId: string,
  deckId?: string,
  newCardLimit = 20,
  reviewLimit = 100
): Promise<ReviewCard[]> {
  const [reviewCards, newCards] = await Promise.all([
    fetchDueCards(supabase, userId, deckId, reviewLimit),
    fetchNewCards(supabase, userId, deckId, newCardLimit),
  ])

  return interleaveCards(reviewCards, newCards)
}

/**
 * Initialize card_progress for cards in a deck that a user hasn't started yet.
 */
export async function initializeCardsForUser(
  supabase: SupabaseClient<Database>,
  userId: string,
  deckId: string
): Promise<number> {
  // Get cards in the deck that don't have progress for this user
  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('id')
    .eq('deck_id', deckId)

  if (cardsError) throw cardsError
  if (!cards || cards.length === 0) return 0

  const { data: existing } = await supabase
    .from('card_progress')
    .select('card_id')
    .eq('user_id', userId)
    .in('card_id', cards.map(c => c.id))

  const existingIds = new Set(existing?.map(e => e.card_id) ?? [])
  const newCardIds = cards.filter(c => !existingIds.has(c.id))

  if (newCardIds.length === 0) return 0

  const { error } = await supabase
    .from('card_progress')
    .insert(
      newCardIds.map(card => ({
        user_id: userId,
        card_id: card.id,
        status: 'new' as const,
      }))
    )

  if (error) throw error
  return newCardIds.length
}
