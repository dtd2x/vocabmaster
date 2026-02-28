import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import type { UserStats } from '@/types/user'
import { getLevelInfo } from '@/lib/xp'

interface StatsOverviewProps {
  stats: UserStats | null
  todayReviews: number
}

export function StatsOverview({ stats, todayReviews }: StatsOverviewProps) {
  const levelInfo = getLevelInfo(stats?.xp ?? 0)

  const items: {
    label: string
    value: number
    suffix: string
    color: string
    iconBg: string
    icon: ReactNode
  }[] = [
    {
      label: 'Hôm nay',
      value: todayReviews,
      suffix: 'thẻ',
      color: 'text-primary-500',
      iconBg: 'bg-primary-50 dark:bg-primary-900/30 text-primary-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Streak',
      value: stats?.current_streak ?? 0,
      suffix: 'ngày',
      color: 'text-orange-500',
      iconBg: 'bg-orange-50 dark:bg-orange-900/30 text-orange-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
    },
    {
      label: 'Level',
      value: levelInfo.level,
      suffix: `${stats?.xp ?? 0} XP`,
      color: 'text-purple-500',
      iconBg: 'bg-purple-50 dark:bg-purple-900/30 text-purple-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: 'Đã học',
      value: stats?.total_cards_learned ?? 0,
      suffix: 'từ',
      color: 'text-success-500',
      iconBg: 'bg-green-50 dark:bg-green-900/30 text-success-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <Card key={item.label} className="group hover:shadow-sm transition-all duration-200">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color} leading-tight`}>{item.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{item.suffix}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
