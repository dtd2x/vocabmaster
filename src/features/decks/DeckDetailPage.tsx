import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import { useCards } from '@/hooks/useCards'
import { CardList } from './components/CardList'
import { CardForm } from './components/CardForm'
import { ImportModal } from './components/ImportModal'
import { SmartAddModal } from './components/SmartAddModal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { exportToCSV, exportToJSON } from '@/lib/import-export'
import { downloadFile } from '@/lib/utils'
import type { Deck, Card } from '@/types/card'

export function DeckDetailPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const { cards, loading, createCard, updateCard, deleteCard, bulkCreateCards } = useCards(deckId)
  const [deck, setDeck] = useState<Deck | null>(null)
  const [showCardForm, setShowCardForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showSmartAdd, setShowSmartAdd] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | null>(null)

  useEffect(() => {
    if (!deckId) return
    supabase.from('decks').select('*').eq('id', deckId).single()
      .then(({ data }) => setDeck(data))
  }, [deckId])

  if (loading || !deck) return <PageSpinner />

  const handleExport = (format: 'csv' | 'json') => {
    const content = format === 'csv' ? exportToCSV(cards) : exportToJSON(cards)
    downloadFile(content, `${deck.name}.${format}`, format === 'json' ? 'application/json' : 'text/csv')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/decks')}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-3 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{deck.name}</h1>
            {deck.description && <p className="text-gray-500 mt-1">{deck.description}</p>}
            <div className="flex gap-2 mt-2">
              <Badge variant="primary">{cards.length} từ</Badge>
              {deck.category && <Badge>{deck.category}</Badge>}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => navigate(`/review/${deckId}`)}>
              Ôn tập
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSmartAdd(true)}>
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Thêm bằng AI
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
              Import
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleExport('csv')}>CSV</Button>
            <Button variant="ghost" size="sm" onClick={() => handleExport('json')}>JSON</Button>
            <Button size="sm" onClick={() => setShowCardForm(true)}>
              Thêm thẻ
            </Button>
          </div>
        </div>
      </div>

      {/* Card list */}
      {cards.length > 0 ? (
        <CardList
          cards={cards}
          onEdit={(card) => setEditingCard(card)}
          onDelete={deleteCard}
          language={deck.language}
        />
      ) : (
        <EmptyState
          title="Bộ từ chưa có thẻ nào"
          description="Thêm thẻ từ vựng thủ công, import từ file, hoặc dùng AI để tạo nhanh."
          actionLabel="Thêm bằng AI"
          onAction={() => setShowSmartAdd(true)}
        />
      )}

      {/* Add card form */}
      <CardForm
        isOpen={showCardForm}
        onClose={() => setShowCardForm(false)}
        onSubmit={createCard}
        deckId={deckId!}
        language={deck.language}
      />

      {/* Edit card form */}
      {editingCard && (
        <CardForm
          isOpen={!!editingCard}
          onClose={() => setEditingCard(null)}
          onSubmit={(input) => updateCard(editingCard.id, input)}
          deckId={deckId!}
          card={editingCard}
          language={deck.language}
        />
      )}

      {/* Import modal */}
      <ImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={bulkCreateCards}
        deckId={deckId!}
      />

      {/* Smart Add with AI */}
      <SmartAddModal
        isOpen={showSmartAdd}
        onClose={() => setShowSmartAdd(false)}
        onImport={bulkCreateCards}
        deckId={deckId!}
        language={deck.language}
      />
    </div>
  )
}
