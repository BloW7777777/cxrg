import React, { useState, useRef, useEffect } from 'react'
import { Send, CornerDownRight, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  showInsertButton?: boolean
}

interface AICopilotProps {
  className?: string
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: '帮我写一段给老烟民的医嘱',
  },
  {
    id: '2',
    role: 'assistant',
    content: '建议患者严格戒烟，并定期复查胸部低剂量CT。若出现咳嗽、咳痰加重或痰中带血等症状，应及时就诊。建议患者保持良好的生活习惯，加强营养，适当进行有氧运动，增强机体免疫力。',
    showInsertButton: true,
  },
]

const AICopilot: React.FC<AICopilotProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue('')

    // 模拟 AI 回复
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '正在分析您的请求，请稍候...',
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInsertToDiagnosis = (content: string) => {
    // 实际应用中这里会调用回调函数将内容插入到报告编辑器
    console.log('插入到诊断:', content)
  }

  return (
    <div className={cn('h-full flex flex-col bg-slate-900/20', className)}>
      {/* 标题栏 */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/50">
        <Bot className="w-5 h-5 text-cyan-400" />
        <h2 className="text-sm font-semibold text-slate-200">AI 副驾驶</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-500">在线</span>
        </div>
      </div>

      {/* 聊天记录区 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-md'
                  : 'bg-slate-800/80 text-slate-300 rounded-bl-md border border-slate-700/50'
              )}
            >
              {/* 消息头 */}
              <div className="flex items-center gap-2 mb-2">
                {message.role === 'user' ? (
                  <User className="w-3.5 h-3.5 opacity-70" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span className="text-xs opacity-70">
                  {message.role === 'user' ? '医生' : 'AI 助手'}
                </span>
              </div>

              {/* 消息内容 */}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>

              {/* 插入到诊断按钮 */}
              {message.role === 'assistant' && message.showInsertButton && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 h-7 px-2"
                    onClick={() => handleInsertToDiagnosis(message.content)}
                  >
                    <CornerDownRight className="w-3 h-3 mr-1" />
                    插入至诊断
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 底部输入区 */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
        <div className="flex gap-2">
          <Input
            placeholder="输入您的问题..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          AI 辅助诊断 · 请结合临床实际情况
        </p>
      </div>
    </div>
  )
}

export default AICopilot
