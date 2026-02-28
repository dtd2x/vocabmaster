import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ReviewCard } from '@/types/review'
import { AudioButton } from '@/components/ui/AudioButton'
import { useAudio } from '@/hooks/useAudio'
import { useSettingsStore } from '@/stores/settingsStore'

interface FlashcardViewerProps {
  card: ReviewCard
  isFlipped: boolean
  onFlip: () => void
}

export function FlashcardViewer({ card, isFlipped, onFlip }: FlashcardViewerProps) {
  const { autoPlayAudio } = useSettingsStore()
  const { play } = useAudio({ word: card.front, audioUrl: card.audio_url })

  useEffect(() => {
    if (isFlipped && autoPlayAudio) {
      play()
    }
  }, [isFlipped]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="flip-card w-full max-w-lg mx-auto cursor-pointer select-none"
      onClick={onFlip}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative w-full min-h-[340px]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-white dark:bg-gray-800/80 rounded-3xl shadow-xl shadow-gray-200/40 dark:shadow-black/20 border border-gray-100 dark:border-gray-700/50 p-8 flex flex-col items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Decorative gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-500 rounded-t-3xl" />

          <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-xs font-medium text-gray-500 dark:text-gray-400 mb-6">
            {card.deck_name}
          </span>

          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 text-center leading-tight">
            {card.front}
          </h2>

          <div className="flex items-center gap-2 mt-3">
            {card.pronunciation && (
              <span className="text-gray-400 dark:text-gray-500 text-lg font-light">{card.pronunciation}</span>
            )}
            <AudioButton word={card.front} audioUrl={card.audio_url} size="md" />
          </div>

          <div className="mt-auto pt-6 flex items-center gap-2 text-gray-400 dark:text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span className="text-sm">Nhấn để lật thẻ</span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-white dark:bg-gray-800/80 rounded-3xl shadow-xl shadow-gray-200/40 dark:shadow-black/20 border border-gray-100 dark:border-gray-700/50 p-8 flex flex-col items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Decorative gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-t-3xl" />

          <span className="inline-flex px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-xs font-medium text-primary-600 dark:text-primary-400 mb-4">
            Nghĩa
          </span>

          <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-400 text-center leading-tight">
            {card.back}
          </h2>

          {card.example_sentence && (
            <div className="mt-6 w-full px-4">
              <div className="relative bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4">
                <svg className="absolute top-3 left-3 w-5 h-5 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-300 italic text-center text-sm leading-relaxed pl-4">
                  {card.example_sentence}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
