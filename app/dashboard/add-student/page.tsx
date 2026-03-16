'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { createStudent } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  UserPlus, 
  Upload, 
  Calendar, 
  User,
  Loader2,
  ArrowLeft
} from 'lucide-react'

export default function AddStudentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    group: '',
    direction: '',
    practiceStart: '',
    practiceEnd: ''
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо войти в систему',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      await createStudent({
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        group: formData.group,
        direction: formData.direction,
        practiceStart: formData.practiceStart,
        practiceEnd: formData.practiceEnd
      })

      toast({
        title: 'Студент добавлен',
        description: `${formData.lastName} ${formData.firstName} успешно добавлен в систему`,
      })

      router.push('/dashboard/students')
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось добавить студента',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Добавление студента</h1>
          <p className="text-muted-foreground">Заполните данные нового студента</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Персональные данные
            </CardTitle>
            <CardDescription>Основная информация о студенте</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="lastName">Фамилия *</Label>
                <Input
                  id="lastName"
                  placeholder="Иванов"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">Имя *</Label>
                <Input
                  id="firstName"
                  placeholder="Иван"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Отчество</Label>
                <Input
                  id="middleName"
                  placeholder="Иванович"
                  value={formData.middleName}
                  onChange={(e) => handleChange('middleName', e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="group">Группа *</Label>
                <Input
                  id="group"
                  placeholder="ИВТ-21-1"
                  value={formData.group}
                  onChange={(e) => handleChange('group', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direction">Направление *</Label>
                <Input
                  id="direction"
                  placeholder="Информатика и вычислительная техника"
                  value={formData.direction}
                  onChange={(e) => handleChange('direction', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Период практики
            </CardTitle>
            <CardDescription>Даты начала и окончания практики</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="practiceStart">Дата начала *</Label>
                <Input
                  id="practiceStart"
                  type="date"
                  value={formData.practiceStart}
                  onChange={(e) => handleChange('practiceStart', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="practiceEnd">Дата окончания *</Label>
                <Input
                  id="practiceEnd"
                  type="date"
                  value={formData.practiceEnd}
                  onChange={(e) => handleChange('practiceEnd', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Руководитель практики
            </CardTitle>
            <CardDescription>Информация о назначенном руководителе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-secondary">
              <p className="font-medium">Руководитель: {user?.name || 'Не определён'}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Студент будет автоматически прикреплён к текущему авторизованному руководителю
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Фотография
            </CardTitle>
            <CardDescription>Загрузите фотографию студента (опционально)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Перетащите файл сюда или нажмите для выбора
              </p>
              <Button type="button" variant="outline" size="sm">
                Выбрать файл
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG до 5MB
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Отмена
          </Button>
          <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Добавить студента
          </Button>
        </div>
      </form>
    </div>
  )
}
