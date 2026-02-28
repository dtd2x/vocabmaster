import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { shuffleArray } from '@/lib/utils'

interface MatchingPair {
  id: string
  front: string
  back: string
}

interface MatchingGameProps {
  pairs: MatchingPair[]
  onComplete: (results: { correct: number; total: number }) => void
}

export function MatchingGame({ pairs, onComplete }: MatchingGameProps) {
  const gamePairs = useMemo(() => pairs.slice(0, 6), [pairs])
  const shuffledFronts = useMemo(() => shuffleArray(gamePairs), [gamePairs])
  const shuffledBacks = useMemo(() => shuffleArray(gamePairs), [gamePairs])

  const [selectedFront, setSelectedFront] = useState<string | null>(null)
  const [selectedBack, setSelectedBack] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState<{ front: string; back: string } | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const handleFrontClick = (id: string) => {
    if (matched.has(id)) return
    setSelectedFront(id)
    if (selectedBack) checkMatch(id, selectedBack)
  }

  const handleBackClick = (id: string) => {
    if (matched.has(id)) return
    setSelectedBack(id)
    if (selectedFront) checkMatch(selectedFront, id)
  }

  const checkMatch = (frontId: string, backId: string) => {
    if (frontId === backId) {
      const newMatched = new Set(matched)
      newMatched.add(frontId)
      setMatched(newMatched)
      setCorrectCount(prev => prev + 1)
      setSelectedFront(null)
      setSelectedBack(null)

      if (newMatched.size === gamePairs.length) {
        setTimeout(() => {
          onComplete({ correct: correctCount + 1, total: gamePairs.length })
        }, 500)
      }
    } else {
      setWrong({ front: frontId, back: backId })
      setTimeout(() => {
        setWrong(null)
        setSelectedFront(null)
        setSelectedBack(null)
      }, 800)
    }
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Nối từ tiếng Anh với nghĩa tiếng Việt</p>
        <span className="text-sm font-semibold text-primary-500">{matched.size}/{gamePairs.length}</span>
      </div>
      <div className="w-full h-2 bg-border-light dark:bg-border-dark rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${(matched.size / gamePairs.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-5 sm:gap-6">
        {/* English column */}
        <div className="space-y-3">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 text-center font-medium">Tiếng Anh</p>
          {shuffledFronts.map(pair => (
            <motion.button
              key={`front-${pair.id}`}
              onClick={() => handleFrontClick(pair.id)}
              disabled={matched.has(pair.id)}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'w-full py-5 px-5 rounded-xl border-2 text-base font-medium transition-all text-center',
                matched.has(pair.id) && 'border-success-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 opacity-70',
                selectedFront === pair.id && !matched.has(pair.id) && 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300',
                wrong?.front === pair.id && 'border-danger-500 bg-red-50 dark:bg-red-900/20',
                !matched.has(pair.id) && selectedFront !== pair.id && wrong?.front !== pair.id && 'border-border-light dark:border-border-dark bg-white dark:bg-sidebar text-gray-800 dark:text-gray-200 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10',
              )}
            >
              {pair.front}
            </motion.button>
          ))}
        </div>

        {/* Vietnamese column */}
        <div className="space-y-3">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 text-center font-medium">Tiếng Việt</p>
          {shuffledBacks.map(pair => (
            <motion.button
              key={`back-${pair.id}`}
              onClick={() => handleBackClick(pair.id)}
              disabled={matched.has(pair.id)}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'w-full py-5 px-5 rounded-xl border-2 text-base font-medium transition-all text-center',
                matched.has(pair.id) && 'border-success-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 opacity-70',
                selectedBack === pair.id && !matched.has(pair.id) && 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300',
                wrong?.back === pair.id && 'border-danger-500 bg-red-50 dark:bg-red-900/20',
                !matched.has(pair.id) && selectedBack !== pair.id && wrong?.back !== pair.id && 'border-border-light dark:border-border-dark bg-white dark:bg-sidebar text-gray-800 dark:text-gray-200 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10',
              )}
            >
              {pair.back}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
