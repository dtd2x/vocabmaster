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
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative w-full min-h-[300px]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">{card.deck_name}</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">{card.front}</h2>
          <div className="flex items-center gap-2 mt-2">
            {card.pronunciation && (
              <p className="text-gray-400 text-lg">{card.pronunciation}</p>
            )}
            <AudioButton word={card.front} audioUrl={card.audio_url} size="md" />
          </div>
          <p className="text-sm text-gray-400 mt-8">Nhấn để lật thẻ</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Nghia</p>
          <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 text-center">{card.back}</h2>
          {card.example_sentence && (
            <div className="mt-6 w-full">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Vi du</p>
              <p className="text-gray-600 dark:text-gray-300 italic text-center">{card.example_sentence}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
