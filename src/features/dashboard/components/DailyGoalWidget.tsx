import { Card } from '@/components/ui/Card'

interface DailyGoalWidgetProps {
  current: number
  goal: number
}

export function DailyGoalWidget({ current, goal }: DailyGoalWidgetProps) {
  const progress = Math.min(1, current / goal)
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)
  const completed = current >= goal

  return (
    <Card padding="lg" className="flex flex-col items-center">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Mục tiêu hôm nay</h3>

      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            strokeWidth="10"
            fill="none"
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          <defs>
            <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={completed ? '#22c55e' : '#3b82f6'} />
              <stop offset="100%" stopColor={completed ? '#16a34a' : '#2563eb'} />
            </linearGradient>
          </defs>
          <circle
            cx="50" cy="50" r={radius}
            stroke="url(#goalGradient)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{current}</span>
          <span className="text-xs text-gray-500">/ {goal}</span>
        </div>
      </div>

      {completed && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-lg">🎉</span>
          <p className="text-sm font-semibold text-success-500">Hoàn thành!</p>
        </div>
      )}
    </Card>
  )
}
