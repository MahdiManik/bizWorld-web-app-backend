import api from '@/lib/api'
import { AxiosError } from 'axios'
import { uploadFileToStrapi } from '@/lib/upload'
import { getCurrentUserId } from '@/services/auth.service'
import { StrapiArrayResponse } from '@/types'

/* ─── Types shared with components ───────────────────────── */

interface UserProfileFormData {
  professionalHeadline: string
  industrySpecialization: string
  areasOfExpertise: string[] | string
  portfolioLink?: string
  introduction?: string
  profileImage?: File | string
  uploadedDocument?: File | string
  whatsappNumber?: string
  whatsappCountryCode?: string
}

interface UserProfile {
  id: number
  professionalHeadline: string
  industrySpecialization: string
  areasOfExpertise: string[]
  portfolioLink?: string
  introduction?: string
  whatsup?: string
  image?: any
  document?: any
  userStatus?: string
}

type StrapiID = number

interface StrapiResponse<T> {
  data: {
    id: number
    attributes: T
  }
}

/* ─── Helper to unwrap {data:{id,attributes}} -> { id, …attributes } ─ */
const unwrap = <T>(strapiData: {
  id: number
  attributes: T
}): T & { id: number } => ({ id: strapiData.id, ...strapiData.attributes })

/* ─── Input shape for /user-profiles POST { data: { … } } ─────────── */
interface UserProfileCreateInput
  extends Omit<UserProfileFormData, 'profileImage' | 'uploadedDocument'> {
  users_permissions_user: StrapiID
  image?: StrapiID
  document?: StrapiID
}

/* ─── WhatsApp metadata, stored elsewhere if you need it ──────────── */
export interface UserProfileMetadata {
  whatsappNumber?: string
  whatsappCountryCode?: string
}

/* ==================================================================== */
/*                         Profile Service                              */
/* ==================================================================== */

class ProfileService {
  /* ───── createUserProfile ───── */
  async createUserProfile(
    profileData: UserProfileFormData
  ): Promise<UserProfile & { id: number }> {
    try {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('User ID not found. Please log in again.')

      /* ---- build request body ---- */
      const mapped: UserProfileCreateInput = {
        professionalHeadline: profileData.professionalHeadline,
        industrySpecialization: profileData.industrySpecialization,
        areasOfExpertise:
          typeof profileData.areasOfExpertise === 'string'
            ? [profileData.areasOfExpertise]
            : profileData.areasOfExpertise,
        portfolioLink: profileData.portfolioLink,
        introduction: profileData.introduction,
        users_permissions_user: userId as StrapiID,
      }

      /* ---- image upload ---- */
      if (
        profileData.profileImage &&
        typeof profileData.profileImage !== 'string'
      ) {
        const upload = await uploadFileToStrapi(
          profileData.profileImage as File,
          'files'
        )
        if (upload?.id) {
          mapped.image = upload.id
        }
      }

      /* ---- document upload ---- */
      if (
        profileData.uploadedDocument &&
        typeof profileData.uploadedDocument !== 'string'
      ) {
        const upload = await uploadFileToStrapi(
          profileData.uploadedDocument as File,
          'files'
        )
        if (upload?.id) {
          mapped.document = upload.id
        }
      }

      /* ---- WhatsApp meta (store wherever you want) ---- */
      const meta: UserProfileMetadata = {
        whatsappNumber: profileData.whatsappNumber,
        whatsappCountryCode: profileData.whatsappCountryCode,
      }
      console.log('WhatsApp metadata:', meta)

      /* ---- POST to Strapi ---- */
      const res = await api.post<StrapiResponse<UserProfile>>(
        '/user-profiles',
        {
          data: mapped,
        }
      )

      return unwrap(res.data.data)
    } catch (err) {
      const msg =
        (err as AxiosError<{ message: string }>).response?.data?.message ??
        (err as Error).message
      console.error('createUserProfile error:', msg)
      throw new Error(msg)
    }
  }

  /**
   * Update an existing user profile
   *
   * @param profileId The profile ID to update
   * @param profileData Form data from frontend
   * @returns Updated profile data
   * @example
   * // Example call
   * const updatedProfile = await profileService.updateUserProfile(123, {
   *   professionalHeadline: 'Senior Software Engineer'
   * });
   * // PUT /api/user-profiles/123 with { data: { ... } }
   */
  async updateUserProfile(
    profileId: StrapiID,
    profileData: Partial<UserProfileFormData>
  ): Promise<UserProfile & { id: number }> {
    try {
      // Prepare data for Strapi
      const mappedData: Partial<UserProfileCreateInput> = {}

      // Only include fields that are provided
      if (profileData.professionalHeadline !== undefined) {
        mappedData.professionalHeadline = profileData.professionalHeadline
      }

      if (profileData.industrySpecialization !== undefined) {
        mappedData.industrySpecialization = profileData.industrySpecialization
      }

      if (profileData.areasOfExpertise !== undefined) {
        mappedData.areasOfExpertise =
          typeof profileData.areasOfExpertise === 'string'
            ? [profileData.areasOfExpertise]
            : profileData.areasOfExpertise
      }

      if (profileData.portfolioLink !== undefined) {
        mappedData.portfolioLink = profileData.portfolioLink
      }

      if (profileData.introduction !== undefined) {
        mappedData.introduction = profileData.introduction
      }

      // Handle profile image upload if provided
      if (profileData.profileImage) {
        try {
          const uploadedImage = await uploadFileToStrapi(
            profileData.profileImage as File,
            'files',
            'profile-images'
          )
          if (uploadedImage?.id) {
            mappedData.image = uploadedImage.id
          }
        } catch (uploadError) {
          console.error('Error uploading profile image:', uploadError)
        }
      }

      // Update profile in Strapi (note the data wrapper required by Strapi)
      const response = await api.put<StrapiResponse<UserProfile>>(
        `/user-profiles/${profileId}`,
        {
          data: mappedData,
        }
      )

      const unwrappedProfile = unwrap(response.data.data)
      if (!unwrappedProfile) {
        throw new Error(
          `Failed to update profile ${profileId} - received null response`
        )
      }
      return unwrappedProfile
    } catch (error) {
      console.error(`Error updating user profile ${profileId}:`, error)
      throw error
    }
  }

  /**
   * Get the current user's profile
   *
   * @returns User profile or null if not found
   * @example
   * // Example call
   * const profile = await profileService.getUserProfile();
   * // GET /api/user-profiles?filters[users_permissions_user][id]=123&populate=*
   */
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const userId = await getCurrentUserId()
      if (!userId) {
        console.warn('User ID not found when getting profile')
        return null
      }

      // Find profile by user ID relation
      const response = await api.get<StrapiArrayResponse<UserProfile>>(
        `/user-profiles?filters[users_permissions_user][id]=${userId}&populate=*`
      )

      return unwrap(response?.data?.data[0])
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  /**
   * Get a user profile by ID
   *
   * @param profileId The profile ID to retrieve
   * @returns User profile or null if not found
   * @example
   * // Example call
   * const profile = await profileService.getUserProfileById(123);
   * // GET /api/user-profiles/123?populate=*
   */
  async getUserProfileById(profileId: StrapiID): Promise<UserProfile | null> {
    try {
      // Get profile by ID with populated relations
      const response = await api.get<StrapiResponse<UserProfile>>(
        `/user-profiles/${profileId}?populate=*`
      )

      return unwrap(response.data.data)
    } catch (error) {
      console.error(`Error fetching user profile ${profileId}:`, error)
      return null
    }
  }

  /**
   * Combine create and update operations into a single save method
   * (For backwards compatibility with existing code)
   *
   * @param profileData Form data from frontend
   * @returns Created or updated profile data
   */
  async saveUserProfile(
    profileData: UserProfileFormData
  ): Promise<UserProfile & { id: number }> {
    try {
      // Check if profile exists for this user
      const existingProfile = await this.getUserProfile()

      if (existingProfile?.id) {
        // Update existing profile
        return this.updateUserProfile(existingProfile.id, profileData)
      } else {
        // Create new profile
        return this.createUserProfile(profileData)
      }
    } catch (error) {
      console.error('Error saving user profile:', error)
      throw error
    }
  }
}

export const profileService = new ProfileService()
export type { UserProfileFormData, UserProfile }
