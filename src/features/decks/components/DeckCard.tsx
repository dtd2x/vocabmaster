import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Deck } from '@/types/card'

interface DeckCardProps {
  deck: Deck
  index: number
}

export function DeckCard({ deck, index }: DeckCardProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card hover onClick={() => navigate(`/decks/${deck.id}`)}>
        {/* Cover */}
        <div className="h-28 rounded-t-xl bg-primary-50 dark:bg-primary-900/20 -mx-4 -mt-4 mb-4 flex items-center justify-center border-b border-border-light dark:border-border-dark">
          <span className="text-4xl font-bold text-primary-300 dark:text-primary-700">{deck.name.charAt(0).toUpperCase()}</span>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{deck.name}</h3>
        {deck.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{deck.description}</p>
        )}

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="primary">{deck.card_count} từ</Badge>
          {deck.category && <Badge>{deck.category}</Badge>}
        </div>
      </Card>
    </motion.div>
  )
}
