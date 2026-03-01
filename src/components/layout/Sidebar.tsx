import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { LanguageSelector } from '@/components/shared/LanguageSelector'
import { getLevelInfo } from '@/lib/xp'
import { ROUTES } from '@/config/routes'

const learningSubItems = [
  { to: ROUTES.DECKS, label: 'Bộ từ vựng' },
  { to: ROUTES.REVIEW, label: 'Ôn tập' },
  { to: ROUTES.QUIZ, label: 'Quiz' },
]

export function Sidebar() {
  const { stats, profile } = useAuthStore()
  const levelInfo = getLevelInfo(stats?.xp ?? 0)
  const location = useLocation()
  const [learningOpen, setLearningOpen] = useState(true)

  const learningRoutes = [ROUTES.DECKS, ROUTES.REVIEW, ROUTES.QUIZ]
  const isLearningActive = learningRoutes.some(route => location.pathname.startsWith(route))

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-sidebar dark:bg-sidebar-dark h-screen sticky top-0 border-r border-gray-200/70 dark:border-sidebar-dark-hover">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gray-900 dark:bg-primary-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">VocabMaster</h1>
        </div>
      </div>

      {/* User info */}
      <div className="px-3 mb-3">
        <div className="px-3 py-3 rounded-xl bg-white dark:bg-sidebar-dark-hover shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none">
          <div className="flex items-center gap-3">
            <UserAvatar avatarUrl={profile?.avatar_url} displayName={profile?.display_name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {profile?.display_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-sidebar-dark-text">
                Level {levelInfo.level} · {stats?.xp ?? 0} XP
              </p>
            </div>
          </div>

          {/* Level progress */}
          <div className="mt-2.5">
            <div className="w-full h-1.5 bg-gray-100 dark:bg-sidebar-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progress * 100}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          {(stats?.current_streak ?? 0) > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-sm fire-animate">🔥</span>
              <span className="text-xs font-medium text-gray-500 dark:text-sidebar-dark-text">
                {stats?.current_streak} ngày streak
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Language Selector */}
      <div className="px-3 mb-3">
        <LanguageSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {/* Dashboard */}
        <SidebarLink to={ROUTES.DASHBOARD} icon={DashboardIcon} label="Dashboard" />

        {/* Học tập group */}
        <div>
          <button
            onClick={() => setLearningOpen(!learningOpen)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              isLearningActive
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-sidebar-dark-text hover:text-gray-900 dark:hover:text-white hover:bg-sidebar-hover dark:hover:bg-sidebar-dark-hover'
            )}
          >
            <div className="flex items-center gap-3">
              <LearningIcon className="w-5 h-5" />
              <span>Học tập</span>
            </div>
            <svg
              className={cn('w-4 h-4 transition-transform duration-200', learningOpen && 'rotate-180')}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {learningOpen && (
            <div className="relative ml-[22px] mt-0.5 space-y-0.5">
              {/* Vertical tree line */}
              <div className="absolute left-0 top-0 bottom-[18px] w-px bg-gray-300 dark:bg-sidebar-dark-text/30" />

              {learningSubItems.map((item) => (
                <div key={item.to} className="relative">
                  {/* Horizontal branch */}
                  <div className="absolute left-0 top-1/2 w-3.5 h-px bg-gray-300 dark:bg-sidebar-dark-text/30" />
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center ml-6 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-white dark:bg-sidebar-dark-hover text-gray-900 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none'
                          : 'text-gray-500 dark:text-sidebar-dark-text hover:text-gray-900 dark:hover:text-white hover:bg-sidebar-hover dark:hover:bg-sidebar-dark-hover'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thành tích */}
        <SidebarLink to={ROUTES.ACHIEVEMENTS} icon={AchievementsIcon} label="Thành tích" />

        {/* Cài đặt */}
        <SidebarLink to={ROUTES.SETTINGS} icon={SettingsIcon} label="Cài đặt" />
      </nav>

      {/* Bottom */}
      <div className="px-4 py-3 border-t border-gray-200/70 dark:border-sidebar-dark-hover">
        <ThemeToggle />
      </div>
    </aside>
  )
}

function SidebarLink({ to, icon: Icon, label }: { to: string; icon: React.FC<{ className?: string }>; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-white dark:bg-sidebar-dark-hover text-gray-900 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none'
            : 'text-gray-500 dark:text-sidebar-dark-text hover:text-gray-900 dark:hover:text-white hover:bg-sidebar-hover dark:hover:bg-sidebar-dark-hover'
        )
      }
    >
      <Icon className="w-5 h-5" />
      {label}
    </NavLink>
  )
}

// Icon components
function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  )
}

function LearningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function AchievementsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
