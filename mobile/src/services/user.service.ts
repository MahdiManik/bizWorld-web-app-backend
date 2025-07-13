// import axios from 'axios'
// import { getCurrentUserId } from './auth.service'
// import { companyService } from '@/services/company.service'
// import api from '@/lib/api'
// import { tokenService } from '@/services/token.service'

// interface ApiResponse<T> {
//   success: boolean
//   message: string
//   data: T
// }

// export interface Document {
//   name: string
//   url: string
//   size: string
// }

// export interface CompanyInfo {
//   id: string
//   name: string
//   industry: string
//   status: string
//   size: string
//   revenue: string
//   location: string
//   description: string
//   logo?: string
//   documents: Document[]
//   website?: string
//   established?: string
// }

// export interface UserProfile {
//   id: string
//   name: string
//   email: string
//   phoneNumber?: string
//   status?: string
//   createdAt?: string
//   updatedAt?: string
//   // Original profile field - kept for backwards compatibility
//   profile?: {
//     id?: string
//     userId?: string
//     imageUrl?: string
//     professionalHeadline?: string
//     industrySpecialization?: string
//     areasOfExpertise?: string[]
//     portfolioLink?: string
//     introduction?: string
//     rating?: number
//     hourlyRate?: number
//     createdAt?: string
//     updatedAt?: string
//   }
//   // New field returned when populating relations
//   user_profile?: {
//     id?: string
//     userId?: string
//     imageUrl?: string
//     professionalHeadline?: string
//     industrySpecialization?: string
//     areasOfExpertise?: string[]
//     portfolioLink?: string
//     introduction?: string
//     rating?: number
//     hourlyRate?: number
//     createdAt?: string
//     updatedAt?: string
//   }
//   company?: CompanyInfo
//   roles?: string[]
// }

// /**
//  * Check if the user is currently in the onboarding process
//  * This determines how we handle 401 errors during profile/company setup
//  */
// async function isUserInOnboardingProcess(): Promise<boolean> {
//   try {
//     const token = await tokenService.getAuthToken()
//     if (!token) return false

//     // If we have a token but no profile data yet, we're in onboarding
//     const userId = await getCurrentUserId()
//     if (!userId) return false

//     try {
//       // Try to get user data without using fetchFromApi to avoid circular dependency
//       const response = await api.get(`/users/${userId}`)
//       const userData = response.data.data

//       // If user exists but has no profile or company, they're in onboarding
//       if (!userData.profile || !userData.company) {
//         return true
//       }
//       return false
//     } catch (error) {
//       // If we get a 401/404 here, it likely means user exists but hasn't completed profile
//       // So they're in onboarding
//       if (
//         axios.isAxiosError(error) &&
//         (error.response?.status === 401 || error.response?.status === 404)
//       ) {
//         return true
//       }
//       return false
//     }
//   } catch (error) {
//     console.error('Error checking onboarding status:', error)
//     return false
//   }
// }

// async function fetchFromApi<T>(endpoint: string, errorMsg: string): Promise<T> {
//   try {
//     const userId = await getCurrentUserId()
//     if (!userId) {
//       throw new Error('User ID not found. Please log in again.')
//     }

//     console.log('fetchFromApi - userId:', userId)

//     const token = await tokenService.getAuthToken()
//     console.log('fetchFromApi - token exists:', !!token)

//     if (!token) {
//       throw new Error('Authorization token not found. Please log in again.')
//     }

//     console.log('fetchFromApi - Making request to endpoint:', endpoint)

//     const response = await api.get<ApiResponse<T>>(endpoint)

//     return response.data.data
//   } catch (error) {
//     console.error(`Error: ${errorMsg}`, error)

//     // Check if this is a user endpoint 401 during onboarding
//     // Allow this to pass through during onboarding to prevent redirect to login
//     if (axios.isAxiosError(error) && error.response?.status === 401) {
//       // Special case for onboarding: if this is a /users/:id endpoint
//       if (
//         endpoint.startsWith('/users/') &&
//         (await isUserInOnboardingProcess())
//       ) {
//         console.log('User in onboarding process, continuing despite 401')
//         // Return null instead of throwing to allow onboarding to continue
//         return null as T
//       }

//       throw new Error('Your session has expired. Please log in again.')
//     }

//     const message =
//       axios.isAxiosError(error) && error.response?.data?.message
//         ? error.response.data.message
//         : error instanceof Error
//           ? error.message
//           : errorMsg

//     throw new Error(message)
//   }
// }

// export async function getUserProfile(): Promise<UserProfile> {
//   const userId = await getCurrentUserId()
//   if (!userId) {
//     throw new Error('User ID not found. Please log in again.')
//   }

//   try {
//     console.log('Fetching user profile with Strapi backend')

//     // Use the me endpoint which is more reliable than directly accessing users
//     // This endpoint returns the current user based on the JWT token
//     const userResponse = await api.get(
//       `/users/me?populate[0]=user_profile&populate[1]=company&populate[2]=role`
//     )

//     if (!userResponse.data) {
//       throw new Error('Failed to fetch user data')
//     }

//     // Extract user data from Strapi response
//     const userData = userResponse.data
//     console.log('User data:', userData)

//     // Create a properly formatted UserProfile object
//     const profile: UserProfile = {
//       id: String(userData.id),
//       name: userData.username || '',
//       email: userData.email || '',
//       phoneNumber: userData.phone || '',
//       // Map roles from Strapi's structure
//       roles: userData.role?.name ? [userData.role.name] : ['authenticated'],
//       createdAt: userData.createdAt,
//       updatedAt: userData.updatedAt,
//     }

//     // Check if user has a profile and map those fields
//     if (userData.user_profile) {
//       const userProfile = userData.user_profile
//       profile.profile = {
//         id: String(userProfile.id),
//         userId: String(userData.id),
//         imageUrl: userProfile.image?.url || null,
//         professionalHeadline: userProfile.professionalHeadline || '',
//         industrySpecialization: userProfile.industrySpecialization || '',
//         areasOfExpertise: Array.isArray(userProfile.areasOfExpertise)
//           ? userProfile.areasOfExpertise
//           : userProfile.areasOfExpertise
//             ? [userProfile.areasOfExpertise]
//             : [],
//         portfolioLink: userProfile.portfolioLink || '',
//         introduction: userProfile.introduction || '',
//         rating: userProfile.rating || 0,
//       }
//     }

//     // Check if user has company data
//     if (userData.company) {
//       profile.company = {
//         id: String(userData.company.id),
//         name: userData.company.name || '',
//         industry: userData.company.industry || '',
//         status: userData.company.status || '',
//         size: userData.company.size || '',
//         revenue: userData.company.revenue || '',
//         location: userData.company.location || '',
//         description: userData.company.description || '',
//         logo: userData.company.logo?.url || '',
//         documents: Array.isArray(userData.company.documents)
//           ? userData.company.documents
//           : [],
//         website: userData.company.website || '',
//         established: userData.company.established || '',
//       }
//     }

//     return profile
//   } catch (error) {
//     console.error('Error fetching user profile:', error)

//     // Check for specific error types and provide better messages
//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 401) {
//         throw new Error('Your session has expired. Please log in again.')
//       } else if (error.response?.status === 403) {
//         throw new Error('You do not have permission to access this profile.')
//       } else if (error.response?.status === 500) {
//         console.error('Strapi server error response:', error.response.data)
//         throw new Error(
//           'The server encountered an error. Please try again later.'
//         )
//       }
//     }

//     const message =
//       error instanceof Error ? error.message : 'Failed to fetch profile data'
//     throw new Error(message)
//   }
// }

// export async function getCompanyInfo(): Promise<CompanyInfo> {
//   const userData = await getUserProfile()

//   if (!userData.company) {
//     throw new Error('No company information found.')
//   }

//   return userData.company
// }

// export async function updateCompanyInfo(
//   companyData: CompanyInfo
// ): Promise<void> {
//   const userData = await getUserProfile()

//   if (!userData.company) {
//     throw new Error('No company information found.')
//   }

//   const updatedCompany = {
//     ...userData.company,
//     ...companyData,
//   }

//   // Convert string ID to number as required by company.service.ts
//   await companyService.updateCompany(Number(updatedCompany.id), updatedCompany)
// }

// export const userService = {
//   getUserProfile,
//   getCompanyInfo,
//   updateCompanyInfo,
// }
