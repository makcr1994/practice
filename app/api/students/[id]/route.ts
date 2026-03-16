import { NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import type { Student } from '@/lib/types'

interface DbStudent {
  id: string
  first_name: string
  last_name: string
  middle_name: string | null
  group_name: string
  direction: string
  practice_start: Date
  practice_end: Date
  supervisor_id: string
  score: number
  status: 'active' | 'completed' | 'inactive'
  photo_url: string | null
  sup_first_name: string
  sup_last_name: string
  sup_middle_name: string | null
}

function mapStudent(row: DbStudent): Student {
  const supMiddleInitial = row.sup_middle_name ? ` ${row.sup_middle_name.charAt(0)}.` : ''
  const supervisorName = `${row.sup_last_name} ${row.sup_first_name.charAt(0)}.${supMiddleInitial}`
  
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    middleName: row.middle_name || '',
    group: row.group_name,
    direction: row.direction,
    practiceStart: row.practice_start.toISOString().split('T')[0],
    practiceEnd: row.practice_end.toISOString().split('T')[0],
    supervisorId: row.supervisor_id,
    supervisorName,
    score: row.score,
    status: row.status,
    photoUrl: row.photo_url || '/avatars/default.jpg'
  }
}

// GET - получить студента по ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const row = await queryOne<DbStudent>(
      `SELECT s.*, u.first_name as sup_first_name, u.last_name as sup_last_name, u.middle_name as sup_middle_name
       FROM students s
       JOIN users u ON s.supervisor_id = u.id
       WHERE s.id = ?`,
      [id]
    )

    if (!row) {
      return NextResponse.json(
        { error: 'Студент не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json(mapStudent(row))
  } catch (error) {
    console.error('Get student error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении данных студента' },
      { status: 500 }
    )
  }
}

// PUT - обновить студента
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    // Проверяем существование студента
    const existing = await queryOne<{ id: string }>('SELECT id FROM students WHERE id = ?', [id])
    if (!existing) {
      return NextResponse.json({ error: 'Студент не найден' }, { status: 404 })
    }

    const updates: string[] = []
    const values: unknown[] = []

    if (data.firstName !== undefined) {
      updates.push('first_name = ?')
      values.push(data.firstName)
    }
    if (data.lastName !== undefined) {
      updates.push('last_name = ?')
      values.push(data.lastName)
    }
    if (data.middleName !== undefined) {
      updates.push('middle_name = ?')
      values.push(data.middleName || null)
    }
    if (data.group !== undefined) {
      updates.push('group_name = ?')
      values.push(data.group)
    }
    if (data.direction !== undefined) {
      updates.push('direction = ?')
      values.push(data.direction)
    }
    if (data.practiceStart !== undefined) {
      updates.push('practice_start = ?')
      values.push(data.practiceStart)
    }
    if (data.practiceEnd !== undefined) {
      updates.push('practice_end = ?')
      values.push(data.practiceEnd)
    }
    if (data.status !== undefined) {
      updates.push('status = ?')
      values.push(data.status)
    }
    if (data.photoUrl !== undefined) {
      updates.push('photo_url = ?')
      values.push(data.photoUrl)
    }

    if (updates.length > 0) {
      values.push(id)
      await query(`UPDATE students SET ${updates.join(', ')} WHERE id = ?`, values)
    }

    // Возвращаем обновлённого студента
    const row = await queryOne<DbStudent>(
      `SELECT s.*, u.first_name as sup_first_name, u.last_name as sup_last_name, u.middle_name as sup_middle_name
       FROM students s
       JOIN users u ON s.supervisor_id = u.id
       WHERE s.id = ?`,
      [id]
    )

    return NextResponse.json(mapStudent(row!))
  } catch (error) {
    console.error('Update student error:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении студента' },
      { status: 500 }
    )
  }
}

// DELETE - удалить студента
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const { id } = await params

    const existing = await queryOne<{ id: string }>('SELECT id FROM students WHERE id = ?', [id])
    if (!existing) {
      return NextResponse.json({ error: 'Студент не найден' }, { status: 404 })
    }

    await query('DELETE FROM students WHERE id = ?', [id])

    return NextResponse.json({ message: 'Студент удалён' })
  } catch (error) {
    console.error('Delete student error:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении студента' },
      { status: 500 }
    )
  }
}
