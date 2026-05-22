import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import PostModal from '../../components/PostModal/PostModal'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [postModalPrefill, setPostModalPrefill] = useState(null)

  const openPostModal = (prefill = null) => {
    setPostModalPrefill(prefill)
    setShowPostModal(true)
  }

  return (
    <div className={`dashboard-layout ${isCollapsed ? 'dashboard-layout--collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(c => !c)}
        onNewPost={() => openPostModal()}
      />
      <main className="dashboard-main">
        {/* Páginas filhas acessam `openPostModal` via useOutletContext() */}
        <Outlet context={{ openPostModal }} />
      </main>

      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        prefill={postModalPrefill}
      />
    </div>
  )
}
