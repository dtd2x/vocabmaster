import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePresetDecks } from '@/hooks/useDecks'
import { useAuthStore } from '@/stores/authStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

export function PresetDecksPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { decks, loading, clonePresetDeck } = usePresetDecks()
  const [cloningId, setCloningId] = useState<string | null>(null)

  const handleClone = async (deckId: string) => {
    if (!user) return
    setCloningId(deckId)
    try {
      const newDeck = await clonePresetDeck(deckId, user.id)
      toast.success('Đã thêm vào thư viện!')
      navigate(`/decks/${newDeck.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setCloningId(null)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/decks')}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-3 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lai
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bộ từ có sẵn</h1>
        <p className="text-gray-500 mt-1">Chọn bộ từ phổ biến để bắt đầu học ngay</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck, i) => (
          <motion.div
            key={deck.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card padding="lg">
              <div className="h-24 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 -mx-2 -mt-2 mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-white/80">{deck.name.charAt(0)}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{deck.name}</h3>
              {deck.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{deck.description}</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="primary">{deck.card_count} từ</Badge>
                {deck.category && <Badge>{deck.category}</Badge>}
              </div>
              <Button
                className="w-full mt-4"
                variant="outline"
                onClick={() => handleClone(deck.id)}
                loading={cloningId === deck.id}
              >
                Thêm vào thư viện
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {decks.length === 0 && (
        <p className="text-center text-gray-400 py-12">Chưa có bộ từ sẵn nào.</p>
      )}
    </div>
  )
}
