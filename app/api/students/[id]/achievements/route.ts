import { NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getCurrentUser, getUserById, formatUserName } from '@/lib/auth'
import type { ActivityRecord } from '@/lib/types'

interface DbAchievement {
  id: string
  student_id: string
  description: string
  score_change: number
  score_after: number
  employee_name: string
  created_at: Date
}

function mapAchievement(row: DbAchievement): ActivityRecord {
  return {
    id: row.id,
    studentId: row.student_id,
    date: row.created_at.toISOString(),
    type: 'achievement',
    description: row.description,
    employeeName: row.employee_name,
    scoreChange: row.score_change,
    scoreAfter: row.score_after
  }
}

// GET - получить достижения студента
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const rows = await query<DbAchievement[]>(
      `SELECT * FROM achievements WHERE student_id = ? ORDER BY created_at DESC`,
      [id]
    )

    return NextResponse.json(rows.map(mapAchievement))
  } catch (error) {
    console.error('Get achievements error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении достижений' },
      { status: 500 }
    )
  }
}

// POST - добавить достижение
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const { id: studentId } = await params
    const { description, scoreChange } = await request.json()

    if (!description || scoreChange === undefined) {
      return NextResponse.json(
        { error: 'Описание и изменение баллов обязательны' },
        { status: 400 }
      )
    }

    // Проверяем существование студента и получаем текущий балл
    const student = await queryOne<{ id: string; score: number }>(
      'SELECT id, score FROM students WHERE id = ?',
      [studentId]
    )
    if (!student) {
      return NextResponse.json({ error: 'Студент не найден' }, { status: 404 })
    }

    const newScore = student.score + Math.abs(scoreChange)
    const achievementId = crypto.randomUUID()

    // Получаем имя сотрудника
    const supervisor = await getUserById(user.id)
    const employeeName = supervisor ? formatUserName(supervisor) : user.name

    // Добавляем достижение
    await query(
      `INSERT INTO achievements (id, student_id, description, score_change, score_after, employee_name, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [achievementId, studentId, description, Math.abs(scoreChange), newScore, employeeName, user.id]
    )

    // Обновляем балл студента
    await query('UPDATE students SET score = ? WHERE id = ?', [newScore, studentId])

    // Добавляем запись в историю
    await query(
      `INSERT INTO score_history (student_id, score, change_type, reference_id) VALUES (?, ?, 'achievement', ?)`,
      [studentId, newScore, achievementId]
    )

    const achievement: ActivityRecord = {
      id: achievementId,
      studentId,
      date: new Date().toISOString(),
      type: 'achievement',
      description,
      employeeName,
      scoreChange: Math.abs(scoreChange),
      scoreAfter: newScore
    }

    return NextResponse.json(achievement, { status: 201 })
  } catch (error) {
    console.error('Create achievement error:', error)
    return NextResponse.json(
      { error: 'Ошибка при добавлении достижения' },
      { status: 500 }
    )
  }
}
