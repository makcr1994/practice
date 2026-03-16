'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Award, Loader2, Plus, User } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface AchievementFormProps {
  studentId: string
  onSuccess?: () => void
}

export function AchievementForm({ studentId, onSuccess }: AchievementFormProps) {
  const [description, setDescription] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    toast({
      title: 'Достижение добавлено',
      description: 'Запись успешно сохранена в системе',
    })

    setDescription('')
    setEmployeeName('')
    setIsLoading(false)
    onSuccess?.()
  }

  return (
    <Card className="border-emerald-200 bg-emerald-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          Положительные достижения
        </CardTitle>
        <CardDescription>
          Зафиксируйте успехи и достижения студента
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`achievement-${studentId}`}>Описание достижения</Label>
            <Textarea
              id={`achievement-${studentId}`}
              placeholder="Опишите достижение студента..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] bg-background"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`employee-ach-${studentId}`}>ФИО сотрудника</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={`employee-ach-${studentId}`}
                placeholder={user?.name || 'Введите ФИО сотрудника'}
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            {user && (
              <p className="text-xs text-muted-foreground">
                Оставьте пустым для автозаполнения: {user.name}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Добавить достижение
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
