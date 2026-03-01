import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/config/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { getLevelInfo } from '@/lib/xp'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Achievement } from '@/types/gamification'

export function AchievementsPage() {
  const { stats } = useAuthStore()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const levelInfo = getLevelInfo(stats?.xp ?? 0)

  useEffect(() => {
    supabase.from('achievements').select('*').then(({ data, error: err }) => {
      if (err) {
        console.error('Error fetching achievements:', err)
        setError('Không thể tải danh sách thành tích. Hãy chắc chắn đã chạy SQL migration.')
        setLoading(false)
        return
      }
      const userBadges = new Set(stats?.badges ?? [])
      setAchievements(
        (data ?? []).map(a => ({
          ...a,
          unlocked: userBadges.has(a.id),
        }))
      )
      setLoading(false)
    })
  }, [stats])

  if (loading) return <PageSpinner />

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Thành tích</h1>
        <EmptyState
          title="Chưa có dữ liệu"
          description={error}
        />
      </div>
    )
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Thành tích</h1>

      {/* Level card */}
      <Card padding="lg" className="mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {levelInfo.level}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Level {levelInfo.level}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{stats?.xp ?? 0} XP tổng cộng</p>
            <div className="mt-3 max-w-md">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{stats?.xp ?? 0} XP</span>
                <span>{levelInfo.xpForNextLevel} XP</span>
              </div>
              <ProgressBar value={levelInfo.progress * 100} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{stats?.current_streak ?? 0}</div>
            <div className="text-sm text-gray-500">Ngày streak</div>
          </div>
        </div>
      </Card>

      {/* Stats summary */}
      <div className="flex gap-4 mb-6">
        <Badge variant="success" size="md">{unlockedCount} Đã mở</Badge>
        <Badge size="md">{achievements.length - unlockedCount} Chưa mở</Badge>
      </div>

      {/* Achievements grid */}
      {achievements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, i) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card
                padding="md"
                className={achievement.unlocked ? '' : 'opacity-50 grayscale'}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-2xl shrink-0">
                    {achievement.unlocked ? '\u{1F3C6}' : '\u{1F512}'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{achievement.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{achievement.description}</p>
                    {achievement.xp_reward > 0 && (
                      <Badge variant="primary" className="mt-2">+{achievement.xp_reward} XP</Badge>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Chưa có thành tích nào"
          description="Hãy chạy SQL migration để tạo danh sách thành tích."
        />
      )}
    </div>
  )
}
