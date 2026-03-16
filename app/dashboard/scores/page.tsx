'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { students, activityRecords, getStudentActivities } from '@/lib/mock-data'
import { getScoreColor } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  Plus,
  Trash2,
  Award,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ScoresPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null)
  const [addScoreDialogOpen, setAddScoreDialogOpen] = useState(false)
  const [newScore, setNewScore] = useState({
    type: 'task',
    description: '',
    scoreChange: ''
  })

  const activeStudents = students.filter(s => s.status === 'active')
  
  const filteredStudents = activeStudents.filter(student => {
    const fullName = `${student.lastName} ${student.firstName} ${student.middleName}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase()) ||
           student.group.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const selectedStudentData = students.find(s => s.id === selectedStudent)
  const studentActivities = selectedStudent ? getStudentActivities(selectedStudent) : []

  const handleAddScore = () => {
    toast({
      title: 'Баллы добавлены',
      description: `Запись успешно добавлена студенту`,
    })
    setAddScoreDialogOpen(false)
    setNewScore({ type: 'task', description: '', scoreChange: '' })
  }

  const handleDeleteRecord = () => {
    toast({
      title: 'Запись удалена',
      description: 'Запись успешно удалена из системы',
    })
    setDeleteDialogOpen(false)
    setRecordToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Управление баллами</h1>
        <p className="text-muted-foreground">Добавление и удаление записей с баллами</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Student Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Выбор студента</CardTitle>
            <CardDescription>Выберите студента для управления баллами</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск студента..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                    selectedStudent === student.id
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-secondary'
                  )}
                >
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
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score Management */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {selectedStudentData 
                    ? `${selectedStudentData.lastName} ${selectedStudentData.firstName}`
                    : 'Записи студента'
                  }
                </CardTitle>
                <CardDescription>
                  {selectedStudentData 
                    ? `Текущий балл: ${selectedStudentData.score}`
                    : 'Выберите студента слева'
                  }
                </CardDescription>
              </div>
              {selectedStudent && (
                <Button className="gap-2" onClick={() => setAddScoreDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Добавить баллы
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedStudent ? (
              studentActivities.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-2">
                  {studentActivities.map(activity => (
                    <AccordionItem 
                      key={activity.id} 
                      value={activity.id}
                      className={cn(
                        'border rounded-lg overflow-hidden',
                        activity.type === 'achievement' && 'border-emerald-200',
                        activity.type === 'remark' && 'border-red-200',
                        activity.type === 'task' && 'border-primary/20'
                      )}
                    >
                      <AccordionTrigger className="px-4 hover:no-underline hover:bg-secondary/50">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                            activity.type === 'achievement' && 'bg-emerald-100',
                            activity.type === 'remark' && 'bg-red-100',
                            activity.type === 'task' && 'bg-primary/10'
                          )}>
                            {activity.type === 'achievement' ? (
                              <Award className="h-4 w-4 text-emerald-600" />
                            ) : activity.type === 'remark' ? (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-medium truncate">{activity.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(activity.date).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                          <span className={cn(
                            'text-sm font-semibold shrink-0 mr-2',
                            activity.scoreChange > 0 && 'text-emerald-600',
                            activity.scoreChange < 0 && 'text-red-600'
                          )}>
                            {activity.scoreChange > 0 ? '+' : ''}{activity.scoreChange}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-3 pt-2">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Тип записи</p>
                              <Badge variant={
                                activity.type === 'achievement' ? 'default' :
                                activity.type === 'remark' ? 'destructive' : 'secondary'
                              } className={activity.type === 'achievement' ? 'bg-emerald-100 text-emerald-700' : ''}>
                                {activity.type === 'achievement' ? 'Достижение' :
                                 activity.type === 'remark' ? 'Замечание' : 'Задание'}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Сотрудник</p>
                              <p className="font-medium">{activity.employeeName}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Изменение балла</p>
                              <p className={cn(
                                'font-bold',
                                activity.scoreChange > 0 && 'text-emerald-600',
                                activity.scoreChange < 0 && 'text-red-600'
                              )}>
                                {activity.scoreChange > 0 ? '+' : ''}{activity.scoreChange}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Итог после</p>
                              <p className="font-bold">{activity.scoreAfter}</p>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              className="gap-2"
                              onClick={() => {
                                setRecordToDelete(activity.id)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Удалить запись
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">У студента пока нет записей</p>
                  <Button className="mt-4 gap-2" onClick={() => setAddScoreDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Добавить первую запись
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Выберите студента из списка слева</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Score Dialog */}
      <Dialog open={addScoreDialogOpen} onOpenChange={setAddScoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить баллы</DialogTitle>
            <DialogDescription>
              Добавьте новую запись с баллами для студента
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Тип записи</Label>
              <Select 
                value={newScore.type} 
                onValueChange={(value) => setNewScore(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Задание</SelectItem>
                  <SelectItem value="achievement">Достижение</SelectItem>
                  <SelectItem value="remark">Замечание</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                placeholder="Опишите выполненное задание или событие..."
                value={newScore.description}
                onChange={(e) => setNewScore(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Изменение баллов</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Например: 5 или -3"
                  value={newScore.scoreChange}
                  onChange={(e) => setNewScore(prev => ({ ...prev, scoreChange: e.target.value }))}
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">баллов</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddScoreDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddScore}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить запись?</DialogTitle>
            <DialogDescription>
              Это действие нельзя отменить. Баллы будут пересчитаны автоматически.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteRecord}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
