import { AlertTriangle, CalendarDays, Check, Trash2, UserRound } from 'lucide-react'
import { priorityMeta, statusMeta } from '../../data/statuses'
import { isOverdue } from '../../utils/taskDates'
import type { Task } from '../../types/task'
import type { TeamMember } from '../../types/team'

type TaskCardProps = {
  task: Task
  members: TeamMember[]
  onDelete: (taskId: string) => void
  onDragStart: (taskId: string) => void
  onOpen: (taskId: string) => void
}

export function TaskCard({ task, members, onDelete, onDragStart, onOpen }: TaskCardProps) {
  const assignee = members.find((member) => member.id === task.assigneeId)
  const priority = priorityMeta[task.priority]
  const status = statusMeta.find((item) => item.id === task.status)
  const overdue = isOverdue(task)

  return (
    <article
      className={`task-card ${task.isBlocked ? 'is-blocked' : ''} ${overdue ? 'is-overdue' : ''}`}
      draggable
      onDragStart={() => onDragStart(task.id)}
    >
      <div className="task-card-heading">
        <span className="task-type">{task.type}</span>
        <div className="task-card-actions">
          {overdue && <span className="overdue-label">지연</span>}
          {task.isBlocked && (
            <span className="blocked-label"><AlertTriangle size={13} /> 막힘</span>
          )}
          <button
            className="delete-task-button"
            type="button"
            aria-label={`${task.title} 삭제`}
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <button className="task-card-open" type="button" onClick={() => onOpen(task.id)}>
        <h3>{task.title}</h3>
      </button>
      <div className="task-card-meta">
        <span className="status-meta"><span className={`status-marker status-${task.status}`} /> {status?.label}</span>
        <span className="assignee-meta">
          {assignee ? (
            <span className="avatar avatar-tiny" style={{ backgroundColor: assignee.color }}>
              {assignee.initials}
            </span>
          ) : <UserRound size={14} />}
          {assignee?.name ?? '미지정'}
        </span>
        <span className={`priority-badge priority-${priority.tone}`}>
          <span className="priority-dot" />
          {priority.label}
        </span>
      </div>
      <div className="task-card-footer">
        {task.dueDate && (
          <span className={`due-date ${task.dueDate === '오늘' ? 'due-today' : ''}`}>
            <CalendarDays size={13} /> {task.dueDate}
          </span>
        )}
        {task.checklistTotal && (
          <span className="checklist-progress">
            <Check size={13} /> {task.checklistCompleted}/{task.checklistTotal}
          </span>
        )}
      </div>
    </article>
  )
}
