import type { ReactNode } from 'react'
import type { TeamMember } from '../../types/team'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

type AppShellProps = {
  members: TeamMember[]
  activeView: 'my-tasks' | 'team-board'
  onNavigate: (view: 'my-tasks' | 'team-board') => void
  children: ReactNode
}

export function AppShell({ members, activeView, onNavigate, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar members={members} activeView={activeView} onNavigate={onNavigate} />
      <div className="app-main">
        <TopBar />
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
