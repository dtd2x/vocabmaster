import { useSettingsStore } from '@/stores/settingsStore'
import { LANGUAGES } from '@/config/constants'
import { cn } from '@/lib/utils'

export function LanguageSelector() {
  const activeLanguage = useSettingsStore((s) => s.activeLanguage)
  const setActiveLanguage = useSettingsStore((s) => s.setActiveLanguage)

  return (
    <div className="flex rounded-xl bg-gray-100 dark:bg-sidebar-dark p-1 gap-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.value}
          onClick={() => setActiveLanguage(lang.value)}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
            activeLanguage === lang.value
              ? 'bg-white dark:bg-sidebar-dark-hover text-gray-900 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none'
              : 'text-gray-500 dark:text-sidebar-dark-text hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  )
}
