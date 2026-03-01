import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AudioButton } from '@/components/ui/AudioButton'
import { useAudio } from '@/hooks/useAudio'
import { useSettingsStore } from '@/stores/settingsStore'
import type { QuizQuestion } from '@/types/quiz'

interface MultipleChoiceProps {
  question: QuizQuestion
  onAnswer: (answer: string, correct: boolean) => void
}

export function MultipleChoice({ question, onAnswer }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const { autoPlayAudio } = useSettingsStore()
  const isJapanese = question.language === 'ja'
  const { play } = useAudio({ word: question.question, audioUrl: question.audioUrl, lang: isJapanese ? 'ja-JP' : undefined })

  useEffect(() => {
    if (autoPlayAudio) play()
  }, [question.card_id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (option: string) => {
    if (revealed) return
    setSelected(option)
    setRevealed(true)

    const correct = option === question.correctAnswer
    setTimeout(() => {
      onAnswer(option, correct)
      setSelected(null)
      setRevealed(false)
    }, 1200)
  }

  return (
    <div className="space-y-5">
      {/* Question card */}
      <div className="bg-[#2e3856] rounded-2xl p-10 sm:p-12 text-center shadow-xl" style={{ aspectRatio: '16 / 7' }}>
        <div className="h-full flex flex-col items-center justify-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-5 font-medium">Từ này nghĩa là gì?</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3">{question.question}</h2>
          {isJapanese && question.hiragana && (
            <p className="text-gray-300 text-lg mb-3">{question.hiragana}</p>
          )}
          <AudioButton word={question.question} audioUrl={question.audioUrl} lang={isJapanese ? 'ja-JP' : undefined} size="md" className="text-gray-400 hover:text-white hover:bg-white/10 dark:hover:text-white dark:hover:bg-white/10" />
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {question.options?.map((option, i) => {
          const isCorrect = option === question.correctAnswer
          const isSelected = option === selected
          const label = String.fromCharCode(65 + i)

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelect(option)}
              disabled={revealed}
              className={cn(
                'w-full py-5 px-5 rounded-xl text-left font-medium transition-all duration-200 border-2 flex items-center gap-4',
                !revealed && 'border-border-light dark:border-border-dark bg-white dark:bg-sidebar hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                revealed && isCorrect && 'border-success-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
                revealed && isSelected && !isCorrect && 'border-danger-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
                revealed && !isSelected && !isCorrect && 'border-border-light dark:border-border-dark opacity-40',
              )}
            >
              <span className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors',
                !revealed && 'bg-surface-light dark:bg-sidebar-hover text-gray-500',
                revealed && isCorrect && 'bg-success-500 text-white',
                revealed && isSelected && !isCorrect && 'bg-danger-500 text-white',
                revealed && !isSelected && !isCorrect && 'bg-surface-light dark:bg-sidebar-hover text-gray-400',
              )}>
                {label}
              </span>
              <span className="text-gray-800 dark:text-gray-200 text-base">{option}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
