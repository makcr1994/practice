'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Settings,
  FileText,
  Award,
  BarChart3,
  BookOpen
} from 'lucide-react'

const navigation = [
  { name: 'Обзор', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Студенты', href: '/dashboard/students', icon: Users },
  { name: 'Добавить студента', href: '/dashboard/add-student', icon: UserPlus },
  { name: 'Управление баллами', href: '/dashboard/scores', icon: Award },
  { name: 'Генерация отчёта', href: '/report-generator', icon: FileText },
  { name: 'Статистика', href: '/dashboard/stats', icon: BarChart3 },
]

const secondaryNav = [
  { name: 'Инструкция', href: '/instruction', icon: BookOpen },
  { name: 'Настройки', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-16 lg:border-r lg:border-border bg-sidebar">
      <div className="flex flex-col flex-1 overflow-y-auto py-6">
        <nav className="flex-1 px-3 space-y-1">
          <p className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
            Основное
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 transition-colors',
                  isActive ? 'text-sidebar-primary' : ''
                )} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 pt-4 mt-auto border-t border-sidebar-border">
          <p className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
            Дополнительно
          </p>
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
