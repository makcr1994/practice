import { NextResponse } from 'next/server'
import { getUserByEmail, createUser, createToken, createSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, middleName, position } = await request.json()

    // Валидация
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      )
    }

    // Проверяем, не занят ли email
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      )
    }

    // Создаём пользователя
    const userId = await createUser({
      email,
      password,
      firstName,
      lastName,
      middleName,
      position
    })

    // Формируем имя для отображения
    const middleInitial = middleName ? ` ${middleName.charAt(0)}.` : ''
    const displayName = `${lastName} ${firstName.charAt(0)}.${middleInitial}`

    // Создаём токен
    const sessionUser = {
      id: userId,
      email,
      name: displayName,
      role: 'supervisor' as const
    }
    const token = createToken(sessionUser)

    // Сохраняем сессию
    await createSession(userId, token)

    // Устанавливаем cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })

    return NextResponse.json({
      user: sessionUser,
      message: 'Регистрация успешна'
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера при регистрации' },
      { status: 500 }
    )
  }
}
