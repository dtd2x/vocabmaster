import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import type { Deck } from '@/types/card'

interface DeckCardProps {
  deck: Deck
  index: number
}

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

export function DeckCard({ deck, index }: DeckCardProps) {
  const navigate = useNavigate()
  const gradient = getGradient(deck.name)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/decks/${deck.id}`)}
      className="group cursor-pointer"
    >
      <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1">
        {/* Gradient cover */}
        <div className={`h-32 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -left-2 -top-2 w-16 h-16 rounded-full bg-white/10" />
          <div className="absolute bottom-3 left-4">
            <span className="text-5xl font-black text-white/30 leading-none">
              {deck.name.charAt(0).toUpperCase()}
            </span>
          </div>
          {deck.card_count > 0 && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-xs font-semibold text-white">{deck.card_count} thẻ</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-500 transition-colors">
            {deck.name}
          </h3>
          {deck.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
              {deck.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3">
            {deck.category && <Badge>{deck.category}</Badge>}
            {deck.card_count === 0 && (
              <span className="text-xs text-gray-400 italic">Chưa có thẻ nào</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
