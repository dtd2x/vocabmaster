import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { AudioButton } from '@/components/ui/AudioButton'
import type { QuizQuestion } from '@/types/quiz'

interface TypingTestProps {
  question: QuizQuestion
  onAnswer: (answer: string, correct: boolean) => void
}

function normalizeString(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ')
}

function isFuzzyMatch(input: string, answer: string): boolean {
  const a = normalizeString(input)
  const b = normalizeString(answer)

  if (a === b) return true

  const maxErrors = b.length <= 5 ? 1 : 2
  let errors = 0
  let i = 0
  let j = 0

  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) {
      errors++
      if (errors > maxErrors) return false
      if (a.length > b.length) i++
      else if (b.length > a.length) j++
      else { i++; j++ }
    } else {
      i++
      j++
    }
  }

  errors += Math.abs((a.length - i) + (b.length - j))
  return errors <= maxErrors
}

export function TypingTest({ question, onAnswer }: TypingTestProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const correct = isFuzzyMatch(input, question.correctAnswer)
    setResult(correct ? 'correct' : 'incorrect')

    setTimeout(() => {
      onAnswer(input, correct)
      setInput('')
      setResult(null)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      {/* Question card */}
      <div className="bg-white dark:bg-sidebar rounded-xl border border-border-light dark:border-border-dark p-8 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-medium">Dịch sang tiếng Anh</p>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{question.question}</h2>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Nhập từ tiếng Anh..."
          autoFocus
          disabled={result !== null}
          className={`w-full px-5 py-4 rounded-xl border-2 text-lg text-center font-medium focus:outline-none transition-colors
            ${result === 'correct' ? 'border-success-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : ''}
            ${result === 'incorrect' ? 'border-danger-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : ''}
            ${result === null ? 'border-border-light dark:border-border-dark bg-white dark:bg-sidebar focus:border-primary-500' : ''}
          `}
        />

        {result === 'incorrect' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-danger-500/30"
          >
            <p className="text-sm text-red-600 dark:text-red-400">
              Đáp án: <strong className="text-red-700 dark:text-red-300">{question.correctAnswer}</strong>
            </p>
            <AudioButton word={question.correctAnswer} audioUrl={question.audioUrl} size="sm" className="inline-flex" />
          </motion.div>
        )}

        {result === null && (
          <Button type="submit" className="w-full" size="lg" disabled={!input.trim()}>
            Kiểm tra
          </Button>
        )}
      </form>
    </div>
  )
}
