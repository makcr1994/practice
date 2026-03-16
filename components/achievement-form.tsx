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
import { addAchievement } from '@/lib/api'
import { useSWRConfig } from 'swr'

interface AchievementFormProps {
  studentId: string
  onSuccess?: () => void
}

export function AchievementForm({ studentId, onSuccess }: AchievementFormProps) {
  const [description, setDescription] = useState('')
  const [scoreChange, setScoreChange] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

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
      await addAchievement(studentId, { description, scoreChange })
      
      toast({
        title: 'Достижение добавлено',
        description: `Студенту начислено +${scoreChange} баллов`,
      })

      // Revalidate data
      mutate(`/api/students/${studentId}`)
      mutate(`/api/students/${studentId}/achievements`)
      mutate(`/api/students/${studentId}/activities`)
      mutate('/api/students')

      setDescription('')
      setScoreChange(5)
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось добавить достижение',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
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
            <Label htmlFor={`score-ach-${studentId}`}>Количество баллов</Label>
            <Input
              id={`score-ach-${studentId}`}
              type="number"
              min={1}
              max={50}
              value={scoreChange}
              onChange={(e) => setScoreChange(parseInt(e.target.value) || 1)}
              className="bg-background"
              required
            />
            <p className="text-xs text-muted-foreground">
              Автор записи: {user?.name || 'Не авторизован'}
            </p>
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
