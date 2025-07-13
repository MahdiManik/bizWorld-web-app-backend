/* eslint-disable no-unused-vars */
// context/OnboardingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'

export type OnboardingData = {
  // Profile fields
  professionalHeadline: string
  industrySpecialization: string
  areasOfExpertise: string[]
  portfolioLink: string
  introduction: string
  profileImage?: number | null
  uploadedDocument?: number | null
  whatsappCountryCode: string
  whatsup: string

  // Company fields
  name: string
  industry: string
  location: string
  status: 'published' | 'draft'
  size: string
  revenue: string
  description: string
  companyDocument?: number | null // Strapi file ID like other file fields
}

type OnboardingContextType = {
  data: OnboardingData
  updateField: (field: keyof OnboardingData, value: string) => void
  updateMultipleFields: (fields: Partial<OnboardingData>) => void
  resetData: () => void
  currentStep: number
  setCurrentStep: (step: number) => void
}

const initialData: OnboardingData = {
  professionalHeadline: '',
  industrySpecialization: '',
  areasOfExpertise: [],
  portfolioLink: '',
  introduction: '',
  uploadedDocument: undefined,
  profileImage: undefined,
  whatsappCountryCode: '',
  whatsup: '',

  name: '',
  industry: '',
  location: '',
  status: 'published',
  size: '',
  revenue: '',
  description: '',
  companyDocument: undefined,
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
)

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>(initialData)
  const [currentStep, setCurrentStep] = useState(1)

  const updateField = (field: keyof OnboardingData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateMultipleFields = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({
      ...prev,
      ...fields,
    }))
  }

  const resetData = () => {
    setData(initialData)
    setCurrentStep(1)
  }

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateField,
        updateMultipleFields,
        resetData,
        currentStep,
        setCurrentStep,
      }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context)
    throw new Error('useOnboarding must be used within OnboardingProvider')
  return context
}
