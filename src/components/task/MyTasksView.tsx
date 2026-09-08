import type { ReactNode } from 'react'
import { AlertTriangle, CalendarClock, CalendarDays, ListChecks } from 'lucide-react'
import { isDueThisWeek, isDueToday, isOverdue } from '../../utils/taskDates'
import type { Task } from '../../types/task'
import type { TeamMember } from '../../types/team'
import { TaskCard } from '../board/TaskCard'

type MyTasksViewProps = {
  tasks: Task[]
  members: TeamMember[]
  onDelete: (taskId: string) => void
  onDragStart: (taskId: string) => void
  onOpen: (taskId: string) => void
}

function TaskSection({
  title,
  icon,
  tasks,
  emptyMessage,
  members,
  onDelete,
  onDragStart,
  onOpen,
}: {
  title: string
  icon: ReactNode
  tasks: Task[]
  emptyMessage: string
  members: TeamMember[]
  onDelete: (taskId: string) => void
  onDragStart: (taskId: string) => void
  onOpen: (taskId: string) => void
}) {
  return (
    <section className="my-task-section">
      <div className="my-task-section-header"><h2>{icon}{title}</h2><span>{tasks.length}</span></div>
      {tasks.length > 0 ? (
        <div className="my-task-list">
          {tasks.map((task) => <TaskCard key={task.id} task={task} members={members} onDelete={onDelete} onDragStart={onDragStart} onOpen={onOpen} />)}
        </div>
      ) : <p className="my-task-empty">{emptyMessage}</p>}
    </section>
  )
}

export function MyTasksView({ tasks, members, onDelete, onDragStart, onOpen }: MyTasksViewProps) {
  const mine = tasks.filter((task) => task.assigneeId === 'me' && task.status !== 'done')
  const overdue = mine.filter(isOverdue)
  const today = mine.filter(isDueToday)
  const thisWeek = mine.filter((task) => isDueThisWeek(task) && !overdue.includes(task) && !today.includes(task))

  return (
    <div className="my-tasks-view">
      <div className="my-task-intro">
        <p className="eyebrow">나의 업무</p>
        <h2>오늘 내가 집중할 일</h2>
        <p>마감이 가까운 업무부터 확인하고 오늘의 흐름을 정리하세요.</p>
      </div>
      <div className="my-task-sections">
        <TaskSection title="지연됨" icon={<AlertTriangle size={15} />} tasks={overdue} emptyMessage="지연된 업무가 없습니다." members={members} onDelete={onDelete} onDragStart={onDragStart} onOpen={onOpen} />
        <TaskSection title="오늘 처리할 업무" icon={<CalendarDays size={15} />} tasks={today} emptyMessage="오늘 마감인 업무가 없습니다." members={members} onDelete={onDelete} onDragStart={onDragStart} onOpen={onOpen} />
        <TaskSection title="이번 주 업무" icon={<CalendarClock size={15} />} tasks={thisWeek} emptyMessage="이번 주에 계획된 업무가 없습니다." members={members} onDelete={onDelete} onDragStart={onDragStart} onOpen={onOpen} />
      </div>
      {mine.length === 0 && <div className="my-task-all-empty"><ListChecks size={24} /><strong>현재 맡은 업무가 없습니다.</strong><span>팀 보드에서 업무를 선택해 보세요.</span></div>}
    </div>
  )
}
