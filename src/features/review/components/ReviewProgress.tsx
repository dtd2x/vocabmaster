interface ReviewProgressProps {
  current: number
  total: number
}

export function ReviewProgress({ current, total }: ReviewProgressProps) {
  const progress = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {current} / {total}
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
