import React from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Workspace from './pages/Workspace'
import Cases from './pages/Cases'

const SettingsPage: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center text-slate-500">
      <p className="text-lg">系统设置 - 建设中</p>
    </div>
  )
}

const AppLayout: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/workspace" replace />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/workspace" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default AppLayout
