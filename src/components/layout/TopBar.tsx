import { Bell, ChevronDown, Search } from 'lucide-react'

export function TopBar() {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span className="breadcrumb-team">제품 팀</span>
        <span className="breadcrumb-separator">/</span>
        <span>팀 보드</span>
      </div>
      <div className="topbar-actions">
        <button className="icon-button search-button" aria-label="검색">
          <Search size={18} />
        </button>
        <button className="icon-button notification-button" aria-label="알림">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>
        <button className="user-menu" aria-label="사용자 메뉴">
          <span className="avatar avatar-user">나</span>
          <ChevronDown size={15} />
        </button>
      </div>
    </header>
  )
}
