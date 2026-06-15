import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Search, FileText, Stethoscope, RefreshCw, User, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { api, Patient, Report, CreatePatientPayload } from '@/lib/api'

// ----------------------------------------------------------------
// 辅助：防抖 Hook
// ----------------------------------------------------------------
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// ----------------------------------------------------------------
// 辅助：时间格式化
// ----------------------------------------------------------------
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function generatePatientId(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `P${dateStr}${rand}`
}

// ----------------------------------------------------------------
// 报告抽屉组件
// ----------------------------------------------------------------
interface ReportsDrawerProps {
  patient: Patient | null
  open: boolean
  onClose: () => void
}

function ReportsDrawer({ patient, open, onClose }: ReportsDrawerProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !patient) return
    setLoading(true)
    setError(null)
    api
      .getReportsByPatient(patient.patient_id)
      .then(setReports)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [open, patient])

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            {patient?.name} 的历史报告
          </SheetTitle>
          <SheetDescription>
            共 {reports.length} 份报告 · 患者 ID: {patient?.patient_id}
          </SheetDescription>
        </SheetHeader>

        {loading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            加载中...
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
            <FileText className="h-10 w-10 opacity-30" />
            <p>暂无历史报告</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {reports.map((r) => (
            <div
              key={r.report_id}
              className="rounded-lg border border-slate-700/60 bg-slate-800/40 p-4 space-y-2 hover:border-blue-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">{r.report_id}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(r.created_at)}
                </span>
              </div>

              {r.findings && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">影像所见</p>
                  <p className="text-sm text-slate-200 leading-relaxed">{r.findings}</p>
                </div>
              )}

              {r.impression && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">影像诊断</p>
                  <p className="text-sm text-blue-300 leading-relaxed">{r.impression}</p>
                </div>
              )}

              {r.ai_advice && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">医嘱建议</p>
                  <p className="text-sm text-emerald-400 leading-relaxed">{r.ai_advice}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ----------------------------------------------------------------
// 新建患者对话框组件
// ----------------------------------------------------------------
interface NewPatientDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: (patient: Patient) => void
}

function NewPatientDialog({ open, onClose, onSuccess }: NewPatientDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    patient_id: '',
    name: '',
    gender: '男',
    age: '',
  })

  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, patient_id: generatePatientId(), name: '', age: '' }))
      setError(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('姓名不能为空')
      return
    }
    const age = parseInt(form.age, 10)
    if (isNaN(age) || age < 0 || age > 150) {
      setError('请输入有效的年龄')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const payload: CreatePatientPayload = {
        patient_id: form.patient_id,
        name: form.name.trim(),
        gender: form.gender,
        age,
      }
      const patient = await api.createPatient(payload)
      onSuccess(patient)
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            录入新患者
          </DialogTitle>
          <DialogDescription>
            填写患者基本信息，系统将自动生成患者编号。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="patient_id">患者编号</Label>
            <Input
              id="patient_id"
              value={form.patient_id}
              readOnly
              className="bg-slate-800 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              placeholder="请输入患者姓名"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="gender">性别</Label>
              <Select
                id="gender"
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              >
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="其他">其他</option>
              </Select>
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="age">年龄</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="150"
                placeholder="年龄"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500/30 p-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '提交中...' : '确认录入'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ----------------------------------------------------------------
// 主页面
// ----------------------------------------------------------------
interface CasesProps {
  onConsult?: (patientId: string) => void
}

export default function Cases({ onConsult }: CasesProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchRaw, setSearchRaw] = useState('')
  const searchDebounced = useDebounce(searchRaw, 400)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const fetchPatients = useCallback(async (name?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listPatients(name ?? undefined)
      setPatients(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPatients(searchDebounced || undefined)
  }, [searchDebounced, fetchPatients])

  const handleViewReports = (patient: Patient) => {
    setSelectedPatient(patient)
    setDrawerOpen(true)
  }

  const handleReconsult = (patient: Patient) => {
    if (onConsult) {
      onConsult(patient.patient_id)
    } else {
      // fallback: 直接本地存储并跳回 workspace
      sessionStorage.setItem('recheck_patient_id', patient.patient_id)
      window.location.hash = 'workspace'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }
  }

  const handlePatientCreated = (patient: Patient) => {
    setPatients((prev) => [patient, ...prev])
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950">
      {/* 顶部过滤区 */}
      <div className="flex-none border-b border-slate-800/60 bg-slate-950/80 backdrop-blur px-6 py-4">
        <div className="flex items-center gap-3">
          {/* 搜索框 */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <Input
              placeholder="搜索患者姓名或编号..."
              value={searchRaw}
              onChange={(e) => setSearchRaw(e.target.value)}
              className="pl-9 bg-slate-900/80 border-slate-700/60 focus:border-blue-500/60"
            />
          </div>

          {/* 统计徽章 */}
          {!loading && (
            <Badge variant="secondary" className="text-xs">
              共 {patients.length} 名患者
            </Badge>
          )}

          {/* 刷新按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fetchPatients(searchDebounced || undefined)}
            title="刷新"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          {/* 录入新患者按钮 */}
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            录入新患者
          </Button>
        </div>
      </div>

      {/* 主体数据区 */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 flex items-center gap-2">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 text-red-400 hover:text-red-300"
              onClick={() => fetchPatients(searchDebounced || undefined)}
            >
              重试
            </Button>
          </div>
        )}

        {loading && patients.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            加载患者数据...
          </div>
        ) : !loading && patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
            <User className="h-12 w-12 opacity-20" />
            <p className="text-base">
              {searchDebounced ? '未找到匹配的患者' : '暂无患者记录'}
            </p>
            {!searchDebounced && (
              <Button
                size="sm"
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                录入第一名患者
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800/60 hover:bg-transparent">
                  <TableHead className="w-36 text-slate-400">患者编号</TableHead>
                  <TableHead className="text-slate-400">姓名</TableHead>
                  <TableHead className="w-20 text-slate-400">性别</TableHead>
                  <TableHead className="w-20 text-slate-400">年龄</TableHead>
                  <TableHead className="text-slate-400">录入时间</TableHead>
                  <TableHead className="w-48 text-right text-slate-400 pr-6">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((p) => (
                  <TableRow
                    key={p.patient_id}
                    className="border-slate-800/40 hover:bg-slate-800/20 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-slate-400">
                      {p.patient_id}
                    </TableCell>
                    <TableCell className="font-medium text-slate-200">
                      {p.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={p.gender === '男' ? 'secondary' : p.gender === '女' ? 'default' : 'outline'}
                        className={
                          p.gender === '男'
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : p.gender === '女'
                            ? 'bg-pink-500/15 text-pink-400 border-pink-500/30'
                            : ''
                        }
                      >
                        {p.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{p.age}岁</TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {formatDate(p.created_at)}
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 h-8 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                          onClick={() => handleViewReports(p)}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          查看报告
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 h-8 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                          onClick={() => handleReconsult(p)}
                        >
                          <Stethoscope className="h-3.5 w-3.5" />
                          复诊
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* 新建患者对话框 */}
      <NewPatientDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handlePatientCreated}
      />

      {/* 历史报告抽屉 */}
      <ReportsDrawer
        patient={selectedPatient}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedPatient(null)
        }}
      />
    </div>
  )
}
