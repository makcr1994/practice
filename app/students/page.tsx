'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StudentCard } from '@/components/student-card'
import { students } from '@/lib/mock-data'
import { Search, Filter, SortAsc, SortDesc, Users, LayoutGrid, List } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'

type SortField = 'name' | 'score' | 'date'
type SortOrder = 'asc' | 'desc'
type ViewMode = 'grid' | 'list'

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  
  // Get unique groups for filter
  const groups = [...new Set(students.map(s => s.group))].sort()
  
  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      const fullName = `${student.lastName} ${student.firstName} ${student.middleName}`.toLowerCase()
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                            student.group.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter
      const matchesGroup = groupFilter === 'all' || student.group === groupFilter
      
      return matchesSearch && matchesStatus && matchesGroup
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'name':
          comparison = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
          break
        case 'score':
          comparison = a.score - b.score
          break
        case 'date':
          comparison = new Date(a.practiceStart).getTime() - new Date(b.practiceStart).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Список студентов</h1>
              <p className="text-muted-foreground mt-1">
                Управление и мониторинг производственной практики
              </p>
            </div>
            <Badge variant="outline" className="w-fit text-base py-1.5 px-4">
              <Users className="h-4 w-4 mr-2" />
              {filteredStudents.length} из {students.length}
            </Badge>
          </div>

          {/* Filters Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Фильтры и сортировка
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по ФИО или группе..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="active">Активные</SelectItem>
                      <SelectItem value="completed">Завершившие</SelectItem>
                      <SelectItem value="inactive">Неактивные</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={groupFilter} onValueChange={setGroupFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Группа" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все группы</SelectItem>
                      {groups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">По имени</SelectItem>
                      <SelectItem value="score">По баллам</SelectItem>
                      <SelectItem value="date">По дате начала</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                    {sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Вид:</span>
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="rounded-none"
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="rounded-none"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {(searchQuery || statusFilter !== 'all' || groupFilter !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setStatusFilter('all')
                      setGroupFilter('all')
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Students Grid/List */}
          {filteredStudents.length > 0 ? (
            <div className={cn(
              viewMode === 'grid' 
                ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' 
                : 'flex flex-col gap-3'
            )}>
              {filteredStudents.map((student) => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  compact={viewMode === 'list'} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Студенты не найдены</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  По заданным критериям поиска не найдено ни одного студента. 
                  Попробуйте изменить параметры фильтрации.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setGroupFilter('all')
                  }}
                >
                  Сбросить все фильтры
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
