'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ActivityRecord } from '@/lib/types'
import { Award, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityItemProps {
  activity: ActivityRecord
  showStudent?: boolean
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const isPositive = activity.scoreChange > 0
  const isNegative = activity.scoreChange < 0
  
  const typeConfig = {
    achievement: {
      icon: Award,
      label: 'Достижение',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-600',
      badgeVariant: 'default' as const
    },
    remark: {
      icon: AlertCircle,
      label: 'Замечание',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      badgeVariant: 'destructive' as const
    },
    task: {
      icon: CheckCircle,
      label: 'Задание',
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/20',
      iconColor: 'text-primary',
      badgeVariant: 'secondary' as const
    }
  }

  const config = typeConfig[activity.type]
  const Icon = config.icon

  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-200 hover:shadow-md border-l-4',
      config.borderColor
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            config.bgColor
          )}>
            <Icon className={cn('h-5 w-5', config.iconColor)} />
          </div>
          
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge variant={config.badgeVariant} className="mb-2">
                  {config.label}
                </Badge>
                {activity.taskTitle && (
                  <p className="text-sm font-medium text-foreground">
                    {activity.taskTitle}
                  </p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activity.description}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-md text-sm font-semibold',
                  isPositive && 'bg-emerald-100 text-emerald-700',
                  isNegative && 'bg-red-100 text-red-700',
                  !isPositive && !isNegative && 'bg-secondary text-muted-foreground'
                )}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : isNegative ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : null}
                  {isPositive ? '+' : ''}{activity.scoreChange}
                </div>
                <span className="text-xs text-muted-foreground">
                  Итого: {activity.scoreAfter}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(activity.date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {activity.employeeName}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
