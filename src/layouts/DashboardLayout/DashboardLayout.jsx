import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import PostModal from '../../components/PostModal/PostModal'
import SearchModal from '../../components/SearchModal/SearchModal'
import ShortcutsModal from '../../components/ShortcutsModal/ShortcutsModal'
import OnboardingTour from '../../components/OnboardingTour/OnboardingTour'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [postModalPrefill, setPostModalPrefill] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const openPostModal = (prefill = null) => {
    setPostModalPrefill(prefill)
    setShowPostModal(true)
  }

  // Atalhos globais
  useKeyboardShortcuts({
    'mod+k': () => setShowSearch(true),
    '/':     () => setShowSearch(true),
    'n':     () => openPostModal(),
    '?':     () => setShowShortcuts(true),
  })

  return (
    <div className={`dashboard-layout ${isCollapsed ? 'dashboard-layout--collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(c => !c)}
        onNewPost={() => openPostModal()}
        onOpenSearch={() => setShowSearch(true)}
      />
      <main className="dashboard-main">
        <Outlet context={{ openPostModal }} />
      </main>

      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        prefill={postModalPrefill}
      />

      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onNewPost={() => openPostModal()}
      />

      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      <OnboardingTour />
    </div>
  )
}
