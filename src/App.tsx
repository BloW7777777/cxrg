import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Workspace from './pages/Workspace'

type NavItem = 'workspace' | 'cases' | 'settings'

const AppLayout: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavItem>('workspace')

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* 左侧固定侧边栏 */}
      <Sidebar activeItem={activeNav} onNavigate={setActiveNav} />

      {/* 主内容区 */}
      <main className="flex-1 overflow-hidden">
        {activeNav === 'workspace' && <Workspace />}
        {activeNav === 'cases' && (
          <div className="h-full flex items-center justify-center text-slate-500">
            <p className="text-lg">病例管理中心 - 建设中</p>
          </div>
        )}
        {activeNav === 'settings' && (
          <div className="h-full flex items-center justify-center text-slate-500">
            <p className="text-lg">系统设置 - 建设中</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default AppLayout
