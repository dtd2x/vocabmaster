import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { DeckWithStats } from '@/types/card'

interface DeckProgressListProps {
  decks: DeckWithStats[]
}

export function DeckProgressList({ decks }: DeckProgressListProps) {
  const navigate = useNavigate()

  if (decks.length === 0) {
    return (
      <Card padding="lg">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Tiến độ bộ từ</h3>
        <p className="text-gray-400 text-sm text-center py-4">Chưa có bộ từ vựng nào</p>
      </Card>
    )
  }

  return (
    <Card padding="lg">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Tiến độ bộ từ</h3>
      <div className="space-y-4">
        {decks.map(deck => {
          const total = deck.card_count
          const learned = deck.graduated_count + deck.review_count
          const progress = total > 0 ? (learned / total) * 100 : 0

          return (
            <div
              key={deck.id}
              className="cursor-pointer hover:bg-primary-50/50 dark:hover:bg-primary-900/20 rounded-xl p-2.5 -m-2 transition-all duration-200"
              onClick={() => navigate(`/decks/${deck.id}`)}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{deck.name}</span>
                <span className="text-xs text-gray-500 ml-2 shrink-0">{learned}/{total}</span>
              </div>
              <ProgressBar value={progress} size="sm" />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
