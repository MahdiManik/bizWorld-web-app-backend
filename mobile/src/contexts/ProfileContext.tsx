/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { UserProfile, UserProfileFormData, profileService } from '@/services/profile.service'

interface ProfileContextType {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  refetchProfile: () => Promise<void>
  clearProfile: () => void
  updateProfileLocally: (profileData: UserProfile) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

interface ProfileProviderProps {
  children: ReactNode
  autoFetch?: boolean // Whether to fetch profile automatically on mount
}

export function ProfileProvider({
  children,
  autoFetch = false,
}: ProfileProviderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🔄 Fetching user profile...')
      const profileData = await profileService.getUserProfile()

      if (profileData) {
        setProfile(profileData)
        console.log('✅ Profile loaded successfully:', profileData.professionalHeadline)
      } else {
        console.log('⚠️ No profile found')
        setProfile(null)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch profile'
      console.error('❌ Profile fetch error:', errorMessage)
      setError(errorMessage)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  const clearProfile = () => {
    setProfile(null)
    setError(null)
    setIsLoading(false)
  }

  const updateProfileLocally = (profileData: UserProfile) => {
    setProfile(profileData)
    setError(null)
  }

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchProfile()
    }
  }, [autoFetch])

  const value: ProfileContextType = {
    profile,
    isLoading,
    error,
    refetchProfile: fetchProfile,
    clearProfile,
    updateProfileLocally,
  }

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}

// Custom hook to use the profile context
export function useProfile() {
  const context = useContext(ProfileContext)

  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }

  return context
}

// Custom hook with automatic fetching when profile is null
export function useProfileWithFetch() {
  const {
    profile,
    isLoading,
    error,
    refetchProfile,
    clearProfile,
    updateProfileLocally,
  } = useProfile()

  // Auto-fetch if profile is null and not currently loading
  useEffect(() => {
    if (!profile && !isLoading && !error) {
      refetchProfile()
    }
  }, [profile, isLoading, error, refetchProfile])

  return {
    profile,
    isLoading,
    error,
    refetchProfile,
    clearProfile,
    updateProfileLocally,
  }
}

// Custom hook for profile creation/update with local state sync
export function useProfileActions() {
  const { refetchProfile, updateProfileLocally, clearProfile } = useProfile()

  const createProfile = async (profileData: UserProfileFormData) => {
    try {
      const newProfile = await profileService.createUserProfile(profileData)
      updateProfileLocally(newProfile) // Update local state immediately
      return newProfile
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  }

  const updateProfile = async (
    id: number,
    profileData: Partial<UserProfile>
  ) => {
    try {
      const updatedProfile = await profileService.updateUserProfile(id, profileData)
      updateProfileLocally(updatedProfile) // Update local state immediately
      return updatedProfile
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  return {
    createProfile,
    updateProfile,
    refetchProfile,
    clearProfile,
  }
}
