import type { Student, ActivityRecord, DailyActivity, Supervisor } from './types'

export const supervisors: Supervisor[] = [
  {
    id: 'sup-1',
    firstName: 'Александр',
    lastName: 'Петров',
    middleName: 'Иванович',
    email: 'petrov@university.ru',
    position: 'Старший преподаватель'
  },
  {
    id: 'sup-2',
    firstName: 'Елена',
    lastName: 'Смирнова',
    middleName: 'Владимировна',
    email: 'smirnova@university.ru',
    position: 'Доцент'
  },
  {
    id: 'sup-3',
    firstName: 'Михаил',
    lastName: 'Козлов',
    middleName: 'Сергеевич',
    email: 'kozlov@university.ru',
    position: 'Профессор'
  }
]

export const students: Student[] = [
  {
    id: 'std-1',
    firstName: 'Анна',
    lastName: 'Иванова',
    middleName: 'Сергеевна',
    group: 'ИВТ-21-1',
    direction: 'Информатика и вычислительная техника',
    practiceStart: '2024-02-01',
    practiceEnd: '2024-04-30',
    supervisorId: 'sup-1',
    supervisorName: 'Петров А.И.',
    score: 85,
    status: 'active',
    photoUrl: '/avatars/student-1.jpg'
  },
  {
    id: 'std-2',
    firstName: 'Дмитрий',
    lastName: 'Сидоров',
    middleName: 'Александрович',
    group: 'ИВТ-21-2',
    direction: 'Информатика и вычислительная техника',
    practiceStart: '2024-02-01',
    practiceEnd: '2024-04-30',
    supervisorId: 'sup-1',
    supervisorName: 'Петров А.И.',
    score: 62,
    status: 'active',
    photoUrl: '/avatars/student-2.jpg'
  },
  {
    id: 'std-3',
    firstName: 'Мария',
    lastName: 'Козлова',
    middleName: 'Дмитриевна',
    group: 'ПИ-22-1',
    direction: 'Программная инженерия',
    practiceStart: '2024-02-15',
    practiceEnd: '2024-05-15',
    supervisorId: 'sup-2',
    supervisorName: 'Смирнова Е.В.',
    score: 45,
    status: 'active',
    photoUrl: '/avatars/student-3.jpg'
  },
  {
    id: 'std-4',
    firstName: 'Алексей',
    lastName: 'Новиков',
    middleName: 'Петрович',
    group: 'ИВТ-20-1',
    direction: 'Информатика и вычислительная техника',
    practiceStart: '2023-09-01',
    practiceEnd: '2023-12-31',
    supervisorId: 'sup-3',
    supervisorName: 'Козлов М.С.',
    score: 92,
    status: 'completed',
    photoUrl: '/avatars/student-4.jpg'
  },
  {
    id: 'std-5',
    firstName: 'Екатерина',
    lastName: 'Волкова',
    middleName: 'Андреевна',
    group: 'ПИ-21-2',
    direction: 'Программная инженерия',
    practiceStart: '2024-01-15',
    practiceEnd: '2024-04-15',
    supervisorId: 'sup-2',
    supervisorName: 'Смирнова Е.В.',
    score: 28,
    status: 'active',
    photoUrl: '/avatars/student-5.jpg'
  },
  {
    id: 'std-6',
    firstName: 'Иван',
    lastName: 'Морозов',
    middleName: 'Викторович',
    group: 'ИВТ-22-1',
    direction: 'Информатика и вычислительная техника',
    practiceStart: '2024-03-01',
    practiceEnd: '2024-05-31',
    supervisorId: 'sup-1',
    supervisorName: 'Петров А.И.',
    score: -5,
    status: 'active',
    photoUrl: '/avatars/student-6.jpg'
  }
]

export const activityRecords: ActivityRecord[] = [
  {
    id: 'act-1',
    studentId: 'std-1',
    date: '2024-03-10T09:30:00',
    type: 'achievement',
    description: 'Отлично выполнила задание по разработке модуля авторизации',
    employeeName: 'Петров А.И.',
    scoreChange: 10,
    scoreAfter: 85
  },
  {
    id: 'act-2',
    studentId: 'std-1',
    date: '2024-03-08T14:15:00',
    type: 'task',
    description: 'Разработка REST API для модуля отчётов',
    employeeName: 'Петров А.И.',
    scoreChange: 5,
    scoreAfter: 75,
    taskTitle: 'Разработка API'
  },
  {
    id: 'act-3',
    studentId: 'std-1',
    date: '2024-03-05T11:00:00',
    type: 'remark',
    description: 'Опоздание на рабочее место на 30 минут',
    employeeName: 'Смирнова Е.В.',
    scoreChange: -3,
    scoreAfter: 70
  },
  {
    id: 'act-4',
    studentId: 'std-2',
    date: '2024-03-09T10:00:00',
    type: 'achievement',
    description: 'Успешно завершил этап тестирования приложения',
    employeeName: 'Петров А.И.',
    scoreChange: 8,
    scoreAfter: 62
  },
  {
    id: 'act-5',
    studentId: 'std-2',
    date: '2024-03-07T16:30:00',
    type: 'remark',
    description: 'Некорректное оформление документации',
    employeeName: 'Козлов М.С.',
    scoreChange: -2,
    scoreAfter: 54
  },
  {
    id: 'act-6',
    studentId: 'std-3',
    date: '2024-03-10T13:45:00',
    type: 'task',
    description: 'Реализация интерфейса пользователя',
    employeeName: 'Смирнова Е.В.',
    scoreChange: 7,
    scoreAfter: 45,
    taskTitle: 'UI разработка'
  },
  {
    id: 'act-7',
    studentId: 'std-6',
    date: '2024-03-11T09:00:00',
    type: 'remark',
    description: 'Неявка на рабочее место без уважительной причины',
    employeeName: 'Петров А.И.',
    scoreChange: -10,
    scoreAfter: -5
  },
  {
    id: 'act-8',
    studentId: 'std-4',
    date: '2023-12-20T15:00:00',
    type: 'achievement',
    description: 'Защита итогового проекта с отличной оценкой',
    employeeName: 'Козлов М.С.',
    scoreChange: 15,
    scoreAfter: 92
  }
]

export const dailyActivities: DailyActivity[] = [
  {
    id: 'daily-1',
    studentId: 'std-1',
    date: '2024-03-10',
    task: 'Модуль авторизации',
    action: 'Разработка и тестирование',
    comment: 'Успешно завершено',
    scoreChange: 10
  },
  {
    id: 'daily-2',
    studentId: 'std-1',
    date: '2024-03-09',
    task: 'Документация API',
    action: 'Написание технической документации',
    comment: 'В процессе',
    scoreChange: 3
  },
  {
    id: 'daily-3',
    studentId: 'std-1',
    date: '2024-03-08',
    task: 'REST API',
    action: 'Разработка эндпоинтов',
    comment: 'Выполнено с замечаниями',
    scoreChange: 5
  },
  {
    id: 'daily-4',
    studentId: 'std-2',
    date: '2024-03-10',
    task: 'Тестирование',
    action: 'Написание unit-тестов',
    comment: 'Требует доработки',
    scoreChange: 2
  },
  {
    id: 'daily-5',
    studentId: 'std-2',
    date: '2024-03-09',
    task: 'Код-ревью',
    action: 'Исправление замечаний',
    comment: 'Завершено',
    scoreChange: 4
  }
]

// Score history data for charts
export const scoreHistory: Record<string, { date: string; score: number }[]> = {
  'std-1': [
    { date: '2024-02-01', score: 0 },
    { date: '2024-02-07', score: 15 },
    { date: '2024-02-14', score: 28 },
    { date: '2024-02-21', score: 35 },
    { date: '2024-02-28', score: 48 },
    { date: '2024-03-05', score: 67 },
    { date: '2024-03-08', score: 72 },
    { date: '2024-03-10', score: 85 }
  ],
  'std-2': [
    { date: '2024-02-01', score: 0 },
    { date: '2024-02-07', score: 12 },
    { date: '2024-02-14', score: 25 },
    { date: '2024-02-21', score: 38 },
    { date: '2024-02-28', score: 45 },
    { date: '2024-03-05', score: 52 },
    { date: '2024-03-09', score: 62 }
  ],
  'std-3': [
    { date: '2024-02-15', score: 0 },
    { date: '2024-02-22', score: 10 },
    { date: '2024-03-01', score: 22 },
    { date: '2024-03-08', score: 38 },
    { date: '2024-03-10', score: 45 }
  ],
  'std-4': [
    { date: '2023-09-01', score: 0 },
    { date: '2023-09-15', score: 18 },
    { date: '2023-10-01', score: 35 },
    { date: '2023-10-15', score: 52 },
    { date: '2023-11-01', score: 68 },
    { date: '2023-11-15', score: 78 },
    { date: '2023-12-01', score: 85 },
    { date: '2023-12-20', score: 92 }
  ],
  'std-5': [
    { date: '2024-01-15', score: 0 },
    { date: '2024-02-01', score: 8 },
    { date: '2024-02-15', score: 15 },
    { date: '2024-03-01', score: 22 },
    { date: '2024-03-10', score: 28 }
  ],
  'std-6': [
    { date: '2024-03-01', score: 0 },
    { date: '2024-03-05', score: 5 },
    { date: '2024-03-08', score: 5 },
    { date: '2024-03-11', score: -5 }
  ]
}

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id)
}

export function getStudentActivities(studentId: string): ActivityRecord[] {
  return activityRecords.filter(a => a.studentId === studentId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getStudentDailyActivities(studentId: string): DailyActivity[] {
  return dailyActivities.filter(a => a.studentId === studentId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getStudentScoreHistory(studentId: string): { date: string; score: number }[] {
  return scoreHistory[studentId] || []
}

export function getActiveStudents(): Student[] {
  return students.filter(s => s.status === 'active')
}

export function getStudentAchievements(studentId: string): ActivityRecord[] {
  return activityRecords.filter(a => a.studentId === studentId && a.type === 'achievement')
}

export function getStudentRemarks(studentId: string): ActivityRecord[] {
  return activityRecords.filter(a => a.studentId === studentId && a.type === 'remark')
}
