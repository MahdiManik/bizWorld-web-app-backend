/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import {
  companyService,
  CompanyFormData,
  Company,
} from '@/services/company.service'

interface CompanyState {
  company: Company | null
  isSaving: boolean
  error: string | null

  saveCompany: (form: CompanyFormData) => Promise<boolean>
  clearError: () => void
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  isSaving: false,
  error: null,

  clearError: () => set({ error: null }),

  saveCompany: async (form) => {
    set({ isSaving: true, error: null })
    try {
      const company = await companyService.saveCompany(form)
      set({ company, isSaving: false })
      return true
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Could not save company',
        isSaving: false,
      })
      return false
    }
  },
}))

export default useCompanyStore
