import api from '@/lib/api'

export interface Interest {
  id: string
  listingId: string
  userId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  message?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
  }
  listing?: {
    id: string
    title: string
    owner?: {
      id: string
      name: string
      email: string
    }
  }
}

export interface InterestResponse {
  success: boolean
  message: string
  data: Interest
}

export interface InterestsResponse {
  success: boolean
  message: string
  data: Interest[]
}

class InterestService {
  // Express interest in a listing (for investors)
  async expressInterest(listingId: string, message?: string): Promise<Interest> {
    try {
      console.log('[InterestService] Expressing interest in listing:', listingId)
      
      const response = await api.post(`/interests/listings/${listingId}`, {
        message: message || null
      })
      
      console.log('[InterestService] Interest expressed successfully:', response.data)
      return response.data.data
    } catch (error) {
      console.error('[InterestService] Error expressing interest:', error)
      throw error
    }
  }

  // Update interest status (for business owners)
  async updateInterestStatus(interestId: string, status: 'APPROVED' | 'REJECTED'): Promise<Interest> {
    try {
      console.log('[InterestService] Updating interest status:', { interestId, status })
      
      const response = await api.patch(`/interests/${interestId}/status`, {
        status
      })
      
      console.log('[InterestService] Interest status updated successfully:', response.data)
      return response.data.data
    } catch (error) {
      console.error('[InterestService] Error updating interest status:', error)
      throw error
    }
  }

  // Get all interests for a specific listing (for business owners)
  async getListingInterests(listingId: string): Promise<Interest[]> {
    try {
      console.log('[InterestService] Getting interests for listing:', listingId)
      
      const response = await api.get(`/interests/listings/${listingId}`)
      
      console.log('[InterestService] Listing interests retrieved:', response.data)
      return response.data.data
    } catch (error) {
      console.error('[InterestService] Error getting listing interests:', error)
      throw error
    }
  }

  // Get user's interests (for investors)
  async getUserInterests(): Promise<Interest[]> {
    try {
      console.log('[InterestService] Getting user interests')
      
      const response = await api.get('/interests/my-interests')
      
      console.log('[InterestService] User interests retrieved:', response.data)
      return response.data.data
    } catch (error) {
      console.error('[InterestService] Error getting user interests:', error)
      throw error
    }
  }

  // Delete interest (for investors to withdraw interest)
  async deleteInterest(interestId: string): Promise<{ message: string }> {
    try {
      console.log('[InterestService] Deleting interest:', interestId)
      
      const response = await api.delete(`/interests/${interestId}`)
      
      console.log('[InterestService] Interest deleted successfully:', response.data)
      return response.data.data
    } catch (error) {
      console.error('[InterestService] Error deleting interest:', error)
      throw error
    }
  }
}

export const interestService = new InterestService()
