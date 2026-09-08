import { useEffect, useState } from 'react'
import { AlertTriangle, CalendarDays, Save, X } from 'lucide-react'
import { priorityMeta, statusMeta } from '../../data/statuses'
import type { Priority, Task, TaskStatus } from '../../types/task'
import type { TeamMember } from '../../types/team'

type TaskDetailPanelProps = {
  task: Task
  members: TeamMember[]
  onClose: () => void
  onSave: (task: Task) => void
}

export function TaskDetailPanel({ task, members, onClose, onSave }: TaskDetailPanelProps) {
  const [draft, setDraft] = useState(task)

  useEffect(() => setDraft(task), [task])

  const update = <K extends keyof Task>(key: K, value: Task[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const save = () => {
    if (!draft.title.trim()) return
    onSave({ ...draft, title: draft.title.trim() })
  }

  return (
    <div className="detail-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="detail-header">
          <div>
            <p className="eyebrow">업무 상세</p>
            <span className="detail-id">{draft.type} · {draft.id}</span>
          </div>
          <button className="modal-close" type="button" aria-label="상세 닫기" onClick={onClose}><X size={18} /></button>
        </header>

        <div className="detail-content">
          <label className="form-label" htmlFor="detail-title">업무 제목</label>
          <input id="detail-title" className="detail-title-input" value={draft.title} onChange={(event) => update('title', event.target.value)} />

          <label className="form-label" htmlFor="detail-description">설명</label>
          <textarea id="detail-description" className="detail-textarea" value={draft.description ?? ''} placeholder="업무에 대한 설명을 적어주세요." onChange={(event) => update('description', event.target.value)} />

          <div className="detail-field-grid">
            <label className="detail-field">
              <span className="form-label">상태</span>
              <select value={draft.status} onChange={(event) => update('status', event.target.value as TaskStatus)}>
                {statusMeta.map((status) => <option key={status.id} value={status.id}>{status.label}</option>)}
              </select>
            </label>
            <label className="detail-field">
              <span className="form-label">우선순위</span>
              <select value={draft.priority} onChange={(event) => update('priority', event.target.value as Priority)}>
                {Object.entries(priorityMeta).map(([id, meta]) => <option key={id} value={id}>{meta.label}</option>)}
              </select>
            </label>
          </div>

          <div className="detail-field-grid">
            <label className="detail-field">
              <span className="form-label">담당자</span>
              <select value={draft.assigneeId ?? ''} onChange={(event) => update('assigneeId', event.target.value || undefined)}>
                <option value="">미지정</option>
                {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
              </select>
            </label>
            <label className="detail-field">
              <span className="form-label"><CalendarDays size={13} /> 마감일</span>
              <input value={draft.dueDate ?? ''} placeholder="예: 9월 12일" onChange={(event) => update('dueDate', event.target.value || undefined)} />
            </label>
          </div>

          <div className={`blocked-editor ${draft.isBlocked ? 'is-active' : ''}`}>
            <label className="blocked-toggle">
              <input type="checkbox" checked={draft.isBlocked ?? false} onChange={(event) => update('isBlocked', event.target.checked)} />
              <span><AlertTriangle size={15} /> 막힌 업무로 표시</span>
            </label>
            {draft.isBlocked && <input className="blocked-reason-input" value={draft.blockedReason ?? ''} placeholder="무엇이 업무를 막고 있나요?" onChange={(event) => update('blockedReason', event.target.value)} />}
          </div>
        </div>

        <footer className="detail-footer">
          <button className="secondary-button" type="button" onClick={onClose}>취소</button>
          <button className="primary-button" type="button" onClick={save}><Save size={15} /> 변경 저장</button>
        </footer>
      </aside>
    </div>
  )
}

export default TaskDetailPanel
