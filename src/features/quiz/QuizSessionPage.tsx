import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import { useAuthStore } from '@/stores/authStore'
import { MultipleChoice } from './components/MultipleChoice'
import { TypingTest } from './components/TypingTest'
import { MatchingGame } from './components/MatchingGame'
import { ReviewProgress } from '@/features/review/components/ReviewProgress'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { shuffleArray, formatDuration } from '@/lib/utils'
import { calculateXP } from '@/lib/xp'
import type { QuizMode, QuizQuestion, QuizResult } from '@/types/quiz'
import type { Card as CardType } from '@/types/card'

export function QuizSessionPage() {
  const { mode, deckId } = useParams<{ mode: string; deckId: string }>()
  const navigate = useNavigate()
  const { stats } = useAuthStore()
  const [cards, setCards] = useState<CardType[]>([])
  const [deckLanguage, setDeckLanguage] = useState<string>('en')
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<QuizResult[]>([])
  const [startTime] = useState(Date.now())
  const [cardStartTime, setCardStartTime] = useState(Date.now())
  const [finished, setFinished] = useState(false)

  const quizMode = mode as QuizMode

  useEffect(() => {
    if (!deckId) return
    // Fetch deck to get language
    supabase.from('decks').select('language').eq('id', deckId).single().then(({ data }) => {
      if (data?.language) setDeckLanguage(data.language)
    })
    supabase.from('cards').select('*').eq('deck_id', deckId).then(({ data }) => {
      setCards(shuffleArray(data ?? []).slice(0, quizMode === 'matching' ? 6 : 10))
      setLoading(false)
    })
  }, [deckId, quizMode])

  const questions: QuizQuestion[] = useMemo(() => {
    if (quizMode === 'matching') return []

    return cards.map(card => {
      const extraFields = card.extra_fields as Record<string, string> | null
      const question: QuizQuestion = {
        card_id: card.id,
        question: quizMode === 'typing' ? card.back : card.front,
        correctAnswer: quizMode === 'typing' ? card.front : card.back,
        deck_id: card.deck_id,
        audioUrl: card.audio_url,
        language: deckLanguage,
        hiragana: extraFields?.hiragana,
        romaji: card.pronunciation ?? undefined,
      }

      if (quizMode === 'multiple-choice') {
        const otherCards = cards.filter(c => c.id !== card.id)
        const distractors = shuffleArray(otherCards).slice(0, 3).map(c => c.back)
        question.options = shuffleArray([card.back, ...distractors])
      }

      return question
    })
  }, [cards, quizMode, deckLanguage])

  const handleAnswer = (answer: string, correct: boolean) => {
    const card = cards[currentIndex]
    if (!card) return
    const duration = Date.now() - cardStartTime

    const result: QuizResult = {
      card_id: card.id,
      correct,
      userAnswer: answer,
      correctAnswer: quizMode === 'typing' ? card.front : card.back,
      duration_ms: duration,
    }

    const newResults = [...results, result]
    setResults(newResults)

    if (currentIndex + 1 >= cards.length) {
      setFinished(true)
    } else {
      setCurrentIndex(prev => prev + 1)
      setCardStartTime(Date.now())
    }
  }

  const handleMatchingComplete = (matchResult: { correct: number; total: number }) => {
    const matchResults: QuizResult[] = cards.slice(0, matchResult.total).map(card => ({
      card_id: card.id,
      correct: true,
      userAnswer: card.back,
      correctAnswer: card.back,
      duration_ms: 0,
    }))
    setResults(matchResults)
    setFinished(true)
  }

  if (loading) return <PageSpinner />

  if (finished) {
    const totalCorrect = results.filter(r => r.correct).length
    const accuracy = results.length > 0 ? (totalCorrect / results.length) * 100 : 0
    const totalDuration = Date.now() - startTime
    const xpEarned = results.reduce((sum, r) => sum + calculateXP(r.correct ? 3 : 1, stats?.current_streak ?? 0), 0)
    const isGood = accuracy >= 80

    return (
      <div className="max-w-xl mx-auto py-10 px-4 sm:px-6">
        <Card padding="none" className="overflow-hidden">
          {/* Top banner */}
          <div className={`px-8 py-8 text-center ${isGood ? 'bg-success-500/10 dark:bg-success-500/5' : 'bg-primary-50 dark:bg-primary-900/10'}`}>
            <div className="text-5xl mb-3">{isGood ? '🎉' : '💪'}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kết quả Quiz</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isGood ? 'Xuất sắc! Tiếp tục phát huy nhé.' : 'Cố gắng thêm nhé, bạn làm tốt lắm!'}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 divide-x divide-y divide-border-light dark:divide-border-dark border-t border-border-light dark:border-border-dark">
            <div className="px-6 py-5 text-center">
              <p className="text-3xl font-bold text-success-500">{totalCorrect}<span className="text-lg text-gray-400 font-normal">/{results.length}</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide font-medium">Câu đúng</p>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-3xl font-bold text-primary-500">{accuracy.toFixed(0)}<span className="text-lg text-gray-400 font-normal">%</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide font-medium">Chính xác</p>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-3xl font-bold text-purple-500">+{xpEarned}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide font-medium">XP nhận được</p>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-3xl font-bold text-gray-700 dark:text-gray-200">{formatDuration(totalDuration)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide font-medium">Thời gian</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-border-light dark:border-border-dark">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/quiz')}>
              Chọn quiz khác
            </Button>
            <Button className="flex-1" onClick={() => { setCurrentIndex(0); setResults([]); setFinished(false); setCards(shuffleArray(cards)) }}>
              Chơi lại
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const modeLabel: Record<string, string> = {
    'multiple-choice': 'Trắc nghiệm',
    'typing': 'Gõ từ',
    'matching': 'Nối cặp',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <Button variant="ghost" size="sm" onClick={() => navigate('/quiz')}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Thoát
        </Button>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-sidebar border border-border-light dark:border-border-dark px-3 py-1 rounded-lg">
          {modeLabel[quizMode] ?? quizMode}
        </span>
      </div>

      {/* Progress */}
      {quizMode !== 'matching' && (
        <div className="mb-5">
          <ReviewProgress current={currentIndex} total={cards.length} />
        </div>
      )}

      {/* Quiz content */}
      <div>
        {quizMode === 'multiple-choice' && questions[currentIndex] && (
          <MultipleChoice question={questions[currentIndex]} onAnswer={handleAnswer} />
        )}
        {quizMode === 'typing' && questions[currentIndex] && (
          <TypingTest question={questions[currentIndex]} onAnswer={handleAnswer} />
        )}
        {quizMode === 'matching' && (
          <MatchingGame
            pairs={cards.map(c => ({ id: c.id, front: c.front, back: c.back }))}
            onComplete={handleMatchingComplete}
            language={deckLanguage}
          />
        )}
      </div>
    </div>
  )
}
