'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { students } from '@/lib/mock-data'
import { getScoreColor } from '@/lib/types'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'
import { 
  Search, 
  UserPlus, 
  MoreHorizontal,
  Eye,
  Edit,
  UserCheck,
  UserX,
  FileText,
  Trash2,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DashboardStudentsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  const groups = [...new Set(students.map(s => s.group))].sort()

  const filteredStudents = students.filter(student => {
    const fullName = `${student.lastName} ${student.firstName} ${student.middleName}`.toLowerCase()
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                          student.group.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (studentId: string, newStatus: 'active' | 'inactive') => {
    // In real app, this would call an API
    toast({
      title: 'Статус обновлён',
      description: `Студент ${newStatus === 'active' ? 'активирован' : 'деактивирован'}`,
    })
  }

  const handleDelete = () => {
    // In real app, this would call an API
    toast({
      title: 'Студент удалён',
      description: 'Запись студента успешно удалена из системы',
    })
    setDeleteDialogOpen(false)
    setSelectedStudent(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Управление студентами</h1>
          <p className="text-muted-foreground">Список всех прикреплённых студентов</p>
        </div>
        <Link href="/dashboard/add-student">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Добавить студента
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по ФИО или группе..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="completed">Завершившие</SelectItem>
                <SelectItem value="inactive">Неактивные</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Список студентов</CardTitle>
          <CardDescription>
            Найдено: {filteredStudents.length} из {students.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Студент</TableHead>
                  <TableHead>Группа</TableHead>
                  <TableHead>Руководитель</TableHead>
                  <TableHead>Период практики</TableHead>
                  <TableHead className="text-center">Балл</TableHead>
                  <TableHead className="text-center">Статус</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.photoUrl} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {student.lastName[0]}{student.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {student.lastName} {student.firstName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student.middleName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.group}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.supervisorName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(student.practiceStart).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                          })} — {new Date(student.practiceEnd).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn('text-lg font-bold', getScoreColor(student.score))}>
                          {student.score}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={student.status === 'active' ? 'default' : 'secondary'}
                          className={cn(
                            student.status === 'active' && 'bg-accent text-accent-foreground'
                          )}
                        >
                          {student.status === 'active' ? 'Активен' : 
                           student.status === 'completed' ? 'Завершено' : 'Неактивен'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/students/${student.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Открыть профиль
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/students/${student.id}/report`}>
                                <FileText className="mr-2 h-4 w-4" />
                                Отчёт
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {student.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleStatusChange(student.id, 'inactive')}>
                                <UserX className="mr-2 h-4 w-4" />
                                Деактивировать
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleStatusChange(student.id, 'active')}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Активировать
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setSelectedStudent(student.id)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Студенты не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить студента?</DialogTitle>
            <DialogDescription>
              Это действие нельзя отменить. Все данные студента, включая историю активности 
              и баллы, будут безвозвратно удалены.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
