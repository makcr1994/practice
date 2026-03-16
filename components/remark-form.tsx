'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, Loader2, Plus, User } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface RemarkFormProps {
  studentId: string
  onSuccess?: () => void
}

export function RemarkForm({ studentId, onSuccess }: RemarkFormProps) {
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
      title: 'Замечание добавлено',
      description: 'Запись успешно сохранена в системе',
    })

    setDescription('')
    setEmployeeName('')
    setIsLoading(false)
    onSuccess?.()
  }

  return (
    <Card className="border-red-200 bg-red-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
          Недостатки и ошибки
        </CardTitle>
        <CardDescription>
          Зафиксируйте замечания или нарушения
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`remark-${studentId}`}>Описание замечания</Label>
            <Textarea
              id={`remark-${studentId}`}
              placeholder="Опишите замечание или нарушение..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] bg-background"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`employee-rem-${studentId}`}>ФИО сотрудника</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={`employee-rem-${studentId}`}
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
          <Button type="submit" variant="destructive" className="w-full gap-2" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Добавить замечание
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
