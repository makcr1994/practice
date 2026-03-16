'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Student } from '@/lib/types'
import { getScoreColor, getScoreLevel, getScoreLevelLabel } from '@/lib/types'
import { ChevronRight, Calendar, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudentCardProps {
  student: Student
  compact?: boolean
}

export function StudentCard({ student, compact = false }: StudentCardProps) {
  const fullName = `${student.lastName} ${student.firstName} ${student.middleName}`
  const initials = `${student.lastName[0]}${student.firstName[0]}`
  const scoreLevel = getScoreLevel(student.score)

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30">
      <CardContent className={cn('p-0', compact ? 'p-4' : '')}>
        <Link href={`/students/${student.id}`} className="block">
          {!compact && (
            <div className="relative h-3 w-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
          )}
          <div className={cn('flex items-center gap-4', compact ? '' : 'p-5')}>
            <Avatar className={cn('border-2 border-primary/20', compact ? 'h-12 w-12' : 'h-16 w-16')}>
              <AvatarImage src={student.photoUrl} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'font-semibold text-foreground truncate group-hover:text-primary transition-colors',
                compact ? 'text-sm' : 'text-base'
              )}>
                {fullName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs font-normal">
                  {student.group}
                </Badge>
                <Badge 
                  variant={student.status === 'active' ? 'default' : 'outline'}
                  className={cn(
                    'text-xs',
                    student.status === 'active' && 'bg-accent text-accent-foreground',
                    student.status === 'completed' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {student.status === 'active' ? 'Активен' : 'Завершено'}
                </Badge>
              </div>
              
              {!compact && (
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {student.supervisorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(student.practiceStart).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className={cn('text-right', compact ? '' : 'min-w-[80px]')}>
                <p className={cn('font-bold', getScoreColor(student.score), compact ? 'text-lg' : 'text-2xl')}>
                  {student.score}
                </p>
                {!compact && (
                  <p className="text-xs text-muted-foreground">
                    {getScoreLevelLabel(scoreLevel)}
                  </p>
                )}
              </div>
              {!compact && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Открыть
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
