import mysql from 'mysql2/promise'

// Конфигурация подключения к MariaDB
// Задайте переменные окружения в .env.local:
// DATABASE_HOST=localhost
// DATABASE_PORT=3306
// DATABASE_USER=root
// DATABASE_PASSWORD=your_password
// DATABASE_NAME=practice_tracker

// Режим демонстрации (без базы данных)
// Автоматически включается если DATABASE_HOST не задан или произошла ошибка подключения
export const isDemoMode = !process.env.DATABASE_HOST || process.env.DEMO_MODE === 'true'

const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'practice_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

// Создаём пул соединений для переиспользования
let pool: mysql.Pool | null = null
let connectionFailed = false

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

// Проверка режима работы (демо или с БД)
export function isUsingDemoMode(): boolean {
  return isDemoMode || connectionFailed
}

// Функция для выполнения запросов
export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  if (isDemoMode) {
    throw new Error('DEMO_MODE')
  }
  try {
    const pool = getPool()
    const [rows] = await pool.execute(sql, params)
    return rows as T
  } catch (error) {
    // Если подключение не удалось, переключаемся на демо-режим
    if ((error as { code?: string }).code === 'ECONNREFUSED') {
      connectionFailed = true
      throw new Error('DEMO_MODE')
    }
    throw error
  }
}

// Функция для получения одной записи
export async function queryOne<T>(sql: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T[]>(sql, params)
  return rows[0] || null
}

// Функция для проверки подключения
export async function testConnection(): Promise<boolean> {
  if (isDemoMode) {
    return false
  }
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    connectionFailed = false
    return true
  } catch (error) {
    console.error('Database connection error:', error)
    connectionFailed = true
    return false
  }
}
