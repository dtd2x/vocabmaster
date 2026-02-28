import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  className?: string
}

const colorClasses = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function ProgressBar({ value, size = 'md', color = 'primary', showLabel = false, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colorClasses[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
