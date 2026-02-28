import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/config/supabase'
import type { Card, CreateCardInput } from '@/types/card'

export function useCards(deckId: string | undefined) {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCards = useCallback(async () => {
    if (!deckId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .order('position')

    if (!error && data) setCards(data)
    setLoading(false)
  }, [deckId])

  const createCard = async (input: CreateCardInput) => {
    const { data, error } = await supabase
      .from('cards')
      .insert({ ...input, position: cards.length })
      .select()
      .single()

    if (error) throw error
    setCards(prev => [...prev, data])

    // Update deck card count
    await supabase
      .from('decks')
      .update({ card_count: cards.length + 1, updated_at: new Date().toISOString() })
      .eq('id', input.deck_id)

    return data
  }

  const updateCard = async (id: string, input: Partial<CreateCardInput>) => {
    const { data, error } = await supabase
      .from('cards')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setCards(prev => prev.map(c => c.id === id ? data : c))
    return data
  }

  const deleteCard = async (id: string) => {
    const card = cards.find(c => c.id === id)
    const { error } = await supabase.from('cards').delete().eq('id', id)
    if (error) throw error
    setCards(prev => prev.filter(c => c.id !== id))

    if (card) {
      await supabase
        .from('decks')
        .update({ card_count: Math.max(0, cards.length - 1), updated_at: new Date().toISOString() })
        .eq('id', card.deck_id)
    }
  }

  const bulkCreateCards = async (inputs: CreateCardInput[]) => {
    if (inputs.length === 0) return []
    const cardsToInsert = inputs.map((input, i) => ({
      ...input,
      position: cards.length + i,
    }))

    const { data, error } = await supabase
      .from('cards')
      .insert(cardsToInsert)
      .select()

    if (error) throw error
    if (data) setCards(prev => [...prev, ...data])

    // Update deck card count
    if (inputs[0]) {
      await supabase
        .from('decks')
        .update({ card_count: cards.length + inputs.length, updated_at: new Date().toISOString() })
        .eq('id', inputs[0].deck_id)
    }

    return data ?? []
  }

  useEffect(() => { fetchCards() }, [fetchCards])

  return { cards, loading, createCard, updateCard, deleteCard, bulkCreateCards, refetch: fetchCards }
}
