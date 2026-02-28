import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_NEW_CARDS_PER_DAY, DEFAULT_REVIEW_LIMIT, DEFAULT_DAILY_GOAL } from '@/config/constants'
import type { Accent } from '@/lib/audio'

type Theme = 'light' | 'dark' | 'system'

interface SettingsState {
  theme: Theme
  newCardsPerDay: number
  reviewLimit: number
  dailyGoal: number
  autoPlayAudio: boolean
  accent: Accent

  setTheme: (theme: Theme) => void
  updateSettings: (partial: Partial<Pick<SettingsState, 'newCardsPerDay' | 'reviewLimit' | 'dailyGoal' | 'autoPlayAudio' | 'accent'>>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      newCardsPerDay: DEFAULT_NEW_CARDS_PER_DAY,
      reviewLimit: DEFAULT_REVIEW_LIMIT,
      dailyGoal: DEFAULT_DAILY_GOAL,
      autoPlayAudio: false,
      accent: 'us' as Accent,

      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },

      updateSettings: (partial) => set(partial),
    }),
    {
      name: 'vocabmaster-settings',
    }
  )
)

function applyTheme(theme: Theme) {
  const root = document.documentElement

  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Apply theme on initial load
const initialTheme = useSettingsStore.getState().theme
applyTheme(initialTheme)

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useSettingsStore.getState().theme === 'system') {
      applyTheme('system')
    }
  })
}
