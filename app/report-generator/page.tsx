'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { ScoreMeter } from '@/components/score-meter'
import { SimpleScoreChart } from '@/components/score-chart'
import { 
  students, 
  getStudentActivities, 
  getStudentScoreHistory,
  getStudentAchievements,
  getStudentRemarks,
  getStudentDailyActivities
} from '@/lib/mock-data'
import { getScoreLevelLabel, getScoreLevel } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
import { 
  FileText, 
  Download,
  Printer,
  Copy,
  Award,
  AlertCircle,
  Calendar,
  User,
  CheckCircle,
  Activity,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

function generateReportText(student: typeof students[0], achievements: ReturnType<typeof getStudentAchievements>, remarks: ReturnType<typeof getStudentRemarks>, dailyActivities: ReturnType<typeof getStudentDailyActivities>) {
  const fullName = `${student.lastName} ${student.firstName} ${student.middleName}`
  const scoreLevel = getScoreLevel(student.score)
  const scoreLevelLabel = getScoreLevelLabel(scoreLevel)
  
  const practiceStart = new Date(student.practiceStart).toLocaleDateString('ru-RU', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  })
  const practiceEnd = new Date(student.practiceEnd).toLocaleDateString('ru-RU', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  })

  let overallCharacteristic = ''
  if (student.score >= 80) {
    overallCharacteristic = 'продемонстрировал(а) отличные результаты, высокий уровень профессиональных навыков и ответственное отношение к выполнению заданий'
  } else if (student.score >= 60) {
    overallCharacteristic = 'показал(а) хорошие результаты, проявил(а) заинтересованность в профессиональном развитии и ответственный подход к работе'
  } else if (student.score >= 40) {
    overallCharacteristic = 'продемонстрировал(а) удовлетворительные результаты, выполнял(а) поставленные задачи в соответствии с требованиями'
  } else if (student.score >= 20) {
    overallCharacteristic = 'показал(а) результаты ниже ожидаемых, требуется дополнительная работа над профессиональными навыками'
  } else {
    overallCharacteristic = 'продемонстрировал(а) неудовлетворительные результаты, имеются серьезные недостатки в работе'
  }

  let disciplineText = ''
  if (remarks.length === 0) {
    disciplineText = 'За период практики нарушений дисциплины не выявлено. Студент проявлял пунктуальность и ответственность.'
  } else if (remarks.length <= 2) {
    disciplineText = 'За период практики были отмечены незначительные замечания. В целом студент соблюдал дисциплину.'
  } else {
    disciplineText = 'За период практики были зафиксированы неоднократные нарушения дисциплины, что отрицательно сказалось на итоговой оценке.'
  }

  const achievementsList = achievements.length > 0 
    ? achievements.map(a => `- ${a.description}`).join('\n')
    : '- Особых достижений не зафиксировано'

  const remarksList = remarks.length > 0
    ? remarks.map(r => `- ${r.description}`).join('\n')
    : '- Существенных замечаний нет'

  let recommendation = ''
  if (student.score >= 80) {
    recommendation = 'Рекомендуется к защите с оценкой «отлично». Студент может быть рекомендован для дальнейшего трудоустройства в организации.'
  } else if (student.score >= 60) {
    recommendation = 'Рекомендуется к защите с оценкой «хорошо». Студент готов к профессиональной деятельности.'
  } else if (student.score >= 40) {
    recommendation = 'Рекомендуется к защите с оценкой «удовлетворительно». Рекомендуется дополнительная подготовка по профильным дисциплинам.'
  } else {
    recommendation = 'Рекомендуется дополнительное прохождение практики или повторная защита. Требуется серьезная работа над устранением выявленных недостатков.'
  }

  return `ИТОГОВЫЙ ОТЧЁТ
о прохождении производственной практики

Студент: ${fullName}
Группа: ${student.group}
Направление: ${student.direction}
Период практики: ${practiceStart} — ${practiceEnd}
Руководитель практики: ${student.supervisorName}

ОБЩАЯ ХАРАКТЕРИСТИКА

Студент ${fullName} проходил(а) производственную практику в период с ${practiceStart} по ${practiceEnd} и ${overallCharacteristic}.

ДИСЦИПЛИНА И ВОВЛЕЧЁННОСТЬ

${disciplineText}

ВЫПОЛНЕННЫЕ ЗАДАЧИ

За период практики студентом было выполнено ${dailyActivities.length} заданий. Качество выполнения соответствует ${scoreLevelLabel.toLowerCase()} уровню.

СИЛЬНЫЕ СТОРОНЫ

${achievementsList}

ПРОБЛЕМНЫЕ МОМЕНТЫ

${remarksList}

ИТОГОВАЯ ОЦЕНКА

Итоговый балл: ${student.score} из 100 (${scoreLevelLabel} результат)

${recommendation}

Дата составления отчёта: ${new Date().toLocaleDateString('ru-RU', { 
  day: 'numeric', month: 'long', year: 'numeric' 
})}

Руководитель практики: ___________________ / ${student.supervisorName} /`
}

export default function ReportGeneratorPage() {
  const { toast } = useToast()
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [reportText, setReportText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const activeStudents = students.filter(s => s.status === 'active' || s.status === 'completed')
  const selectedStudentData = students.find(s => s.id === selectedStudent)
  
  const achievements = selectedStudent ? getStudentAchievements(selectedStudent) : []
  const remarks = selectedStudent ? getStudentRemarks(selectedStudent) : []
  const activities = selectedStudent ? getStudentActivities(selectedStudent) : []
  const dailyActivities = selectedStudent ? getStudentDailyActivities(selectedStudent) : []
  const scoreHistory = selectedStudent ? getStudentScoreHistory(selectedStudent) : []

  useEffect(() => {
    if (selectedStudentData) {
      setIsGenerating(true)
      // Simulate generation delay
      const timer = setTimeout(() => {
        setReportText(generateReportText(selectedStudentData, achievements, remarks, dailyActivities))
        setIsGenerating(false)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setReportText('')
    }
  }, [selectedStudent])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reportText)
    toast({
      title: 'Скопировано',
      description: 'Текст отчёта скопирован в буфер обмена',
    })
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Отчёт - ${selectedStudentData?.lastName} ${selectedStudentData?.firstName}</title>
            <style>
              body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; }
              pre { white-space: pre-wrap; font-family: inherit; }
            </style>
          </head>
          <body>
            <pre>${reportText}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleRegenerate = () => {
    if (selectedStudentData) {
      setIsGenerating(true)
      setTimeout(() => {
        setReportText(generateReportText(selectedStudentData, achievements, remarks, dailyActivities))
        setIsGenerating(false)
        toast({
          title: 'Отчёт обновлён',
          description: 'Текст отчёта успешно перегенерирован',
        })
      }, 800)
    }
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Генерация итогового отчёта</h1>
            <p className="text-muted-foreground mt-1">
              Автоматическое формирование отчёта по результатам практики
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Student Selection & Preview */}
            <div className="space-y-6">
              {/* Student Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Выбор студента</CardTitle>
                  <CardDescription>Выберите студента для генерации отчёта</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите студента..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activeStudents.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.lastName} {student.firstName} ({student.group})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Student Preview */}
              {selectedStudentData && (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={selectedStudentData.photoUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xl">
                            {selectedStudentData.lastName[0]}{selectedStudentData.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {selectedStudentData.lastName} {selectedStudentData.firstName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{selectedStudentData.group}</p>
                          <Badge 
                            variant={selectedStudentData.status === 'active' ? 'default' : 'secondary'}
                            className={cn(
                              'mt-1',
                              selectedStudentData.status === 'active' && 'bg-accent text-accent-foreground'
                            )}
                          >
                            {selectedStudentData.status === 'active' ? 'Активен' : 'Завершено'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Итоговый балл</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScoreMeter score={selectedStudentData.score} size="sm" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Статистика</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span>Всего записей</span>
                        </div>
                        <span className="font-semibold">{activities.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-emerald-600" />
                          <span>Достижений</span>
                        </div>
                        <span className="font-semibold text-emerald-600">{achievements.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span>Замечаний</span>
                        </div>
                        <span className="font-semibold text-red-600">{remarks.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Выполнено заданий</span>
                        </div>
                        <span className="font-semibold">{dailyActivities.length}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {scoreHistory.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Динамика баллов</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SimpleScoreChart data={scoreHistory} />
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>

            {/* Report Text */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Текст отчёта
                      </CardTitle>
                      <CardDescription>
                        Автоматически сгенерированный отчёт. Вы можете отредактировать его.
                      </CardDescription>
                    </div>
                    {selectedStudent && (
                      <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}>
                        <RefreshCw className={cn('h-4 w-4 mr-2', isGenerating && 'animate-spin')} />
                        Перегенерировать
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!selectedStudent ? (
                    <div className="text-center py-16">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground">Выберите студента</h3>
                      <p className="text-muted-foreground mt-1">
                        Выберите студента из списка слева для генерации отчёта
                      </p>
                    </div>
                  ) : isGenerating ? (
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-6 w-1/4 mt-6" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Label htmlFor="report-text">Содержание отчёта</Label>
                      <Textarea
                        id="report-text"
                        value={reportText}
                        onChange={(e) => setReportText(e.target.value)}
                        className="min-h-[500px] font-mono text-sm"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {selectedStudent && !isGenerating && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3">
                      <Button className="gap-2" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                        Копировать
                      </Button>
                      <Button variant="outline" className="gap-2" onClick={handlePrint}>
                        <Printer className="h-4 w-4" />
                        Печать
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Экспорт PDF
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Экспорт DOCX
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
