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
import { addRemark } from '@/lib/api'
import { useSWRConfig } from 'swr'

interface RemarkFormProps {
  studentId: string
  onSuccess?: () => void
}

export function RemarkForm({ studentId, onSuccess }: RemarkFormProps) {
  const [description, setDescription] = useState('')
  const [scoreChange, setScoreChange] = useState(3)
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
      await addRemark(studentId, { description, scoreChange })
      
      toast({
        title: 'Замечание добавлено',
        description: `У студента списано -${scoreChange} баллов`,
      })

      // Revalidate data
      mutate(`/api/students/${studentId}`)
      mutate(`/api/students/${studentId}/remarks`)
      mutate(`/api/students/${studentId}/activities`)
      mutate('/api/students')

      setDescription('')
      setScoreChange(3)
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось добавить замечание',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
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
            <Label htmlFor={`score-rem-${studentId}`}>Количество баллов</Label>
            <Input
              id={`score-rem-${studentId}`}
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
