import type { Priority, TaskStatus } from '../types/task'

export const statusMeta: Array<{ id: TaskStatus; label: string; description: string }> = [
  { id: 'backlog', label: '백로그', description: '아직 계획하지 않은 업무' },
  { id: 'planned', label: '예정', description: '이번 계획에 포함된 업무' },
  { id: 'in_progress', label: '진행', description: '현재 작업 중인 업무' },
  { id: 'qa', label: 'QA', description: '확인과 검증이 필요한 업무' },
  { id: 'done', label: '완료', description: '완료되어 보관된 업무' },
]

export const priorityMeta: Record<Priority, { label: string; tone: string }> = {
  urgent: { label: '긴급', tone: 'urgent' },
  high: { label: '높음', tone: 'high' },
  normal: { label: '보통', tone: 'normal' },
  low: { label: '낮음', tone: 'low' },
}
