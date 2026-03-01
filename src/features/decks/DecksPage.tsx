import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDecks } from '@/hooks/useDecks'
import { DeckCard } from './components/DeckCard'
import { DeckForm } from './components/DeckForm'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { ROUTES } from '@/config/routes'

export function DecksPage() {
  const navigate = useNavigate()
  const { decks, loading, createDeck } = useDecks()
  const [showForm, setShowForm] = useState(false)

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bộ từ vựng</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {decks.length > 0 ? `${decks.length} bộ từ` : 'Bắt đầu hành trình học từ vựng'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(ROUTES.PRESET_DECKS)}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Bộ từ có sẵn
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo mới
          </Button>
        </div>
      </div>

      {/* Grid */}
      {decks.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
          {decks.map((deck, i) => (
            <DeckCard key={deck.id} deck={deck} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Chưa có bộ từ nào</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center mb-8">
            Tạo bộ từ vựng đầu tiên hoặc khám phá bộ từ có sẵn để bắt đầu học ngay.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(ROUTES.PRESET_DECKS)}>
              Khám phá bộ từ có sẵn
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo bộ từ mới
            </Button>
          </div>
        </div>
      )}

      <DeckForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={createDeck}
      />
    </div>
  )
}
