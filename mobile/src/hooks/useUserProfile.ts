import { useState, useCallback } from 'react'
import { UserProfile, userService } from '@/services/user.service'

export function useUserData() {
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const profileData = await userService.getUserProfile()
      setUserData(profileData)
      return profileData
    } catch (err: any) {
      setError(err.message || 'Unable to load user data')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    userData,
    userProfile: userData,
    companyInfo: userData?.company || null,
    isLoading,
    error,
    fetchUserData,
    fetchUserProfile: fetchUserData,
  }
}

export const useUserProfile = useUserData

export default useUserProfile
