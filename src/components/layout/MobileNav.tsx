import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { getLevelInfo } from '@/lib/xp'
import { ROUTES } from '@/config/routes'

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.DECKS, label: 'Bộ từ vựng' },
  { to: ROUTES.REVIEW, label: 'Ôn tập' },
  { to: ROUTES.QUIZ, label: 'Quiz' },
  { to: ROUTES.ACHIEVEMENTS, label: 'Thành tích' },
  { to: ROUTES.SETTINGS, label: 'Cài đặt' },
]

export function MobileNav() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { stats, profile, signOut } = useAuthStore()
  const levelInfo = getLevelInfo(stats?.xp ?? 0)

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar shadow-xl lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-5 border-b border-sidebar-hover flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">VocabMaster</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-sidebar-text hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User */}
              <div className="px-4 py-4 border-b border-sidebar-hover">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center text-white font-semibold">
                    {profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{profile?.display_name || 'User'}</p>
                    <p className="text-xs text-sidebar-text">Level {levelInfo.level} &middot; {stats?.xp ?? 0} XP</p>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-hover text-white'
                          : 'text-sidebar-text hover:text-white hover:bg-sidebar-hover'
                      )
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>

              {/* Sign out */}
              <div className="px-4 py-3 border-t border-sidebar-hover">
                <button
                  onClick={() => { signOut(); setSidebarOpen(false) }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-danger-500 hover:bg-sidebar-hover transition-colors"
                >
                  Dang xuat
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
