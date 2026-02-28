interface ReviewProgressProps {
  current: number
  total: number
}

export function ReviewProgress({ current, total }: ReviewProgressProps) {
  const progress = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-900/20 text-xs font-bold text-primary-600 dark:text-primary-400">
            {current}
          </span>
          <span className="text-sm text-gray-400">/</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{total} thẻ</span>
        </div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
