import { supabase } from '../lib/supabase'
import type { Task, TaskStatus } from '../types/task'

type TaskRow = {
  id: string
  title: string
  type: string
  description: string | null
  status: TaskStatus
  assignee_id: string | null
  priority: Task['priority']
  due_date: string | null
  checklist_completed: number | null
  checklist_total: number | null
  is_blocked: boolean
  blocked_reason: string | null
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    description: row.description ?? undefined,
    status: row.status,
    assigneeId: row.assignee_id ?? undefined,
    priority: row.priority,
    dueDate: row.due_date ?? undefined,
    checklistCompleted: row.checklist_completed ?? undefined,
    checklistTotal: row.checklist_total ?? undefined,
    isBlocked: row.is_blocked,
    blockedReason: row.blocked_reason ?? undefined,
  }
}

function toRow(task: Task): TaskRow {
  return {
    id: task.id,
    title: task.title,
    type: task.type,
    description: task.description ?? null,
    status: task.status,
    assignee_id: task.assigneeId ?? null,
    priority: task.priority,
    due_date: task.dueDate ?? null,
    checklist_completed: task.checklistCompleted ?? null,
    checklist_total: task.checklistTotal ?? null,
    is_blocked: task.isBlocked ?? false,
    blocked_reason: task.blockedReason ?? null,
  }
}

export async function fetchTasks(): Promise<Task[]> {
  if (!supabase) throw new Error('Supabase 환경 변수가 없습니다.')

  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return (data as TaskRow[]).map(toTask)
}

export async function insertTask(task: Task): Promise<Task> {
  if (!supabase) throw new Error('Supabase 환경 변수가 없습니다.')

  const { data, error } = await supabase.from('tasks').insert(toRow(task)).select().single()
  if (error) throw error
  return toTask(data as TaskRow)
}

export async function updateTask(task: Task): Promise<Task> {
  if (!supabase) throw new Error('Supabase 환경 변수가 없습니다.')

  const { data, error } = await supabase.from('tasks').update(toRow(task)).eq('id', task.id).select().single()
  if (error) throw error
  return toTask(data as TaskRow)
}

export async function removeTask(taskId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase 환경 변수가 없습니다.')

  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) throw error
}
