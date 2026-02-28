import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDuration } from '@/lib/utils'
import type { SessionSummary as SummaryType } from '@/types/review'

interface SessionSummaryProps {
  summary: SummaryType
  onGoHome: () => void
  onReviewAgain: () => void
}

export function SessionSummary({ summary, onGoHome, onReviewAgain }: SessionSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
    >
      <Card padding="lg" className="text-center">
        <div className="text-5xl mb-4">
          {summary.accuracy >= 80 ? '\u{1F389}' : '\u{1F4AA}'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Hoàn thành!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {summary.accuracy >= 80 ? 'Tuyệt vời! Bạn làm rất tốt!' : 'Tiếp tục cố gắng nhé!'}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{summary.totalCards}</p>
            <p className="text-xs text-gray-500">Thẻ đã ôn</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <p className="text-2xl font-bold text-green-600">{summary.accuracy.toFixed(0)}%</p>
            <p className="text-xs text-gray-500">Chính xác</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <p className="text-2xl font-bold text-primary-600">+{summary.xpEarned}</p>
            <p className="text-xs text-gray-500">XP nhận được</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatDuration(summary.totalDuration)}</p>
            <p className="text-xs text-gray-500">Thời gian</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onGoHome}>
            Về Dashboard
          </Button>
          <Button className="flex-1" onClick={onReviewAgain}>
            Ôn tiếp
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
