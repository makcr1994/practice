import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { ActivityRecord } from '@/lib/types'

interface DbActivity {
  id: string
  student_id: string
  description: string
  score_change: number
  score_after: number
  employee_name: string
  created_at: Date
  type: 'achievement' | 'remark'
}

// GET - получить всю активность студента (достижения + замечания)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Объединяем достижения и замечания
    const rows = await query<DbActivity[]>(
      `SELECT id, student_id, description, score_change, score_after, employee_name, created_at, 'achievement' as type
       FROM achievements WHERE student_id = ?
       UNION ALL
       SELECT id, student_id, description, score_change, score_after, employee_name, created_at, 'remark' as type
       FROM remarks WHERE student_id = ?
       ORDER BY created_at DESC`,
      [id, id]
    )

    const activities: ActivityRecord[] = rows.map(row => ({
      id: row.id,
      studentId: row.student_id,
      date: row.created_at.toISOString(),
      type: row.type,
      description: row.description,
      employeeName: row.employee_name,
      scoreChange: row.score_change,
      scoreAfter: row.score_after
    }))

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Get activities error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении активности' },
      { status: 500 }
    )
  }
}
