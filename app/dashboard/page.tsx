'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { students, activityRecords } from '@/lib/mock-data'
import { getScoreColor } from '@/lib/types'
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  Calendar,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.status === 'active').length
  const completedStudents = students.filter(s => s.status === 'completed').length
  const averageScore = Math.round(students.reduce((acc, s) => acc + s.score, 0) / totalStudents)
  
  // Recent activities (last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const recentActivities = activityRecords.filter(a => new Date(a.date) >= weekAgo)

  // Top students
  const topStudents = [...students]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  // Recent activities for display
  const latestActivities = [...activityRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Всего студентов</p>
                <p className="text-3xl font-bold text-foreground mt-1">{totalStudents}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Активных</p>
                <p className="text-3xl font-bold text-foreground mt-1">{activeStudents}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <UserCheck className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Завершили практику</p>
                <p className="text-3xl font-bold text-foreground mt-1">{completedStudents}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <UserX className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Средний балл</p>
                <p className="text-3xl font-bold text-foreground mt-1">{averageScore}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{recentActivities.length}</p>
                <p className="text-sm text-muted-foreground">Новых записей за неделю</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {recentActivities.filter(a => a.type === 'achievement').length}
                </p>
                <p className="text-sm text-muted-foreground">Достижений за неделю</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {recentActivities.filter(a => a.type === 'remark').length}
                </p>
                <p className="text-sm text-muted-foreground">Замечаний за неделю</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Лучшие студенты</CardTitle>
              <CardDescription>Топ-5 по количеству баллов</CardDescription>
            </div>
            <Link href="/dashboard/students">
              <Button variant="ghost" size="sm" className="gap-1">
                Все <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <Link 
                  key={student.id} 
                  href={`/students/${student.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.photoUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {student.lastName[0]}{student.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {student.lastName} {student.firstName}
                    </p>
                    <p className="text-xs text-muted-foreground">{student.group}</p>
                  </div>
                  <span className={cn('text-lg font-bold', getScoreColor(student.score))}>
                    {student.score}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Последняя активность</CardTitle>
              <CardDescription>Недавние записи в системе</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestActivities.map(activity => {
                const student = students.find(s => s.id === activity.studentId)
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
                      activity.type === 'achievement' && 'bg-emerald-100',
                      activity.type === 'remark' && 'bg-red-100',
                      activity.type === 'task' && 'bg-primary/10'
                    )}>
                      <Activity className={cn(
                        'h-5 w-5',
                        activity.type === 'achievement' && 'text-emerald-600',
                        activity.type === 'remark' && 'text-red-600',
                        activity.type === 'task' && 'text-primary'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant={activity.type === 'achievement' ? 'default' : 
                                   activity.type === 'remark' ? 'destructive' : 'secondary'}
                          className={cn(
                            'text-xs',
                            activity.type === 'achievement' && 'bg-emerald-100 text-emerald-700'
                          )}
                        >
                          {activity.type === 'achievement' ? 'Достижение' :
                           activity.type === 'remark' ? 'Замечание' : 'Задание'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {student?.lastName} {student?.firstName}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(activity.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <span className={cn(
                      'text-sm font-semibold shrink-0',
                      activity.scoreChange > 0 && 'text-emerald-600',
                      activity.scoreChange < 0 && 'text-red-600'
                    )}>
                      {activity.scoreChange > 0 ? '+' : ''}{activity.scoreChange}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/add-student">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Добавить студента</span>
              </Button>
            </Link>
            <Link href="/dashboard/scores">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>Управление баллами</span>
              </Button>
            </Link>
            <Link href="/report-generator">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span>Генерация отчёта</span>
              </Button>
            </Link>
            <Link href="/students">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Activity className="h-6 w-6" />
                <span>Все студенты</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
