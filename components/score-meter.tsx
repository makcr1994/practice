'use client'

import { cn } from '@/lib/utils'
import { getScoreLevel, getScoreLevelLabel, getScoreBgColor } from '@/lib/types'
import { TrendingUp, TrendingDown, Minus, Award, AlertTriangle, Star, Trophy, ThumbsUp, ThumbsDown } from 'lucide-react'

interface ScoreMeterProps {
  score: number
  showLevel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreMeter({ score, showLevel = true, size = 'md' }: ScoreMeterProps) {
  const level = getScoreLevel(score)
  const normalizedScore = Math.max(-20, Math.min(100, score))
  const percentage = ((normalizedScore + 20) / 120) * 100

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const ScoreIcon = () => {
    switch (level) {
      case 'very-low':
        return <AlertTriangle className="h-8 w-8 text-red-500" />
      case 'low':
        return <ThumbsDown className="h-8 w-8 text-orange-500" />
      case 'medium':
        return <Minus className="h-8 w-8 text-amber-500" />
      case 'good':
        return <ThumbsUp className="h-8 w-8 text-yellow-500" />
      case 'high':
        return <Star className="h-8 w-8 text-emerald-500" />
      case 'excellent':
        return <Trophy className="h-8 w-8 text-teal-600" />
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center justify-center rounded-xl p-3 transition-all duration-500',
            level === 'very-low' && 'bg-red-100',
            level === 'low' && 'bg-orange-100',
            level === 'medium' && 'bg-amber-100',
            level === 'good' && 'bg-yellow-100',
            level === 'high' && 'bg-emerald-100',
            level === 'excellent' && 'bg-teal-100'
          )}>
            <ScoreIcon />
          </div>
          <div>
            <p className={cn(
              'font-bold transition-all duration-300',
              size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-2xl',
              level === 'very-low' && 'text-red-600',
              level === 'low' && 'text-orange-500',
              level === 'medium' && 'text-amber-500',
              level === 'good' && 'text-yellow-600',
              level === 'high' && 'text-emerald-500',
              level === 'excellent' && 'text-teal-600'
            )}>
              {score} <span className="text-lg font-normal text-muted-foreground">баллов</span>
            </p>
            {showLevel && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                {score >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-accent" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                {getScoreLevelLabel(level)} результат
              </p>
            )}
          </div>
        </div>
        <Award className={cn(
          'h-12 w-12 transition-all duration-500',
          level === 'excellent' && 'text-teal-500 scale-110',
          level === 'high' && 'text-emerald-400',
          level === 'good' && 'text-yellow-400 scale-95',
          level === 'medium' && 'text-amber-400 scale-90',
          level === 'low' && 'text-orange-400 scale-85 opacity-70',
          level === 'very-low' && 'text-red-400 scale-75 opacity-50'
        )} />
      </div>
      
      <div className="space-y-1">
        <div className={cn('w-full bg-secondary rounded-full overflow-hidden', sizeClasses[size])}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out',
              getScoreBgColor(score)
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>-20</span>
          <span>0</span>
          <span>20</span>
          <span>40</span>
          <span>60</span>
          <span>80</span>
          <span>100</span>
        </div>
      </div>
    </div>
  )
}
