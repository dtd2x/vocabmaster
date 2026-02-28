import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { formatDuration } from '@/lib/utils'
import type { SessionSummary as SummaryType } from '@/types/review'

interface SessionSummaryProps {
  summary: SummaryType
  onGoHome: () => void
  onReviewAgain: () => void
}

const accuracyColor = (acc: number) => {
  if (acc >= 80) return 'text-emerald-500'
  if (acc >= 50) return 'text-amber-500'
  return 'text-red-500'
}

const accuracyStroke = (acc: number) => {
  if (acc >= 80) return 'stroke-emerald-500'
  if (acc >= 50) return 'stroke-amber-500'
  return 'stroke-red-500'
}

export function SessionSummary({ summary, onGoHome, onReviewAgain }: SessionSummaryProps) {
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (summary.accuracy / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-gray-800/80 rounded-3xl shadow-xl shadow-gray-200/40 dark:shadow-black/20 border border-gray-100 dark:border-gray-700/50 p-8 text-center overflow-hidden relative">
        {/* Gradient accent top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-primary-500 to-violet-500" />

        <div className="text-5xl mb-2">
          {summary.accuracy >= 80 ? '\u{1F389}' : '\u{1F4AA}'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Hoàn thành!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {summary.accuracy >= 80 ? 'Tuyệt vời! Bạn làm rất tốt!' : 'Tiếp tục cố gắng nhé!'}
        </p>

        {/* Circular accuracy chart */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-700/50" />
              <motion.circle
                cx="60" cy="60" r="54" fill="none" strokeWidth="8" strokeLinecap="round"
                className={accuracyStroke(summary.accuracy)}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${accuracyColor(summary.accuracy)}`}>
                {summary.accuracy.toFixed(0)}%
              </span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Chính xác</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-3">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{summary.totalCards}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Thẻ đã ôn</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-3">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-primary-600 dark:text-primary-400">+{summary.xpEarned}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">XP</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-3">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatDuration(summary.totalDuration)}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Thời gian</p>
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
      </div>
    </motion.div>
  )
}
