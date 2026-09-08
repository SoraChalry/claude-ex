import type { Task } from '../types/task'

const TASKS_KEY = 'workroom.tasks.v1'

export function loadTasks(fallback: Task[]) {
  try {
    const saved = window.localStorage.getItem(TASKS_KEY)
    if (!saved) return fallback
    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed)) return fallback
    return parsed as Task[]
  } catch {
    return fallback
  }
}

export function saveTasks(tasks: Task[]) {
  try {
    window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    return true
  } catch {
    return false
  }
}
