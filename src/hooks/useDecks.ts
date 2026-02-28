import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/config/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Deck, CreateDeckInput } from '@/types/card'

export function useDecks() {
  const { user } = useAuthStore()
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDecks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_preset', false)
      .order('updated_at', { ascending: false })

    if (!error && data) setDecks(data)
    setLoading(false)
  }, [user])

  const createDeck = async (input: CreateDeckInput) => {
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase
      .from('decks')
      .insert({ ...input, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    setDecks(prev => [data, ...prev])
    return data
  }

  const updateDeck = async (id: string, input: Partial<CreateDeckInput>) => {
    const { data, error } = await supabase
      .from('decks')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setDecks(prev => prev.map(d => d.id === id ? data : d))
    return data
  }

  const deleteDeck = async (id: string) => {
    const { error } = await supabase.from('decks').delete().eq('id', id)
    if (error) throw error
    setDecks(prev => prev.filter(d => d.id !== id))
  }

  useEffect(() => { fetchDecks() }, [fetchDecks])

  return { decks, loading, createDeck, updateDeck, deleteDeck, refetch: fetchDecks }
}

export function usePresetDecks() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('decks')
        .select('*')
        .eq('is_preset', true)
        .order('name')

      setDecks(data ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const clonePresetDeck = async (presetDeckId: string, userId: string) => {
    // Get the preset deck
    const { data: preset } = await supabase
      .from('decks')
      .select('*')
      .eq('id', presetDeckId)
      .single()

    if (!preset) throw new Error('Preset deck not found')

    // Create user's copy
    const { data: newDeck, error: deckError } = await supabase
      .from('decks')
      .insert({
        user_id: userId,
        name: preset.name,
        description: preset.description,
        category: preset.category,
        cover_image_url: preset.cover_image_url,
      })
      .select()
      .single()

    if (deckError) throw deckError

    // Copy all cards
    const { data: cards } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', presetDeckId)

    if (cards && cards.length > 0) {
      const newCards = cards.map(c => ({
        deck_id: newDeck.id,
        front: c.front,
        back: c.back,
        example_sentence: c.example_sentence,
        pronunciation: c.pronunciation,
        audio_url: c.audio_url,
        image_url: c.image_url,
        tags: c.tags,
        position: c.position,
      }))

      await supabase.from('cards').insert(newCards)

      // Update card count
      await supabase
        .from('decks')
        .update({ card_count: cards.length })
        .eq('id', newDeck.id)
    }

    return newDeck
  }

  return { decks, loading, clonePresetDeck }
}
