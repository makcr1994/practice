'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  BookOpen, 
  Download, 
  Users, 
  Award, 
  FileText,
  Settings,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react'

export default function InstructionPage() {
  return (
    <div className="min-h-screen pb-12">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Инструкция по работе с системой</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Полное руководство по использованию системы учёта и оценки 
              результатов производственной практики студентов
            </p>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Скачать PDF-инструкцию
            </Button>
          </div>

          {/* Quick Start */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Быстрый старт
              </CardTitle>
              <CardDescription>
                Основные шаги для начала работы с системой
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3">
                    1
                  </div>
                  <h3 className="font-semibold">Войдите в систему</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Используйте учётные данные руководителя
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3">
                    2
                  </div>
                  <h3 className="font-semibold">Выберите студента</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Найдите студента в списке или добавьте нового
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3">
                    3
                  </div>
                  <h3 className="font-semibold">Добавьте записи</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Фиксируйте достижения и замечания
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3">
                    4
                  </div>
                  <h3 className="font-semibold">Сформируйте отчёт</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Сгенерируйте итоговый отчёт по практике
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Sections */}
          <Card>
            <CardHeader>
              <CardTitle>Разделы системы</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value="home" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Главная страница</p>
                        <p className="text-sm text-muted-foreground">Список студентов и авторизация</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        На главной странице отображается список всех активных студентов, проходящих практику. 
                        Каждая карточка студента содержит основную информацию: ФИО, группу, текущий балл и статус.
                      </p>
                      <p>
                        <strong>Для гостей:</strong> доступен просмотр списка студентов и переход в профили.
                        Можно добавлять записи о выполнении заданий.
                      </p>
                      <p>
                        <strong>Для руководителей:</strong> после авторизации открывается доступ к панели управления 
                        и расширенным функциям редактирования.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="profile" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                        <User className="h-5 w-5 text-accent" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Профиль студента</p>
                        <p className="text-sm text-muted-foreground">Подробная информация и оценка</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Профильная страница содержит полную информацию о студенте:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Личные данные и фотография</li>
                        <li>Период прохождения практики</li>
                        <li>Назначенный руководитель</li>
                        <li>Текущий балл с визуальной шкалой оценивания</li>
                        <li>История всех записей и достижений</li>
                        <li>Ежедневная активность</li>
                      </ul>
                      <div className="flex gap-2 mt-4">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Достижения
                        </Badge>
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Замечания
                        </Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="scoring" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Система оценивания</p>
                        <p className="text-sm text-muted-foreground">Шкала баллов от -20 до +100</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Система использует балльную шкалу от -20 до +100 баллов. 
                        Начальный балл студента — 0.
                      </p>
                      <div className="grid gap-2 mt-4">
                        <div className="flex items-center gap-2 p-2 rounded bg-red-50">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <span className="font-medium">Очень низкий</span>
                          <span className="text-muted-foreground">менее 0 баллов</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-orange-50">
                          <div className="w-3 h-3 rounded-full bg-orange-500" />
                          <span className="font-medium">Низкий</span>
                          <span className="text-muted-foreground">0-19 баллов</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-amber-50">
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                          <span className="font-medium">Средний</span>
                          <span className="text-muted-foreground">20-39 баллов</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-yellow-50">
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span className="font-medium">Хороший</span>
                          <span className="text-muted-foreground">40-59 баллов</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-emerald-50">
                          <div className="w-3 h-3 rounded-full bg-emerald-500" />
                          <span className="font-medium">Высокий</span>
                          <span className="text-muted-foreground">60-79 баллов</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-teal-50">
                          <div className="w-3 h-3 rounded-full bg-teal-600" />
                          <span className="font-medium">Отличный</span>
                          <span className="text-muted-foreground">80-100 баллов</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dashboard" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Панель руководителя</p>
                        <p className="text-sm text-muted-foreground">Управление студентами и баллами</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Панель управления доступна только авторизованным руководителям практики 
                        и включает следующие функции:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Обзор статистики по всем студентам</li>
                        <li>Добавление новых студентов</li>
                        <li>Управление баллами и записями</li>
                        <li>Активация/деактивация статуса практики</li>
                        <li>Редактирование информации о студентах</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reports" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                        <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Генерация отчётов</p>
                        <p className="text-sm text-muted-foreground">Автоматическое формирование документов</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Система автоматически формирует итоговый отчёт по практике на основе 
                        собранных данных. Отчёт включает:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Общую характеристику студента</li>
                        <li>Оценку дисциплины и вовлечённости</li>
                        <li>Перечень выполненных задач</li>
                        <li>Сильные стороны и достижения</li>
                        <li>Проблемные моменты и замечания</li>
                        <li>Итоговую оценку и рекомендацию</li>
                      </ul>
                      <p className="mt-4">
                        Сформированный отчёт можно отредактировать, скопировать, распечатать 
                        или экспортировать в PDF/DOCX формате.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Roles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Роли и доступы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg border bg-secondary/30">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    Гость
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Просмотр списка студентов
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Просмотр профилей
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Добавление записей о выполнении заданий
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Нет доступа к панели управления
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 text-primary" />
                    Руководитель практики
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Все права гостя
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Добавление и редактирование студентов
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Управление баллами
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Генерация итоговых отчётов
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center">
              <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Нужна помощь?</h3>
              <p className="text-muted-foreground mt-1">
                Если у вас возникли вопросы, обратитесь к администратору системы 
                или руководителю практики.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
