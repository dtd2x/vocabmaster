import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ReviewCard } from '@/types/review'
import { AudioButton } from '@/components/ui/AudioButton'
import { FuriganaText } from '@/components/shared/FuriganaText'
import { useAudio } from '@/hooks/useAudio'
import { useSettingsStore } from '@/stores/settingsStore'
import type { AudioLang } from '@/lib/audio'

interface FlashcardViewerProps {
  card: ReviewCard
  isFlipped: boolean
  onFlip: () => void
}

export function FlashcardViewer({ card, isFlipped, onFlip }: FlashcardViewerProps) {
  const { autoPlayAudio } = useSettingsStore()
  const isJapanese = card.language === 'ja'
  const audioLang: AudioLang = isJapanese ? 'ja-JP' : 'en-US'
  const hiragana = (card.extra_fields as Record<string, string> | null)?.hiragana

  const { play } = useAudio({ word: card.front, audioUrl: card.audio_url, lang: audioLang })

  useEffect(() => {
    if (isFlipped && autoPlayAudio) {
      play()
    }
  }, [isFlipped]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="w-full cursor-pointer select-none"
      onClick={onFlip}
      style={{ perspective: 2000 }}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d', aspectRatio: '16 / 9' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* ===== FRONT ===== */}
        <div
          className="absolute inset-0 flex flex-col rounded-2xl overflow-hidden bg-[#2e3856] shadow-2xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Top accent line */}
          <div className={`h-1 shrink-0 ${isJapanese ? 'bg-gradient-to-r from-rose-400 via-pink-500 to-red-500' : 'bg-gradient-to-r from-primary-400 via-indigo-500 to-violet-500'}`} />

          {/* Action buttons - top right */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-10 flex items-center gap-2">
            <AudioButton word={card.front} audioUrl={card.audio_url} lang={audioLang} size="md" className="text-gray-400 hover:text-white hover:bg-white/10 dark:hover:text-white dark:hover:bg-white/10" />
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-16 min-h-0">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center leading-tight break-words max-w-full">
              {card.front}
            </h2>

            {/* Japanese: show hiragana reading */}
            {isJapanese && hiragana && (
              <span className="text-gray-300 text-xl sm:text-2xl font-light mt-3">
                {hiragana}
              </span>
            )}

            {card.pronunciation && (
              <span className="text-gray-400 text-base sm:text-lg font-light tracking-wide mt-2">
                {card.pronunciation}
              </span>
            )}
          </div>

          {/* Bottom bar */}
          <div className={`shrink-0 py-3 text-center ${isJapanese ? 'bg-rose-600' : 'bg-primary-600'}`}>
            <span className="text-white/90 text-sm font-medium">
              Nhấn vào thẻ để lật
            </span>
          </div>
        </div>

        {/* ===== BACK ===== */}
        <div
          className="absolute inset-0 flex flex-col rounded-2xl overflow-hidden bg-[#2e3856] shadow-2xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Top accent line */}
          <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 shrink-0" />

          {/* Action buttons - top right */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-10 flex items-center gap-2">
            <AudioButton word={card.front} audioUrl={card.audio_url} lang={audioLang} size="md" className="text-gray-400 hover:text-white hover:bg-white/10 dark:hover:text-white dark:hover:bg-white/10" />
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-16 min-h-0">
            <span className="inline-flex px-3 py-1 rounded-full bg-emerald-500/20 text-[11px] font-semibold text-emerald-400 mb-5 tracking-widest uppercase">
              Nghĩa
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center leading-tight break-words max-w-full">
              {card.back}
            </h2>

            {card.example_sentence && (
              <div className="mt-6 w-full max-w-2xl">
                <div className="bg-white/5 rounded-xl px-5 py-3 sm:px-6 sm:py-4">
                  {isJapanese ? (
                    <FuriganaText
                      text={card.example_sentence}
                      className="text-gray-300 text-center text-sm sm:text-base leading-relaxed block"
                    />
                  ) : (
                    <p className="text-gray-300 italic text-center text-sm sm:text-base leading-relaxed">
                      &ldquo;{card.example_sentence}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="shrink-0 py-3 bg-emerald-600 text-center">
            <span className="text-white/90 text-sm font-medium">
              Chọn mức độ nhớ bên dưới
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
