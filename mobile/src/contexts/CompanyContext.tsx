/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { CompanyFormData, companyService } from '@/services/company.service'

interface CompanyContextType {
  company: CompanyFormData | null
  isLoading: boolean
  error: string | null
  refetchCompany: () => Promise<void>
  clearCompany: () => void
  updateCompanyLocally: (companyData: CompanyFormData) => void
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

interface CompanyProviderProps {
  children: ReactNode
  autoFetch?: boolean // Whether to fetch company automatically on mount
}

export function CompanyProvider({
  children,
  autoFetch = false,
}: CompanyProviderProps) {
  const [company, setCompany] = useState<CompanyFormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCompany = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🏢 Fetching user company...')
      const companyData = await companyService.getUserCompany()

      if (companyData) {
        setCompany(companyData)
        console.log('✅ Company loaded successfully:', companyData.name)
      } else {
        console.log('⚠️ No company found')
        setCompany(null)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch company'
      console.error('❌ Company fetch error:', errorMessage)
      setError(errorMessage)
      setCompany(null)
    } finally {
      setIsLoading(false)
    }
  }

  const clearCompany = () => {
    setCompany(null)
    setError(null)
    setIsLoading(false)
  }

  const updateCompanyLocally = (companyData: CompanyFormData) => {
    setCompany(companyData)
    setError(null)
  }

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchCompany()
    }
  }, [autoFetch])

  const value: CompanyContextType = {
    company,
    isLoading,
    error,
    refetchCompany: fetchCompany,
    clearCompany,
    updateCompanyLocally,
  }

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  )
}

// Custom hook to use the company context
export function useCompany() {
  const context = useContext(CompanyContext)

  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }

  return context
}

// Custom hook with automatic fetching when company is null
export function useCompanyWithFetch() {
  const {
    company,
    isLoading,
    error,
    refetchCompany,
    clearCompany,
    updateCompanyLocally,
  } = useCompany()

  // Auto-fetch if company is null and not currently loading
  useEffect(() => {
    if (!company && !isLoading && !error) {
      refetchCompany()
    }
  }, [company, isLoading, error, refetchCompany])

  return {
    company,
    isLoading,
    error,
    refetchCompany,
    clearCompany,
    updateCompanyLocally,
  }
}

// Custom hook for company creation/update with local state sync
export function useCompanyActions() {
  const { refetchCompany, updateCompanyLocally, clearCompany } = useCompany()

  const createCompany = async (companyData: CompanyFormData) => {
    try {
      const newCompany = await companyService.createCompany(companyData)
      updateCompanyLocally(newCompany) // Update local state immediately
      return newCompany
    } catch (error) {
      console.error('Error creating company:', error)
      throw error
    }
  }

  const updateCompany = async (
    id: number,
    companyData: Partial<CompanyFormData>
  ) => {
    try {
      const updatedCompany = await companyService.updateCompany(id, companyData)
      updateCompanyLocally(updatedCompany) // Update local state immediately
      return updatedCompany
    } catch (error) {
      console.error('Error updating company:', error)
      throw error
    }
  }

  return {
    createCompany,
    updateCompany,
    refetchCompany,
    clearCompany,
  }
}
