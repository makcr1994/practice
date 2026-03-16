import { NextResponse } from 'next/server'
import { getUserByEmail, verifyPassword, createToken, createSession, formatUserName } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    // Получаем пользователя
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Проверяем пароль
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Создаём токен
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: formatUserName(user),
      role: user.role
    }
    const token = createToken(sessionUser)

    // Сохраняем сессию в БД
    await createSession(user.id, token)

    // Устанавливаем cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 дней
      path: '/'
    })

    return NextResponse.json({
      user: sessionUser,
      message: 'Вход выполнен успешно'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
