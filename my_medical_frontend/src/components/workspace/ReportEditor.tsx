import React from 'react'
import { Sparkles, Trash2, Save, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Patient } from '@/lib/api'

interface ReportEditorProps {
  className?: string
  currentPatient?: Patient | null
}

const mockFindingsText = `双侧肺野透亮度正常，未见明显肺气肿征象。肺纹理走行自然，分布均匀，未见异常纹理增多或减少。

双肺门形态、位置正常，未见肿大淋巴结影。纵隔居中，心影大小形态正常。

双侧膈面光滑，肋膈角锐利，未见胸腔积液征象。

胸廓骨质结构完整，未见明显骨质破坏。`

const mockImpressionText = `1. 胸部X线平片未见明显异常。
2. 建议：定期体检，戒烟。`

const ReportEditor: React.FC<ReportEditorProps> = ({ className, currentPatient }) => {
  const patientDisplay = currentPatient
    ? `${currentPatient.name}（患者 ID: ${currentPatient.patient_id}）`
    : '未选择患者，请前往病例库选择'

  return (
    <div className={cn('h-full flex flex-col bg-slate-900/20', className)}>
      {/* 顶部 Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" />
            <span className="font-mono text-slate-200">{patientDisplay}</span>
          </div>
          <Badge variant="warning">未保存</Badge>
        </div>

        {/* 一键生成报告按钮 */}
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20">
          <Sparkles className="w-4 h-4" />
          一键生成报告
        </Button>
      </div>

      {/* 编辑器区域 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* 影像所见区块 */}
          <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-cyan-400 text-lg">■</span>
              <h3 className="text-base font-semibold text-slate-200">影像所见 (Findings)</h3>
            </div>
            <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-line font-mono">
              {mockFindingsText}
            </div>
          </div>

          {/* 影像诊断区块 */}
          <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-emerald-400 text-lg">■</span>
              <h3 className="text-base font-semibold text-slate-200">影像诊断 (Impression)</h3>
            </div>
            <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-line font-mono">
              {mockImpressionText}
            </div>
          </div>
        </div>
      </div>

      {/* 底部固定栏 */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/50 bg-slate-900/50">
        <Button variant="ghost" className="text-slate-400 hover:text-slate-200 hover:bg-slate-800">
          <Trash2 className="w-4 h-4" />
          清空当前
        </Button>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20">
          <Save className="w-4 h-4" />
          保存归档
        </Button>
      </div>
    </div>
  )
}

export default ReportEditor
