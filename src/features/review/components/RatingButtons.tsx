import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Rating } from '@/types/review'
import { RATING_LABELS } from '@/config/constants'

interface RatingButtonsProps {
  onRate: (rating: Rating) => void
  disabled?: boolean
}

const ratingConfig: { rating: Rating; bg: string; hoverBg: string; text: string; icon: string; key: string }[] = [
  { rating: 1, bg: 'bg-red-500/10', hoverBg: 'hover:bg-red-500/20', text: 'text-red-500', icon: '😓', key: '1' },
  { rating: 2, bg: 'bg-amber-500/10', hoverBg: 'hover:bg-amber-500/20', text: 'text-amber-500', icon: '🤔', key: '2' },
  { rating: 3, bg: 'bg-emerald-500/10', hoverBg: 'hover:bg-emerald-500/20', text: 'text-emerald-500', icon: '😊', key: '3' },
  { rating: 4, bg: 'bg-blue-500/10', hoverBg: 'hover:bg-blue-500/20', text: 'text-blue-500', icon: '🤩', key: '4' },
]

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (disabled) return
      const rating = parseInt(e.key) as Rating
      if (rating >= 1 && rating <= 4) {
        onRate(rating)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onRate, disabled])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-4 gap-3 sm:gap-4"
    >
      {ratingConfig.map(({ rating, bg, hoverBg, text, icon, key }) => (
        <button
          key={rating}
          onClick={() => onRate(rating)}
          disabled={disabled}
          className={`${bg} ${hoverBg} ${text} px-3 py-4 sm:py-5 rounded-2xl font-semibold transition-all duration-150 hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:pointer-events-none border border-gray-200/50 dark:border-gray-700/50`}
        >
          <span className="block text-xl sm:text-2xl mb-1">{icon}</span>
          <span className="block text-sm sm:text-base font-semibold">{RATING_LABELS[rating]}</span>
          <kbd className="block text-[10px] font-normal opacity-50 mt-1">{key}</kbd>
        </button>
      ))}
    </motion.div>
  )
}
