import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/Card'

interface AccuracyData {
  date: string
  accuracy: number
}

interface AccuracyChartProps {
  data: AccuracyData[]
}

export function AccuracyChart({ data }: AccuracyChartProps) {
  return (
    <Card padding="lg">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Độ chính xác (30 ngày)</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={35}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Chính xác']}
            />
            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#accuracyGradient)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
      )}
    </Card>
  )
}
