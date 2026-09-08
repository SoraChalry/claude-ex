import { statusMeta } from '../../data/statuses'
import type { Task } from '../../types/task'
import type { TeamMember } from '../../types/team'
import { KanbanColumn } from './KanbanColumn'

// The board stays presentational; task mutations remain owned by App.


type KanbanBoardProps = {
  tasks: Task[]
  members: TeamMember[]
  onAddTask: (status: Task['status']) => void
  onDeleteTask: (taskId: string) => void
  onDragStart: (taskId: string) => void
  onDropTask: (status: Task['status']) => void
  onOpenTask: (taskId: string) => void
}

export function KanbanBoard({
  tasks,
  members,
  onAddTask,
  onDeleteTask,
  onDragStart,
  onDropTask,
  onOpenTask,
}: KanbanBoardProps) {
  return (
    <div className="kanban-scroll" aria-label="팀 칸반 보드">
      <div className="kanban-board">
        {statusMeta.map((status) => (
          <KanbanColumn
            key={status.id}
            status={status}
            tasks={tasks.filter((task) => task.status === status.id)}
            members={members}
            onAddTask={onAddTask}
            onDeleteTask={onDeleteTask}
            onDragStart={onDragStart}
            onDropTask={onDropTask}
            onOpenTask={onOpenTask}
          />
        ))}
      </div>
    </div>
  )
}
