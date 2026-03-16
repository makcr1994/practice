import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getCurrentUser, getUserById, formatUserName } from '@/lib/auth'
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
}

function mapStudent(row: DbStudent, supervisorName: string): Student {
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

// GET - получить всех студентов
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const supervisorId = searchParams.get('supervisorId')

    let sql = `
      SELECT s.*, u.first_name as sup_first_name, u.last_name as sup_last_name, u.middle_name as sup_middle_name
      FROM students s
      JOIN users u ON s.supervisor_id = u.id
      WHERE 1=1
    `
    const params: string[] = []

    if (status) {
      sql += ' AND s.status = ?'
      params.push(status)
    }

    if (supervisorId) {
      sql += ' AND s.supervisor_id = ?'
      params.push(supervisorId)
    }

    sql += ' ORDER BY s.last_name, s.first_name'

    const rows = await query<(DbStudent & { sup_first_name: string; sup_last_name: string; sup_middle_name: string | null })[]>(sql, params)
    
    const students: Student[] = rows.map(row => {
      const supMiddleInitial = row.sup_middle_name ? ` ${row.sup_middle_name.charAt(0)}.` : ''
      const supervisorName = `${row.sup_last_name} ${row.sup_first_name.charAt(0)}.${supMiddleInitial}`
      return mapStudent(row, supervisorName)
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Get students error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении списка студентов' },
      { status: 500 }
    )
  }
}

// POST - создать нового студента
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const data = await request.json()
    const {
      firstName,
      lastName,
      middleName,
      group,
      direction,
      practiceStart,
      practiceEnd,
      photoUrl
    } = data

    if (!firstName || !lastName || !group || !direction || !practiceStart || !practiceEnd) {
      return NextResponse.json(
        { error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()
    
    await query(
      `INSERT INTO students (id, first_name, last_name, middle_name, group_name, direction, practice_start, practice_end, supervisor_id, score, status, photo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'active', ?)`,
      [id, firstName, lastName, middleName || null, group, direction, practiceStart, practiceEnd, user.id, photoUrl || null]
    )

    // Добавляем начальную запись в историю баллов
    await query(
      `INSERT INTO score_history (student_id, score, change_type) VALUES (?, 0, 'initial')`,
      [id]
    )

    // Получаем данные руководителя для ответа
    const supervisor = await getUserById(user.id)
    const supervisorName = supervisor ? formatUserName(supervisor) : user.name

    const newStudent: Student = {
      id,
      firstName,
      lastName,
      middleName: middleName || '',
      group,
      direction,
      practiceStart,
      practiceEnd,
      supervisorId: user.id,
      supervisorName,
      score: 0,
      status: 'active',
      photoUrl: photoUrl || '/avatars/default.jpg'
    }

    return NextResponse.json(newStudent, { status: 201 })
  } catch (error) {
    console.error('Create student error:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании студента' },
      { status: 500 }
    )
  }
}
