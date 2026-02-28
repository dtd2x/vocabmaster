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

  const cardFace =
    'absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/60 dark:border-gray-700/50 flex flex-col overflow-hidden'

  return (
    <div
      className="flip-card w-full cursor-pointer select-none"
      onClick={onFlip}
      style={{ perspective: 1600 }}
    >
      {/* Aspect ratio wrapper: 56.25% = 16:9, 50% = 2:1 */}
      <motion.div
        className="relative w-full"
        style={{ paddingBottom: '50%', transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* ===== FRONT ===== */}
        <div className={cardFace} style={{ backfaceVisibility: 'hidden' }}>
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-primary-400 via-indigo-500 to-violet-500 shrink-0" />

          {/* Audio - top right */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-10">
            <AudioButton word={card.front} audioUrl={card.audio_url} size="md" />
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-16">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 text-center leading-tight">
              {card.front}
            </h2>
            {card.pronunciation && (
              <span className="text-gray-400 dark:text-gray-500 text-sm sm:text-lg font-light tracking-wide mt-3">
                {card.pronunciation}
              </span>
            )}
          </div>

          {/* Bottom bar */}
          <div className="shrink-0 py-2.5 sm:py-3 bg-gradient-to-r from-primary-500 via-indigo-500 to-violet-500 text-center">
            <span className="text-white/90 text-xs sm:text-sm font-medium">Nhấn vào thẻ để lật 👆</span>
          </div>
        </div>

        {/* ===== BACK ===== */}
        <div className={cardFace} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 shrink-0" />

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-16">
            <span className="inline-flex px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-[11px] font-semibold text-primary-600 dark:text-primary-400 mb-4 tracking-widest uppercase">
              Nghĩa
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 text-center leading-tight">
              {card.back}
            </h2>

            {card.example_sentence && (
              <div className="mt-5 w-full max-w-2xl">
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl px-5 py-3 sm:px-6 sm:py-4">
                  <p className="text-gray-500 dark:text-gray-300 italic text-center text-sm sm:text-base leading-relaxed">
                    &ldquo;{card.example_sentence}&rdquo;
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
