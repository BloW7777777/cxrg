import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import ImagePanel from '@/components/workspace/ImagePanel'
import ReportEditor from '@/components/workspace/ReportEditor'
import AICopilot from '@/components/workspace/AICopilot'
import { useAppStore } from '@/store/useAppStore'

const Workspace: React.FC = () => {
  const currentPatient = useAppStore((state) => state.currentPatient)

  return (
    <div className="h-full">
      <PanelGroup direction="horizontal" className="h-full">
        {/* 左栏：阅片区 */}
        <Panel defaultSize={30} minSize={20} maxSize={45}>
          <div className="h-full border-r border-slate-800/50">
            <ImagePanel />
          </div>
        </Panel>

        {/* 可调整大小的分隔条 */}
        <PanelResizeHandle className="w-1 bg-slate-800/50 hover:bg-cyan-500/50 transition-colors cursor-col-resize flex items-center justify-center">
          <div className="w-px h-12 bg-slate-600/50 rounded-full" />
        </PanelResizeHandle>

        {/* 中栏：报告编辑区 */}
        <Panel defaultSize={45} minSize={30} maxSize={60}>
          <ReportEditor currentPatient={currentPatient} />
        </Panel>

        {/* 可调整大小的分隔条 */}
        <PanelResizeHandle className="w-1 bg-slate-800/50 hover:bg-cyan-500/50 transition-colors cursor-col-resize flex items-center justify-center">
          <div className="w-px h-12 bg-slate-600/50 rounded-full" />
        </PanelResizeHandle>

        {/* 右栏：AI 副驾驶区 */}
        <Panel defaultSize={25} minSize={18} maxSize={40}>
          <div className="h-full border-l border-slate-800/50">
            <AICopilot />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default Workspace
