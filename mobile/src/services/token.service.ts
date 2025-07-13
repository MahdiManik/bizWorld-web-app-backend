import AsyncStorage from '@react-native-async-storage/async-storage'

// Keys used for token storage
export const TOKEN_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
}

/**
 * Token Service
 *
 * A unified service for managing authentication tokens consistently across
 * the application. This ensures tokens are always stored and retrieved
 * from the same location regardless of where in the app they are used.
 */
export const tokenService = {
  /**
   * Store authentication token
   * @param token JWT token string
   */
  async setAuthToken(token: string): Promise<void> {
    if (!token) return

    try {
      await AsyncStorage.setItem(TOKEN_KEYS.AUTH_TOKEN, token)
      console.log('Token stored successfully')
    } catch (error) {
      console.error('Failed to store auth token:', error)
      throw new Error('Failed to store authentication token')
    }
  },

  /**
   * Get the authentication token
   * @returns The stored JWT token or null if not found
   */
  async getAuthToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEYS.AUTH_TOKEN)
      return token
    } catch (error) {
      console.error('Failed to retrieve auth token:', error)
      return null
    }
  },

  /**
   * Store refresh token (if your auth system uses refresh tokens)
   * @param token Refresh token string
   */
  async setRefreshToken(token: string): Promise<void> {
    if (!token) return

    try {
      await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token)
    } catch (error) {
      console.error('Failed to store refresh token:', error)
      throw new Error('Failed to store refresh token')
    }
  },

  /**
   * Get the refresh token
   * @returns The stored refresh token or null if not found
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
      return token
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error)
      return null
    }
  },

  /**
   * Clear all authentication tokens (for logout)
   */
  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        TOKEN_KEYS.AUTH_TOKEN,
        TOKEN_KEYS.REFRESH_TOKEN,
      ])
      console.log('All tokens cleared')
    } catch (error) {
      console.error('Failed to clear tokens:', error)
      throw new Error('Failed to clear authentication tokens')
    }
  },

  /**
   * Check if user has a valid auth token stored
   * @returns boolean indicating if a token exists
   */
  async hasAuthToken(): Promise<boolean> {
    const token = await this.getAuthToken()
    return !!token
  },
}

export default tokenService
