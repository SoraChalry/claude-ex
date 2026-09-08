import type { Task } from '../types/task'

const dayMs = 24 * 60 * 60 * 1000

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function parseDueDate(value?: string) {
  if (!value) return null
  if (value === '오늘') return startOfDay(new Date())

  const match = value.match(/(\d{1,2})월\s*(\d{1,2})일/)
  if (!match) return null
  const [, month, day] = match
  const now = new Date()
  return new Date(now.getFullYear(), Number(month) - 1, Number(day)).getTime()
}

export function isDueToday(task: Task) {
  const due = parseDueDate(task.dueDate)
  return due !== null && due === startOfDay(new Date())
}

export function isOverdue(task: Task) {
  const due = parseDueDate(task.dueDate)
  return due !== null && due < startOfDay(new Date()) && task.status !== 'done'
}

export function isDueThisWeek(task: Task) {
  const due = parseDueDate(task.dueDate)
  if (due === null) return false

  const today = startOfDay(new Date())
  const day = new Date(today).getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const weekStart = today + mondayOffset * dayMs
  const weekEnd = weekStart + 7 * dayMs
  return due >= weekStart && due < weekEnd
}
