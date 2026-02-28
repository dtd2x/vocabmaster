import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/config/supabase'
import { Select } from '@/components/ui/Select'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { cn } from '@/lib/utils'
import type { Deck } from '@/types/card'

const quizModes = [
  {
    id: 'multiple-choice',
    name: 'Trắc nghiệm',
    description: 'Chọn đáp án đúng trong 4 lựa chọn',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-500',
    accent: 'border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'typing',
    name: 'Gõ từ',
    description: 'Nhập từ tiếng Anh theo nghĩa tiếng Việt',
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-500',
    accent: 'border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    id: 'matching',
    name: 'Nối cặp',
    description: 'Nối từ tiếng Anh với nghĩa tương ứng',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-500',
    accent: 'border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
]

export function QuizPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [decks, setDecks] = useState<Deck[]>([])
  const [selectedDeck, setSelectedDeck] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('decks')
      .select('*')
      .or(`user_id.eq.${user.id},is_preset.eq.true`)
      .gt('card_count', 0)
      .order('name')
      .then(({ data }) => {
        setDecks(data ?? [])
        if (data?.[0]) setSelectedDeck(data[0].id)
        setLoading(false)
      })
  }, [user])

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Chọn chế độ và bộ từ để bắt đầu</p>
      </div>

      {/* Deck selector */}
      <div className="bg-white dark:bg-sidebar rounded-xl border border-border-light dark:border-border-dark p-5 mb-6">
        <Select
          label="Bộ từ vựng"
          value={selectedDeck}
          onChange={e => setSelectedDeck(e.target.value)}
          options={decks.map(d => ({ value: d.id, label: `${d.name} (${d.card_count} từ)` }))}
        />
      </div>

      {/* Mode cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quizModes.map(mode => (
          <button
            key={mode.id}
            onClick={() => { if (selectedDeck) navigate(`/quiz/${mode.id}/${selectedDeck}`) }}
            disabled={!selectedDeck}
            className={cn(
              'group relative bg-white dark:bg-sidebar rounded-xl border-2 p-6 text-left transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed',
              mode.accent
            )}
          >
            {/* Icon */}
            <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center mb-5', mode.iconBg, mode.iconColor)}>
              {mode.icon}
            </div>

            {/* Text */}
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">{mode.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{mode.description}</p>

            {/* Arrow */}
            <div className={cn('mt-5 flex items-center gap-1 text-sm font-medium transition-colors', mode.iconColor)}>
              Bắt đầu
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
