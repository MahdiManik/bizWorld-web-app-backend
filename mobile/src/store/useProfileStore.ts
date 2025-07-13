/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import {
  profileService,
  UserProfileFormData,
  UserProfile,
} from '@/services/profile.service'

interface ProfileState {
  isSaving: boolean
  error: string | null
  profile: UserProfile | null

  createProfile: (form: UserProfileFormData) => Promise<boolean>
  clearError: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  isSaving: false,
  error: null,
  profile: null,

  clearError: () => set({ error: null }),

  /* ---------- createProfile ---------- */
  createProfile: async (form: UserProfileFormData) => {
    set({ isSaving: true, error: null })
    try {
      const profile = await profileService.createUserProfile(form)
      set({ profile, isSaving: false })
      return true
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Profile creation failed',
        isSaving: false,
      })
      return false
    }
  },
}))

export default useProfileStore
