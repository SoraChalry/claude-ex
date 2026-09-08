import { Plus } from 'lucide-react'
import { statusMeta } from '../../data/statuses'
import type { Task } from '../../types/task'
import type { TeamMember } from '../../types/team'
import { TaskCard } from './TaskCard'

type KanbanColumnProps = {
  status: (typeof statusMeta)[number]
  tasks: Task[]
  members: TeamMember[]
  onAddTask: (status: Task['status']) => void
  onDeleteTask: (taskId: string) => void
  onDragStart: (taskId: string) => void
  onDropTask: (status: Task['status']) => void
  onOpenTask: (taskId: string) => void
}

export function KanbanColumn({
  status,
  tasks,
  members,
  onAddTask,
  onDeleteTask,
  onDragStart,
  onDropTask,
  onOpenTask,
}: KanbanColumnProps) {
  const isWipColumn = status.id === 'in_progress'
  const isOverWip = isWipColumn && tasks.length > 3

  return (
    <section
      className={`kanban-column column-${status.id}`}
      aria-labelledby={`column-${status.id}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDropTask(status.id)}
    >
      <div className="column-header">
        <div>
          <h2 id={`column-${status.id}`}>{status.label}</h2>
          {isWipColumn && <span className={`wip-count ${isOverWip ? 'wip-over' : ''}`}>{tasks.length} / 권장 한도 3 {isOverWip ? '· 초과' : ''}</span>}
        </div>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            members={members}
            onDelete={onDeleteTask}
            onDragStart={onDragStart}
            onOpen={onOpenTask}
          />
        ))}
        {tasks.length === 0 && <p className="empty-column"><span>아직 업무가 없습니다.</span><small>아래 버튼으로 첫 업무를 추가하세요.</small></p>}
      </div>
      <button className="column-add" type="button" onClick={() => onAddTask(status.id)}>
        <Plus size={15} /> 업무 추가
      </button>
    </section>
  )
}
