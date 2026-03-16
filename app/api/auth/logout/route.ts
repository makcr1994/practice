import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (token) {
      // Удаляем сессию из БД
      await deleteSession(token)
    }

    // Удаляем cookie
    cookieStore.delete('auth-token')

    return NextResponse.json({ message: 'Выход выполнен' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Ошибка при выходе' },
      { status: 500 }
    )
  }
}
