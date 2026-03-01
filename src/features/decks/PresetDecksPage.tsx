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

const gradients = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-orange-400 to-rose-500',
  'from-violet-500 to-purple-600',
  'from-cyan-400 to-blue-500',
  'from-pink-500 to-rose-600',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-emerald-600',
]

function getGradient(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return gradients[Math.abs(hash) % gradients.length]
}

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
    <div>
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

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {decks.map((deck, i) => (
          <motion.div
            key={deck.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card padding="lg">
              <div className={`h-24 rounded-xl bg-gradient-to-br ${getGradient(deck.name)} -mx-2 -mt-2 mb-4 relative overflow-hidden`}>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10" />
                <div className="absolute -left-2 -top-2 w-14 h-14 rounded-full bg-white/10" />
                <div className="absolute bottom-2 left-3">
                  <span className="text-4xl font-black text-white/30 leading-none">{deck.name.charAt(0).toUpperCase()}</span>
                </div>
                {deck.language === 'ja' && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <span className="text-xs font-semibold text-white">🇯🇵</span>
                  </div>
                )}
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
