import useSWR from 'swr'
import type { Student, ActivityRecord } from './types'

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('Ошибка при загрузке данных')
    throw error
  }
  return res.json()
}

// Students hooks
export function useStudents(status?: string) {
  const url = status && status !== 'all' 
    ? `/api/students?status=${status}` 
    : '/api/students'
  return useSWR<Student[]>(url, fetcher)
}

export function useStudent(id: string) {
  return useSWR<Student>(id ? `/api/students/${id}` : null, fetcher)
}

// Activities hooks
export function useStudentActivities(studentId: string) {
  return useSWR<ActivityRecord[]>(
    studentId ? `/api/students/${studentId}/activities` : null, 
    fetcher
  )
}

export function useStudentAchievements(studentId: string) {
  return useSWR<ActivityRecord[]>(
    studentId ? `/api/students/${studentId}/achievements` : null, 
    fetcher
  )
}

export function useStudentRemarks(studentId: string) {
  return useSWR<ActivityRecord[]>(
    studentId ? `/api/students/${studentId}/remarks` : null, 
    fetcher
  )
}

export function useScoreHistory(studentId: string) {
  return useSWR<{ date: string; score: number }[]>(
    studentId ? `/api/students/${studentId}/score-history` : null, 
    fetcher
  )
}

// API functions for mutations
export async function createStudent(data: Partial<Student>): Promise<Student> {
  const res = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Ошибка при создании студента')
  }
  return res.json()
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<Student> {
  const res = await fetch(`/api/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Ошибка при обновлении студента')
  }
  return res.json()
}

export async function deleteStudent(id: string): Promise<void> {
  const res = await fetch(`/api/students/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Ошибка при удалении студента')
  }
}

export async function addAchievement(studentId: string, data: {
  description: string
  scoreChange: number
}): Promise<ActivityRecord> {
  const res = await fetch(`/api/students/${studentId}/achievements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Ошибка при добавлении достижения')
  }
  return res.json()
}

export async function addRemark(studentId: string, data: {
  description: string
  scoreChange: number
}): Promise<ActivityRecord> {
  const res = await fetch(`/api/students/${studentId}/remarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Ошибка при добавлении замечания')
  }
  return res.json()
}
