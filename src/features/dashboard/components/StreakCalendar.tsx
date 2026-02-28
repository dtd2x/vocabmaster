import { useMemo } from 'react'
import { subDays, format, startOfWeek, eachDayOfInterval } from 'date-fns'
import { Card } from '@/components/ui/Card'

interface HeatmapData {
  review_date: string
  review_count: number
}

interface StreakCalendarProps {
  data: HeatmapData[]
}

function getHeatmapLevel(count: number): number {
  if (count === 0) return 0
  if (count <= 5) return 1
  if (count <= 15) return 2
  if (count <= 30) return 3
  return 4
}

export function StreakCalendar({ data }: StreakCalendarProps) {
  const { weeks, months } = useMemo(() => {
    const today = new Date()
    const start = startOfWeek(subDays(today, 364), { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start, end: today })

    const countMap = new Map<string, number>()
    for (const d of data) {
      countMap.set(d.review_date, d.review_count)
    }

    const weeksArr: { date: Date; count: number; level: number }[][] = []
    let currentWeek: { date: Date; count: number; level: number }[] = []

    for (const day of days) {
      const key = format(day, 'yyyy-MM-dd')
      const count = countMap.get(key) ?? 0
      currentWeek.push({ date: day, count, level: getHeatmapLevel(count) })

      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek)
        currentWeek = []
      }
    }
    if (currentWeek.length > 0) weeksArr.push(currentWeek)

    // Month labels
    const monthsArr: { label: string; col: number }[] = []
    let lastMonth = -1
    for (let w = 0; w < weeksArr.length; w++) {
      const firstDay = weeksArr[w]?.[0]
      if (!firstDay) continue
      const month = firstDay.date.getMonth()
      if (month !== lastMonth) {
        monthsArr.push({ label: format(firstDay.date, 'MMM'), col: w })
        lastMonth = month
      }
    }

    return { weeks: weeksArr, months: monthsArr }
  }, [data])

  return (
    <Card padding="lg">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Lịch ôn tập</h3>
      <div className="overflow-x-auto">
        {/* Month labels */}
        <div className="flex gap-0 mb-1 ml-3" style={{ minWidth: weeks.length * 16 }}>
          {months.map((m, i) => (
            <span
              key={i}
              className="text-xs text-gray-400 dark:text-gray-500"
              style={{ position: 'relative', left: m.col * 16 }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-[3px] heatmap-${day.level}`}
                  title={`${format(day.date, 'dd/MM/yyyy')}: ${day.count} reviews`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
          <span>Ít</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div key={level} className={`w-3 h-3 rounded-[3px] heatmap-${level}`} />
          ))}
          <span>Nhiều</span>
        </div>
      </div>
    </Card>
  )
}
