import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Rating } from '@/types/review'
import { RATING_LABELS } from '@/config/constants'

interface RatingButtonsProps {
  onRate: (rating: Rating) => void
  disabled?: boolean
}

const ratingConfig: { rating: Rating; bg: string; border: string; text: string; key: string }[] = [
  { rating: 1, bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800 hover:border-red-400', text: 'text-red-600 dark:text-red-400', key: '1' },
  { rating: 2, bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800 hover:border-amber-400', text: 'text-amber-600 dark:text-amber-400', key: '2' },
  { rating: 3, bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400', text: 'text-emerald-600 dark:text-emerald-400', key: '3' },
  { rating: 4, bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800 hover:border-blue-400', text: 'text-blue-600 dark:text-blue-400', key: '4' },
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
      className="grid grid-cols-4 gap-3"
    >
      {ratingConfig.map(({ rating, bg, border, text, key }) => (
        <button
          key={rating}
          onClick={() => onRate(rating)}
          disabled={disabled}
          className={`${bg} ${border} ${text} border-2 px-3 py-4 rounded-2xl font-semibold transition-all duration-150 hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:pointer-events-none`}
        >
          <span className="block text-sm">{RATING_LABELS[rating]}</span>
          <kbd className="block text-[10px] font-normal opacity-50 mt-1">{key}</kbd>
        </button>
      ))}
    </motion.div>
  )
}
