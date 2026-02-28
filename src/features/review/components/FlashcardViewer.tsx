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

  const cardFace = "absolute inset-0 bg-white dark:bg-gray-800/90 rounded-2xl sm:rounded-3xl shadow-lg shadow-gray-200/40 dark:shadow-black/30 border border-gray-200/60 dark:border-gray-700/50 flex flex-col overflow-hidden"

  return (
    <div
      className="flip-card w-full mx-auto cursor-pointer select-none"
      onClick={onFlip}
      style={{ perspective: 1600 }}
    >
      <motion.div
        className="relative w-full aspect-[16/9] sm:aspect-[2/1] max-h-[420px]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className={cardFace} style={{ backfaceVisibility: 'hidden' }}>
          {/* Top gradient accent */}
          <div className="h-1 bg-gradient-to-r from-primary-400 via-indigo-500 to-violet-500 shrink-0" />

          {/* Audio button - top right */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-10 flex items-center gap-2">
            <AudioButton word={card.front} audioUrl={card.audio_url} size="md" />
          </div>

          {/* Content area - centered */}
          <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-20">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 text-center leading-tight tracking-tight">
              {card.front}
            </h2>

            {card.pronunciation && (
              <span className="text-gray-400 dark:text-gray-500 text-sm sm:text-lg font-light tracking-wide mt-3 sm:mt-4">
                {card.pronunciation}
              </span>
            )}
          </div>

          {/* Bottom hint bar */}
          <div className="shrink-0 py-3 bg-gradient-to-r from-primary-500 via-indigo-500 to-violet-500 flex items-center justify-center gap-2 text-white/90">
            <span className="text-xs sm:text-sm font-medium">Nhấn vào thẻ để lật 👆</span>
          </div>
        </div>

        {/* Back */}
        <div className={cardFace} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          {/* Top gradient accent */}
          <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 shrink-0" />

          {/* Content area */}
          <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-20">
            <span className="inline-flex px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-[10px] sm:text-[11px] font-semibold text-primary-600 dark:text-primary-400 mb-4 sm:mb-5 tracking-widest uppercase">
              Nghĩa
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 text-center leading-tight">
              {card.back}
            </h2>

            {card.example_sentence && (
              <div className="mt-5 sm:mt-6 w-full max-w-2xl">
                <div className="relative bg-gray-50 dark:bg-gray-700/30 rounded-xl px-5 py-3.5 sm:px-6 sm:py-4">
                  <p className="text-gray-600 dark:text-gray-300 italic text-center text-sm sm:text-base leading-relaxed">
                    "{card.example_sentence}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
