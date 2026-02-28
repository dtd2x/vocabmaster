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
  const { play } = useAudio({ word: question.question, audioUrl: question.audioUrl })

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
    <div className="space-y-4">
      {/* Question card */}
      <div className="bg-white dark:bg-sidebar rounded-xl border border-border-light dark:border-border-dark p-8 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-medium">Từ này nghĩa là gì?</p>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{question.question}</h2>
        <AudioButton word={question.question} audioUrl={question.audioUrl} size="md" className="mx-auto" />
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                'w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border-2 flex items-center gap-3',
                !revealed && 'border-border-light dark:border-border-dark bg-white dark:bg-sidebar hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                revealed && isCorrect && 'border-success-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
                revealed && isSelected && !isCorrect && 'border-danger-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
                revealed && !isSelected && !isCorrect && 'border-border-light dark:border-border-dark opacity-40',
              )}
            >
              <span className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                !revealed && 'bg-surface-light dark:bg-sidebar-hover text-gray-500',
                revealed && isCorrect && 'bg-success-500 text-white',
                revealed && isSelected && !isCorrect && 'bg-danger-500 text-white',
                revealed && !isSelected && !isCorrect && 'bg-surface-light dark:bg-sidebar-hover text-gray-400',
              )}>
                {label}
              </span>
              <span className="text-gray-800 dark:text-gray-200 text-sm">{option}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
