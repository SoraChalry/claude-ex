export type TaskStatus = 'backlog' | 'planned' | 'in_progress' | 'qa' | 'done'

export type Priority = 'urgent' | 'high' | 'normal' | 'low'

export type Task = {
  id: string
  title: string
  type: string
  description?: string
  status: TaskStatus
  assigneeId?: string
  priority: Priority
  dueDate?: string
  checklistCompleted?: number
  checklistTotal?: number
  isBlocked?: boolean
  blockedReason?: string
}
