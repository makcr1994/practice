'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { ScoreMeter } from '@/components/score-meter'
import { ActivityItem } from '@/components/activity-item'
import { AchievementForm } from '@/components/achievement-form'
import { RemarkForm } from '@/components/remark-form'
import { useStudent, useStudentActivities } from '@/lib/api'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MapPin, 
  FileText, 
  Plus,
  BookOpen,
  Clock,
  Search,
  Activity,
  Award,
  AlertCircle,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  
  const { data: student, isLoading: studentLoading } = useStudent(id)
  const { data: activities = [] } = useStudentActivities(id)
  
  // Daily activities - for now using empty array, can be extended
  const dailyActivities: { id: string; date: string; task: string; action: string; comment: string; scoreChange: number }[] = []

  if (studentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Загрузка данных студента...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Студент не найден</h2>
            <p className="text-muted-foreground mt-2">
              Студент с указанным ID не существует в системе
            </p>
            <Button onClick={() => router.push('/students')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              К списку студентов
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const fullName = `${student.lastName} ${student.firstName} ${student.middleName}`
  const initials = `${student.lastName[0]}${student.firstName[0]}`
  const achievements = activities.filter(a => a.type === 'achievement')
  const remarks = activities.filter(a => a.type === 'remark')

  // Filter daily activities
  const filteredDailyActivities = dailyActivities.filter(activity => {
    const matchesSearch = activity.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.action.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = !dateFilter || activity.date === dateFilter
    return matchesSearch && matchesDate
  })

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">Главная</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/students" className="hover:text-foreground transition-colors">Студенты</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">{student.lastName} {student.firstName[0]}.</span>
              </nav>
            </div>
            <div className="flex gap-2">
              <Link href={`/students/${id}/report`}>
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Полный отчёт</span>
                </Button>
              </Link>
              <Link href="/instruction">
                <Button variant="ghost" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Инструкция</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={student.photoUrl} alt={fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="mt-4 text-xl font-bold text-foreground">{fullName}</h1>
                  <Badge 
                    variant={student.status === 'active' ? 'default' : 'secondary'}
                    className={cn(
                      'mt-2',
                      student.status === 'active' && 'bg-accent text-accent-foreground'
                    )}
                  >
                    {student.status === 'active' ? 'Активен' : 'Практика завершена'}
                  </Badge>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Группа / Направление</p>
                      <p className="font-medium">{student.group}</p>
                      <p className="text-xs text-muted-foreground">{student.direction}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Период практики</p>
                      <p className="font-medium">
                        {new Date(student.practiceStart).toLocaleDateString('ru-RU')} — {new Date(student.practiceEnd).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Руководитель</p>
                      <p className="font-medium">{student.supervisorName}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Оценка результатов</CardTitle>
                <CardDescription>Шкала от -20 до +100 баллов</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoreMeter score={student.score} size="lg" />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-emerald-50">
                    <div className="flex items-center justify-center gap-1 text-emerald-600">
                      <Award className="h-4 w-4" />
                      <span className="text-2xl font-bold">{achievements.length}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Достижений</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-50">
                    <div className="flex items-center justify-center gap-1 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-2xl font-bold">{remarks.length}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Замечаний</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="records" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="records" className="gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Записи</span>
                </TabsTrigger>
                <TabsTrigger value="daily" className="gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">По дням</span>
                </TabsTrigger>
                <TabsTrigger value="add" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Добавить</span>
                </TabsTrigger>
              </TabsList>

              {/* Records Tab */}
              <TabsContent value="records" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">История записей</CardTitle>
                    <CardDescription>
                      Все достижения, замечания и выполненные задания
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activities.length > 0 ? (
                      activities.map(activity => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Записей пока нет</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Daily Activity Tab */}
              <TabsContent value="daily" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ежедневная активность</CardTitle>
                    <CardDescription>
                      Лента активности студента по дням
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Поиск по действиям..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full sm:w-[180px]"
                      />
                    </div>

                    {filteredDailyActivities.length > 0 ? (
                      <div className="space-y-3">
                        {filteredDailyActivities.map(activity => (
                          <Card key={activity.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">
                                      {new Date(activity.date).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'short'
                                      })}
                                    </Badge>
                                    <h4 className="font-medium">{activity.task}</h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                                  {activity.comment && (
                                    <p className="text-xs text-muted-foreground mt-1 italic">
                                      {activity.comment}
                                    </p>
                                  )}
                                </div>
                                <Badge 
                                  variant={activity.scoreChange >= 0 ? 'default' : 'destructive'}
                                  className={activity.scoreChange > 0 ? 'bg-emerald-100 text-emerald-700' : ''}
                                >
                                  {activity.scoreChange > 0 ? '+' : ''}{activity.scoreChange}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Нет записей за выбранный период</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Add Record Tab */}
              <TabsContent value="add" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <AchievementForm studentId={id} />
                  <RemarkForm studentId={id} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
