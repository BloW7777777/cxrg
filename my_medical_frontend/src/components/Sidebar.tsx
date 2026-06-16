import React from 'react'
import { Monitor, FolderOpen, Settings, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'workspace' as const, icon: Monitor, label: '工作台', path: '/workspace' },
  { id: 'cases' as const, icon: FolderOpen, label: '病例库', path: '/cases' },
  { id: 'settings' as const, icon: Settings, label: '设置', path: '/settings' },
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const activePath = location.pathname

  return (
    <div className="w-16 h-screen bg-slate-900/50 border-r border-slate-800 flex flex-col items-center py-4">
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
        <span className="text-white font-bold text-sm">XR</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePath === item.path
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 relative group',
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full" />
              )}
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          )
        })}
      </nav>

      {/* User Avatar */}
      <div className="mt-auto">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border-2 border-slate-600 hover:border-cyan-500/50 transition-colors cursor-pointer">
          <User className="w-5 h-5 text-slate-300" />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
