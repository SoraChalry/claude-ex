import { useEffect, useState } from 'react'
import { Filter, Plus, X } from 'lucide-react'
import { AppShell } from './components/layout/AppShell'
import { KanbanBoard } from './components/board/KanbanBoard'
import { MyTasksView } from './components/task/MyTasksView'
import { TaskDetailPanel } from './components/task/TaskDetailPanel'
import { isDueThisWeek, isDueToday, isOverdue } from './utils/taskDates'
import { supabaseConfigError } from './lib/supabase'
import { fetchTasks, insertTask, removeTask, updateTask } from './utils/taskRepository'
import { loadTasks, saveTasks } from './utils/taskStorage'
import type { Task, TaskStatus } from './types/task'
import { sampleTasks, teamMembers } from './data/sampleData'

const currentUserId = 'me'

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks(sampleTasks))
  const [storageError, setStorageError] = useState(false)
  const [remoteError, setRemoteError] = useState<string | null>(null)
  const [isRemoteReady, setIsRemoteReady] = useState(false)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createStatus, setCreateStatus] = useState<TaskStatus>('backlog')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [activeView, setActiveView] = useState<'my-tasks' | 'team-board'>('team-board')

  const selectedTask = tasks.find((task) => task.id === selectedTaskId)
  const myTasks = tasks.filter((task) => task.assigneeId === currentUserId && task.status !== 'done')
  const overdueCount = myTasks.filter(isOverdue).length
  const todayCount = myTasks.filter(isDueToday).length
  const weekCount = myTasks.filter(isDueThisWeek).length

  useEffect(() => {
    setStorageError(!saveTasks(tasks))
  }, [tasks])

  useEffect(() => {
    let cancelled = false

    async function loadRemoteTasks() {
      if (supabaseConfigError) {
        setRemoteError('Supabase 환경 변수가 없어 로컬 데이터로 실행 중입니다.')
        return
      }

      try {
        const remoteTasks = await fetchTasks()
        if (!cancelled) {
          setTasks(remoteTasks)
          setIsRemoteReady(true)
          setRemoteError(null)
        }
      } catch {
        if (!cancelled) setRemoteError('Supabase 연결에 실패해 로컬 데이터로 실행 중입니다.')
      }
    }

    void loadRemoteTasks()
    return () => { cancelled = true }
  }, [])

  const openCreate = (status: TaskStatus = 'backlog') => {
    setCreateStatus(status)
    setNewTaskTitle('')
    setIsCreateOpen(true)
  }

  const addTask = () => {
    const title = newTaskTitle.trim()
    if (!title) return

    const task: Task = { id: `task-${Date.now()}`, title, type: '업무', status: createStatus, priority: 'normal' }
    setTasks((current) => [...current, task])
    setIsCreateOpen(false)
    if (isRemoteReady) {
      void insertTask(task).catch(() => setRemoteError('업무는 화면에 반영됐지만 Supabase 저장에 실패했습니다.'))
    }
  }

  const deleteTask = (taskId: string) => {
    setTasks((current) => current.filter((task) => task.id !== taskId))
    if (selectedTaskId === taskId) setSelectedTaskId(null)
    if (isRemoteReady) {
      void removeTask(taskId).catch(() => setRemoteError('업무는 화면에서 삭제됐지만 Supabase 삭제에 실패했습니다.'))
    }
  }

  const moveTask = (status: TaskStatus) => {
    if (!draggedTaskId) return
    const task = tasks.find((item) => item.id === draggedTaskId)
    if (!task) return
    const updatedTask = { ...task, status }
    setTasks((current) => current.map((item) => item.id === draggedTaskId ? updatedTask : item))
    setDraggedTaskId(null)
    if (isRemoteReady) {
      void updateTask(updatedTask).catch(() => setRemoteError('업무는 이동됐지만 Supabase 상태 저장에 실패했습니다.'))
    }
  }

  const saveTask = (updatedTask: Task) => {
    setTasks((current) => current.map((task) => task.id === updatedTask.id ? updatedTask : task))
    setSelectedTaskId(null)
    if (isRemoteReady) {
      void updateTask(updatedTask).catch(() => setRemoteError('업무는 화면에 반영됐지만 Supabase 저장에 실패했습니다.'))
    }
  }

  return (
    <AppShell members={teamMembers} activeView={activeView} onNavigate={setActiveView}>
      {storageError && <div className="storage-error" role="status">변경 사항을 브라우저에 저장하지 못했습니다. 이 페이지를 닫기 전에 데이터를 확인해 주세요.</div>}
      {remoteError && <div className="storage-error" role="status">{remoteError}</div>}

      <section className="page-header">
        <div>
          <p className="eyebrow">화요일 · 9월 8일</p>
          <h1>{activeView === 'team-board' ? '팀 보드' : '내 업무'}</h1>
          <p className="page-description">{activeView === 'team-board' ? '이번 주 업무 흐름을 한눈에 확인하세요.' : '오늘 처리해야 할 업무를 우선 확인하세요.'}</p>
        </div>
        <button className="primary-button" type="button" onClick={() => openCreate()}><Plus size={17} /> 새 업무</button>
      </section>

      <section className="summary-strip" aria-label="업무 요약">
        <div className="summary-item summary-overdue"><span className="summary-icon">!</span><div><strong>{overdueCount}</strong><span>지연 업무</span></div></div>
        <div className="summary-item"><span className="summary-icon summary-icon-today">◷</span><div><strong>{todayCount}</strong><span>오늘 마감</span></div></div>
        <div className="summary-item"><span className="summary-icon summary-icon-week">▦</span><div><strong>{weekCount}</strong><span>이번 주 업무</span></div></div>
        <div className="summary-spacer" />
        <button className="filter-button" type="button"><Filter size={15} /> 필터</button>
      </section>

      {activeView === 'team-board' ? (
        <KanbanBoard
          tasks={tasks}
          members={teamMembers}
          onAddTask={openCreate}
          onDeleteTask={deleteTask}
          onDragStart={setDraggedTaskId}
          onDropTask={moveTask}
          onOpenTask={setSelectedTaskId}
        />
      ) : (
        <MyTasksView
          tasks={tasks}
          members={teamMembers}
          onDelete={deleteTask}
          onDragStart={setDraggedTaskId}
          onOpen={setSelectedTaskId}
        />
      )}

      {selectedTask && <TaskDetailPanel task={selectedTask} members={teamMembers} onClose={() => setSelectedTaskId(null)} onSave={saveTask} />}

      {isCreateOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsCreateOpen(false)}>
          <section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header"><div><p className="eyebrow">새 업무</p><h2 id="create-title">업무를 계획해 보세요</h2></div><button className="modal-close" type="button" aria-label="닫기" onClick={() => setIsCreateOpen(false)}><X size={18} /></button></div>
            <label className="form-label" htmlFor="task-title">업무 제목</label>
            <input id="task-title" className="task-title-input" autoFocus value={newTaskTitle} placeholder="예: 결제 화면 QA 진행" onChange={(event) => setNewTaskTitle(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing) addTask() }} />
            <p className="form-hint">제목만 입력해도 업무를 바로 추가할 수 있습니다.</p>
            <div className="modal-footer"><button className="secondary-button" type="button" onClick={() => setIsCreateOpen(false)}>취소</button><button className="primary-button" type="button" onClick={addTask} disabled={!newTaskTitle.trim()}>업무 추가</button></div>
          </section>
        </div>
      )}
    </AppShell>
  )
}

export default App
