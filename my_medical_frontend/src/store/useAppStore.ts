import { create } from 'zustand'
import type { Patient } from '@/lib/api'

interface AppStoreState {
  currentPatient: Patient | null
  setCurrentPatient: (patient: Patient | null) => void
}

export const useAppStore = create<AppStoreState>((set) => ({
  currentPatient: null,
  setCurrentPatient: (patient) => set({ currentPatient: patient }),
}))
