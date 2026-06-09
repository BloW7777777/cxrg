import React, { useState } from 'react'
import { Upload, ImageIcon, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ImagePanelProps {
  className?: string
}

const ImagePanel: React.FC<ImagePanelProps> = ({ className }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  return (
    <div className={cn('h-full flex flex-col p-4 gap-4 bg-slate-900/30', className)}>
      {/* 顶部标题 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">阅片区</h2>
        <span className="text-xs text-slate-500">DICOM / PNG / JPG</span>
      </div>

      {/* 上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-xl p-4 transition-all duration-200',
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
        )}
      >
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors',
            isDragging ? 'bg-cyan-500/20' : 'bg-slate-700'
          )}>
            <Upload className={cn('w-6 h-6', isDragging ? 'text-cyan-400' : 'text-slate-400')} />
          </div>
          <p className="text-sm text-slate-300 mb-1">拖拽或点击上传胸片</p>
          <p className="text-xs text-slate-500">支持多张图片，请上传正位和侧位片</p>
        </div>
      </div>

      {/* 正位图卡片 */}
      <Card className="flex-1 bg-slate-900/50 border-slate-800 overflow-hidden">
        <CardContent className="p-3 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              正位图 (PA)
            </span>
            <span className="text-xs text-slate-500">未上传</span>
          </div>
          <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center min-h-[120px]">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">等待上传图像</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 生成注意力图按钮 */}
      <Button
        variant="outline"
        className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
      >
        <Sparkles className="w-4 h-4" />
        生成注意力图
      </Button>

      {/* 侧位图卡片 */}
      <Card className="flex-1 bg-slate-900/50 border-slate-800 overflow-hidden">
        <CardContent className="p-3 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              侧位图 (LAT)
            </span>
            <span className="text-xs text-slate-500">未上传</span>
          </div>
          <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center min-h-[120px]">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">等待上传图像</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ImagePanel
