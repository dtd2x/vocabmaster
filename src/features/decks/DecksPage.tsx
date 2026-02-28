import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDecks } from '@/hooks/useDecks'
import { DeckCard } from './components/DeckCard'
import { DeckForm } from './components/DeckForm'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/shared/EmptyState'
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bộ từ vựng</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{decks.length} bộ từ</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(ROUTES.PRESET_DECKS)}>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {decks.map((deck, i) => (
            <DeckCard key={deck.id} deck={deck} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Chưa có bộ từ nào"
          description="Tạo bộ từ vựng đầu tiên hoặc thêm từ bộ từ có sẵn."
          actionLabel="Tạo bộ từ"
          onAction={() => setShowForm(true)}
        />
      )}

      <DeckForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={createDeck}
      />
    </div>
  )
}
