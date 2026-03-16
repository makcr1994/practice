import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { isUsingDemoMode } from '@/lib/db'
import { cookies } from 'next/headers'

// Демо-пользователь для режима без БД
const demoUser = {
  id: 'demo-user',
  email: 'demo@example.com',
  name: 'Демо Пользователь',
  role: 'supervisor' as const
}

export async function GET() {
  try {
    // В демо-режиме проверяем наличие демо-токена
    if (isUsingDemoMode()) {
      const cookieStore = await cookies()
      const token = cookieStore.get('auth-token')
      
      if (token?.value === 'demo-token') {
        return NextResponse.json({ user: demoUser })
      }
      
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    // В случае ошибки БД проверяем демо-токен
    if ((error as Error).message === 'DEMO_MODE') {
      const cookieStore = await cookies()
      const token = cookieStore.get('auth-token')
      
      if (token?.value === 'demo-token') {
        return NextResponse.json({ user: demoUser })
      }
    }
    
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
