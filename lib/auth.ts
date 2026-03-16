import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query, queryOne } from './db'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 дней

export interface DbUser {
  id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  middle_name: string | null
  position: string | null
  role: 'supervisor' | 'admin'
  created_at: Date
  updated_at: Date
}

export interface SessionUser {
  id: string
  email: string
  name: string
  role: 'supervisor' | 'admin'
}

// Хеширование пароля
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Проверка пароля
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Создание JWT токена
export function createToken(user: SessionUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

// Проверка JWT токена
export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser
  } catch {
    return null
  }
}

// Создание сессии в БД
export async function createSession(userId: string, token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  await query(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  )
}

// Удаление сессии
export async function deleteSession(token: string): Promise<void> {
  await query('DELETE FROM sessions WHERE token = ?', [token])
}

// Проверка сессии в БД
export async function validateSession(token: string): Promise<boolean> {
  const session = await queryOne<{ id: string }>(
    'SELECT id FROM sessions WHERE token = ? AND expires_at > NOW()',
    [token]
  )
  return !!session
}

// Получение пользователя по email
export async function getUserByEmail(email: string): Promise<DbUser | null> {
  return queryOne<DbUser>('SELECT * FROM users WHERE email = ?', [email])
}

// Получение пользователя по ID
export async function getUserById(id: string): Promise<DbUser | null> {
  return queryOne<DbUser>('SELECT * FROM users WHERE id = ?', [id])
}

// Создание нового пользователя
export async function createUser(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  middleName?: string
  position?: string
}): Promise<string> {
  const passwordHash = await hashPassword(data.password)
  const id = crypto.randomUUID()
  
  await query(
    `INSERT INTO users (id, email, password_hash, first_name, last_name, middle_name, position) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, data.email, passwordHash, data.firstName, data.lastName, data.middleName || null, data.position || null]
  )
  
  return id
}

// Получение текущего пользователя из cookies
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) return null
    
    const user = verifyToken(token)
    if (!user) return null
    
    // Проверяем сессию в БД
    const isValid = await validateSession(token)
    if (!isValid) return null
    
    return user
  } catch {
    return null
  }
}

// Форматирование имени пользователя
export function formatUserName(user: DbUser): string {
  const middleInitial = user.middle_name ? ` ${user.middle_name.charAt(0)}.` : ''
  return `${user.last_name} ${user.first_name.charAt(0)}.${middleInitial}`
}
