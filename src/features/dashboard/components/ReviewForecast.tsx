import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/Card'

interface ForecastData {
  date: string
  count: number
}

interface ReviewForecastProps {
  data: ForecastData[]
}

export function ReviewForecast({ data }: ReviewForecastProps) {
  return (
    <Card padding="lg">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Dự báo ôn tập 7 ngày tới</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-gray-900, #111827)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} thẻ`, 'Cần ôn']}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
      )}
    </Card>
  )
}
