'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts'

interface ScoreChartProps {
  data: { date: string; score: number }[]
  title?: string
  description?: string
}

export function ScoreChart({ data, title = 'Динамика баллов', description }: ScoreChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.15 195)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="oklch(0.55 0.15 195)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 220)" />
              <XAxis 
                dataKey="formattedDate" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                stroke="oklch(0.5 0.02 240)"
              />
              <YAxis 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                stroke="oklch(0.5 0.02 240)"
                domain={[-20, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'oklch(1 0 0)',
                  border: '1px solid oklch(0.9 0.01 220)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`${value} баллов`, 'Балл']}
                labelFormatter={(label) => `Дата: ${label}`}
              />
              <ReferenceLine y={0} stroke="oklch(0.55 0.2 25)" strokeDasharray="3 3" />
              <ReferenceLine y={60} stroke="oklch(0.65 0.15 155)" strokeDasharray="3 3" label={{ value: 'Хорошо', position: 'right', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="oklch(0.55 0.15 195)"
                strokeWidth={2}
                fill="url(#scoreGradient)"
                dot={{ r: 4, fill: 'oklch(0.55 0.15 195)', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: 'oklch(0.55 0.15 195)', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function SimpleScoreChart({ data }: { data: { date: string; score: number }[] }) {
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
  }))

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 220)" />
          <XAxis 
            dataKey="formattedDate" 
            fontSize={10} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            fontSize={10} 
            tickLine={false}
            axisLine={false}
            domain={[-20, 100]}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}`, 'Балл']}
            contentStyle={{ 
              fontSize: '12px',
              borderRadius: '6px'
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="oklch(0.55 0.15 195)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'oklch(0.55 0.15 195)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
