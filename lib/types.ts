export interface Student {
  id: string
  firstName: string
  lastName: string
  middleName: string
  group: string
  direction: string
  practiceStart: string
  practiceEnd: string
  supervisorId: string
  supervisorName: string
  score: number
  status: 'active' | 'completed' | 'inactive'
  photoUrl: string
}

export interface ActivityRecord {
  id: string
  studentId: string
  date: string
  type: 'achievement' | 'remark' | 'task'
  description: string
  employeeName: string
  scoreChange: number
  scoreAfter: number
  taskTitle?: string
}

export interface DailyActivity {
  id: string
  studentId: string
  date: string
  task: string
  action: string
  comment: string
  scoreChange: number
}

export interface Supervisor {
  id: string
  firstName: string
  lastName: string
  middleName: string
  email: string
  position: string
}

export interface User {
  id: string
  role: 'guest' | 'supervisor'
  name: string
  email?: string
}

export type ScoreLevel = 'very-low' | 'low' | 'medium' | 'good' | 'high' | 'excellent'

export function getScoreLevel(score: number): ScoreLevel {
  if (score < 0) return 'very-low'
  if (score < 20) return 'low'
  if (score < 40) return 'medium'
  if (score < 60) return 'good'
  if (score < 80) return 'high'
  return 'excellent'
}

export function getScoreLevelLabel(level: ScoreLevel): string {
  const labels: Record<ScoreLevel, string> = {
    'very-low': 'Очень низкий',
    'low': 'Низкий',
    'medium': 'Средний',
    'good': 'Хороший',
    'high': 'Высокий',
    'excellent': 'Отличный'
  }
  return labels[level]
}

export function getScoreColor(score: number): string {
  if (score < 0) return 'text-red-600'
  if (score < 20) return 'text-orange-500'
  if (score < 40) return 'text-amber-500'
  if (score < 60) return 'text-yellow-500'
  if (score < 80) return 'text-emerald-500'
  return 'text-teal-600'
}

export function getScoreBgColor(score: number): string {
  if (score < 0) return 'bg-red-500'
  if (score < 20) return 'bg-orange-500'
  if (score < 40) return 'bg-amber-500'
  if (score < 60) return 'bg-yellow-500'
  if (score < 80) return 'bg-emerald-500'
  return 'bg-teal-600'
}
