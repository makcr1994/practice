'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScoreChart } from '@/components/score-chart'
import { ScoreMeter } from '@/components/score-meter'
import { 
  getStudentById, 
  getStudentActivities, 
  getStudentScoreHistory,
  getStudentAchievements,
  getStudentRemarks
} from '@/lib/mock-data'
import { getScoreLevelLabel, getScoreLevel } from '@/lib/types'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText, 
  Download,
  Printer,
  ChevronRight,
  Award,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Filter
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils'

export default function StudentReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  
  const student = getStudentById(id)
  const allActivities = getStudentActivities(id)
  const scoreHistory = getStudentScoreHistory(id)
  const achievements = getStudentAchievements(id)
  const remarks = getStudentRemarks(id)

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Студент не найден</h2>
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

  // Filter activities
  const filteredActivities = allActivities.filter(activity => {
    const activityDate = new Date(activity.date)
    const matchesDateFrom = !dateFrom || activityDate >= new Date(dateFrom)
    const matchesDateTo = !dateTo || activityDate <= new Date(dateTo)
    const matchesType = typeFilter === 'all' || activity.type === typeFilter
    return matchesDateFrom && matchesDateTo && matchesType
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen pb-12 print:bg-white print:pb-0">
      {/* Header - hidden in print */}
      <div className="border-b border-border bg-card print:hidden">
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
                <Link href={`/students/${id}`} className="hover:text-foreground transition-colors">
                  {student.lastName} {student.firstName[0]}.
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">Отчёт</span>
              </nav>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Печать</span>
              </Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Экспорт PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 print:px-0 print:py-0">
        {/* Report Header */}
        <div className="mb-8 print:mb-4">
          <div className="flex items-start gap-6 print:gap-4">
            <Avatar className="h-20 w-20 border-4 border-primary/20 print:h-16 print:w-16">
              <AvatarImage src={student.photoUrl} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground print:text-xl">{fullName}</h1>
              <p className="text-muted-foreground mt-1">{student.direction}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                <Badge variant="secondary">{student.group}</Badge>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(student.practiceStart).toLocaleDateString('ru-RU')} — {new Date(student.practiceEnd).toLocaleDateString('ru-RU')}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-4 w-4" />
                  {student.supervisorName}
                </span>
              </div>
            </div>
            <div className="text-right">
              <Badge 
                variant={student.status === 'active' ? 'default' : 'secondary'}
                className={cn(
                  'text-sm py-1 px-3',
                  student.status === 'active' && 'bg-accent text-accent-foreground'
                )}
              >
                {student.status === 'active' ? 'Практика активна' : 'Практика завершена'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 print:grid-cols-3 print:gap-4">
          {/* Left Column - Stats */}
          <div className="space-y-6 print:space-y-4">
            {/* Score Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Итоговый балл</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreMeter score={student.score} size="md" />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">Достижения</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{achievements.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium">Замечания</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">{remarks.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Всего записей</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{allActivities.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Key Achievements */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" />
                  Ключевые достижения
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <ul className="space-y-2">
                    {achievements.slice(0, 5).map(ach => (
                      <li key={ach.id} className="text-sm text-muted-foreground flex gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{ach.description}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Нет записей</p>
                )}
              </CardContent>
            </Card>

            {/* Main Remarks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  Основные замечания
                </CardTitle>
              </CardHeader>
              <CardContent>
                {remarks.length > 0 ? (
                  <ul className="space-y-2">
                    {remarks.slice(0, 5).map(rem => (
                      <li key={rem.id} className="text-sm text-muted-foreground flex gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{rem.description}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Нет записей</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chart & Table */}
          <div className="lg:col-span-2 space-y-6 print:space-y-4">
            {/* Score Chart */}
            <ScoreChart 
              data={scoreHistory} 
              title="Динамика изменения баллов"
              description="График изменения баллов за весь период практики"
            />

            {/* Filters - hidden in print */}
            <Card className="print:hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Фильтры записей
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Дата от</Label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Дата до</Label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Тип события</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Все типы" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все типы</SelectItem>
                        <SelectItem value="achievement">Достижения</SelectItem>
                        <SelectItem value="remark">Замечания</SelectItem>
                        <SelectItem value="task">Задания</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">История записей</CardTitle>
                <CardDescription>
                  Подробная история всех выполненных заданий и действий
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Дата</TableHead>
                        <TableHead className="w-[100px]">Тип</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead className="w-[140px]">Сотрудник</TableHead>
                        <TableHead className="w-[80px] text-right">Балл</TableHead>
                        <TableHead className="w-[80px] text-right">Итог</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.length > 0 ? (
                        filteredActivities.map(activity => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                {new Date(activity.date).toLocaleDateString('ru-RU', {
                                  day: '2-digit',
                                  month: '2-digit'
                                })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  activity.type === 'achievement' ? 'default' :
                                  activity.type === 'remark' ? 'destructive' : 'secondary'
                                }
                                className={cn(
                                  'text-xs',
                                  activity.type === 'achievement' && 'bg-emerald-100 text-emerald-700'
                                )}
                              >
                                {activity.type === 'achievement' ? 'Достижение' :
                                 activity.type === 'remark' ? 'Замечание' : 'Задание'}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[300px]">
                              <p className="truncate">{activity.description}</p>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {activity.employeeName}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={cn(
                                'font-semibold',
                                activity.scoreChange > 0 && 'text-emerald-600',
                                activity.scoreChange < 0 && 'text-red-600'
                              )}>
                                {activity.scoreChange > 0 ? '+' : ''}{activity.scoreChange}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {activity.scoreAfter}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Нет записей за выбранный период
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
