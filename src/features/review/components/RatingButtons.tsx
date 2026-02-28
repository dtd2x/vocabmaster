import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Rating } from '@/types/review'
import { RATING_LABELS } from '@/config/constants'

interface RatingButtonsProps {
  onRate: (rating: Rating) => void
  disabled?: boolean
}

const ratingConfig: { rating: Rating; color: string; key: string }[] = [
  { rating: 1, color: 'bg-red-500 hover:bg-red-600', key: '1' },
  { rating: 2, color: 'bg-amber-500 hover:bg-amber-600', key: '2' },
  { rating: 3, color: 'bg-green-500 hover:bg-green-600', key: '3' },
  { rating: 4, color: 'bg-blue-500 hover:bg-blue-600', key: '4' },
]

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  // Keyboard shortcuts
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
      className="flex gap-3 justify-center flex-wrap"
    >
      {ratingConfig.map(({ rating, color, key }) => (
        <button
          key={rating}
          onClick={() => onRate(rating)}
          disabled={disabled}
          className={`${color} text-white px-6 py-3 rounded-xl font-medium transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm min-w-[80px]`}
        >
          <span className="block text-base">{RATING_LABELS[rating]}</span>
          <span className="block text-xs opacity-75 mt-0.5">({key})</span>
        </button>
      ))}
    </motion.div>
  )
}
