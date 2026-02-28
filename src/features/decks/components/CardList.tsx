import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AudioButton } from '@/components/ui/AudioButton'
import type { Card } from '@/types/card'

interface CardListProps {
  cards: Card[]
  onEdit: (card: Card) => void
  onDelete: (id: string) => Promise<void>
}

export function CardList({ cards, onEdit, onDelete }: CardListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const handleDelete = async () => {
    if (!deletingId) return
    setLoadingDelete(true)
    try {
      await onDelete(deletingId)
    } finally {
      setLoadingDelete(false)
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="space-y-2">
        <AnimatePresence>
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{card.front}</span>
                  {card.pronunciation && (
                    <span className="text-xs text-gray-400">{card.pronunciation}</span>
                  )}
                  <AudioButton word={card.front} audioUrl={card.audio_url} size="sm" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{card.back}</p>
                {card.example_sentence && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate italic">
                    {card.example_sentence}
                  </p>
                )}
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="ghost" onClick={() => onEdit(card)}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeletingId(card.id)}>
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Xóa thẻ?"
        message="Thẻ từ vựng này sẽ bị xóa vĩnh viễn. Bạn có chắc không?"
        confirmText="Xóa"
        variant="danger"
        loading={loadingDelete}
      />
    </>
  )
}
