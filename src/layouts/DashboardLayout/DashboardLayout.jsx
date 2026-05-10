import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import PostModal from '../../components/PostModal/PostModal'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)

  return (
    <div className={`dashboard-layout ${isCollapsed ? 'dashboard-layout--collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(c => !c)}
        onNewPost={() => setShowPostModal(true)}
      />
      <main className="dashboard-main">
        <Outlet />
      </main>

      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
      />
    </div>
  )
}
