import { LayoutDashboard, ListChecks, Sparkles } from 'lucide-react'
import type { TeamMember } from '../../types/team'

type SidebarProps = {
  members: TeamMember[]
  activeView: 'my-tasks' | 'team-board'
  onNavigate: (view: 'my-tasks' | 'team-board') => void
}

export function Sidebar({ members, activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark"><Sparkles size={16} /></span>
        <span>workroom</span>
      </div>

      <nav className="primary-nav" aria-label="주요 메뉴">
        <button className={`nav-item ${activeView === 'my-tasks' ? 'active' : ''}`} type="button" onClick={() => onNavigate('my-tasks')}>
          <ListChecks size={17} />
          <span>내 업무</span>
        </button>
        <button className={`nav-item ${activeView === 'team-board' ? 'active' : ''}`} type="button" onClick={() => onNavigate('team-board')}>
          <LayoutDashboard size={17} />
          <span>팀 보드</span>
        </button>
        <button className="nav-item" type="button" onClick={() => onNavigate('team-board')}>
          <span className="nav-dot completed-dot" />
          <span>완료 업무</span>
        </button>
      </nav>

      <div className="sidebar-divider" />
      <p className="sidebar-label">팀원</p>
      <div className="member-list">
        {members.map((member) => (
          <div className="member-row" key={member.id}>
            <span className="avatar avatar-small" style={{ backgroundColor: member.color }}>
              {member.initials}
            </span>
            <span>{member.name}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="workspace-card">
          <span className="workspace-icon">W</span>
          <div>
            <strong>제품 팀</strong>
            <span>5명 · 하나의 보드</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
