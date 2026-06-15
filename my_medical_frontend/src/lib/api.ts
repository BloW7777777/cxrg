function resolveApiBase(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL?.trim()
  if (envBase) return envBase

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location
    return `${protocol}//${hostname}:8000`
  }

  return 'http://127.0.0.1:8000'
}

const API_BASE = resolveApiBase()

export interface Patient {
  patient_id: string
  name: string
  gender: string
  age: number
  created_at: string
}

export interface Report {
  report_id: string
  patient_id: string
  image_paths: Record<string, string> | null
  schema_data: Record<string, unknown> | null
  findings: string | null
  impression: string | null
  ai_advice: string | null
  attention_map_paths: Record<string, string> | null
  chat_history: Record<string, unknown> | null
  created_at: string
}

export interface CreatePatientPayload {
  patient_id: string
  name: string
  gender: string
  age: number
}

export interface CreateReportPayload {
  report_id: string
  patient_id: string
  image_paths?: Record<string, string>
  schema_data?: Record<string, unknown>
  findings?: string
  impression?: string
  ai_advice?: string
  attention_map_paths?: Record<string, string>
  chat_history?: Record<string, unknown>
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'API 请求失败')
  }
  return res.json() as Promise<T>
}

export const api = {
  // Patient
  listPatients: (name?: string) =>
    request<Patient[]>(`/api/patients${name ? `?name=${encodeURIComponent(name)}` : ''}`),

  getPatient: (patientId: string) =>
    request<Patient>(`/api/patients/${encodeURIComponent(patientId)}`),

  createPatient: (payload: CreatePatientPayload) =>
    request<Patient>('/api/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Report
  listReports: (patientId?: string) =>
    request<Report[]>(`/api/reports${patientId ? `?patient_id=${encodeURIComponent(patientId)}` : ''}`),

  getReportsByPatient: (patientId: string) =>
    request<Report[]>(`/api/reports/${encodeURIComponent(patientId)}`),

  createReport: (payload: CreateReportPayload) =>
    request<Report>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
