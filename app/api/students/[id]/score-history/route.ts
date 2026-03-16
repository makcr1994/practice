import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface DbScoreHistory {
  id: string
  student_id: string
  score: number
  change_type: 'achievement' | 'remark' | 'initial'
  reference_id: string | null
  created_at: Date
}

// GET - получить историю баллов студента
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const rows = await query<DbScoreHistory[]>(
      `SELECT * FROM score_history WHERE student_id = ? ORDER BY created_at ASC`,
      [id]
    )

    const history = rows.map(row => ({
      date: row.created_at.toISOString().split('T')[0],
      score: row.score
    }))

    return NextResponse.json(history)
  } catch (error) {
    console.error('Get score history error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении истории баллов' },
      { status: 500 }
    )
  }
}
