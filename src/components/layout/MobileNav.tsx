import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { getLevelInfo } from '@/lib/xp'
import { ROUTES } from '@/config/routes'

const learningSubItems = [
  { to: ROUTES.DECKS, label: 'Bộ từ vựng' },
  { to: ROUTES.REVIEW, label: 'Ôn tập' },
  { to: ROUTES.QUIZ, label: 'Quiz' },
]

export function MobileNav() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { stats, profile, signOut } = useAuthStore()
  const levelInfo = getLevelInfo(stats?.xp ?? 0)
  const location = useLocation()
  const [learningOpen, setLearningOpen] = useState(true)

  const learningRoutes = [ROUTES.DECKS, ROUTES.REVIEW, ROUTES.QUIZ]
  const isLearningActive = learningRoutes.some(route => location.pathname.startsWith(route))

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar dark:bg-sidebar-dark shadow-xl lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-200/70 dark:border-sidebar-dark-hover flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gray-900 dark:bg-primary-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">VocabMaster</h1>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:text-sidebar-dark-text dark:hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User */}
              <div className="px-3 py-3 border-b border-gray-200/70 dark:border-sidebar-dark-hover">
                <div className="px-3 py-3 rounded-xl bg-white dark:bg-sidebar-dark-hover shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none">
                  <div className="flex items-center gap-3">
                    <UserAvatar avatarUrl={profile?.avatar_url} displayName={profile?.display_name} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{profile?.display_name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-sidebar-dark-text">Level {levelInfo.level} · {stats?.xp ?? 0} XP</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                {/* Dashboard */}
                <NavLink
                  to={ROUTES.DASHBOARD}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-white dark:bg-sidebar-dark-hover text-gray-900 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none'
                        : 'text-gray-500 dark:text-sidebar-dark-text hover:text-gray-900 dark:hover:text-white hover:bg-sidebar-hover dark:hover:bg-sidebar-dark-hover'
                    )
                  }
                >
                  Dashboard
                </NavLink>

                {/* Học tập group */}
                <div>
                  <button
                    onClick={() => setLearningOpen(!learningOpen)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      isLearningActive
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-sidebar-dark-text hover:text-gray-900 dark:hover:text-white hover:bg-sidebar-hover dark:hover:bg-sidebar-dark-hover'
                    )}
                  >
                    <span>Học tập</span>
                    <svg
                      className={cn('w-4 h-4 transition-transform duration-200', learningOpen && 'rotate-180')}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {learningOpen && (
                    <div className="relative ml-[22px] mt-0.5 space-y-0.5">
                      <div className="absolute left-0 top-0 bottom-[18px] w-px bg-gray-300 dark:bg-sidebar-dark-text/30" />
                      {learningSubItems.map((item) => (
                        <div key={item.to} className="relative">
                          <div className="absolute left-0 top-1/2 w-3.5 h-px bg-gray-300 dark:bg-sidebar-dark-text/30" />
                          <NavLink
                            to={item.to}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                              cn(
                                'flex items-center ml-6 px-3 py-2 rounded-xl text-sm font-medium transition-all',
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
                <NavLink
                  to={ROUTES.ACHIEVEMENTS}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-white dark:bg-sidebar-dark-hover text-gray-900 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none'
                        : 'text-gray-500 dark:text-sidebar-dark-text hover:text-gray-900 dark:hover:text-white hover:bg-sidebar-hover dark:hover:bg-sidebar-dark-hover'
                    )
                  }
                >
                  Thành tích
                </NavLink>

                {/* Cài đặt */}
                <NavLink
                  to={ROUTES.SETTINGS}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-white dark:bg-sidebar-dark-hover text-gray-900 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none'
                        : 'text-gray-500 dark:text-sidebar-dark-text hover:text-gray-900 dark:hover:text-white hover:bg-sidebar-hover dark:hover:bg-sidebar-dark-hover'
                    )
                  }
                >
                  Cài đặt
                </NavLink>
              </nav>

              {/* Sign out */}
              <div className="px-4 py-3 border-t border-gray-200/70 dark:border-sidebar-dark-hover">
                <button
                  onClick={() => { signOut(); setSidebarOpen(false) }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm text-danger-500 hover:bg-sidebar-hover dark:hover:bg-sidebar-dark-hover transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
