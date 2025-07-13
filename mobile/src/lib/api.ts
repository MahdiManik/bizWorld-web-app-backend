import axios from 'axios'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import tokenService from '@/services/token.service'

// Deprecated - Use tokenService instead
// These are kept for backward compatibility until all code is migrated
const getStorageItem = async (key: string): Promise<string | null> => {
  console.warn('getStorageItem is deprecated - use tokenService instead')
  try {
    return await AsyncStorage.getItem(key)
  } catch (error) {
    console.error('Error getting stored item:', error)
    return null
  }
}

const setStorageItem = async (key: string, value: string): Promise<void> => {
  console.warn('setStorageItem is deprecated - use tokenService instead')
  try {
    await AsyncStorage.setItem(key, value)
  } catch (error) {
    console.error('Error setting stored item:', error)
  }
}

const removeStorageItem = async (key: string): Promise<void> => {
  console.warn('removeStorageItem is deprecated - use tokenService instead')
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing stored item:', error)
  }
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL
  ? `${process.env.EXPO_PUBLIC_API_URL}/api`
  : 'http://localhost:1337/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Only use credentials on native platforms to avoid CORS issues on web
  withCredentials: Platform.OS !== 'web',
})

// Add a request interceptor to include auth token in headers
api.interceptors.request.use(
  async (config) => {
    // Skip adding auth token for authentication endpoints
    const isAuthEndpoint = config.url?.includes('/auth')

    if (!isAuthEndpoint) {
      // Get token using tokenService
      let token = null
      try {
        token = await tokenService.getAuthToken()
        console.log(
          'API interceptor - Retrieved token from tokenService:',
          !!token
        )
      } catch (storageError) {
        console.error(
          'API interceptor - Error accessing token:',
          storageError
        )
      }

      // If we have a token, add it to the headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('Adding auth token to request:', { hasToken: !!token })
      } else {
        console.log('No auth token found for request')
      }
    } else {
      console.log('Skipping auth token for auth endpoint:', config.url)
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized errors - attempt token refresh if we have a refresh token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        // Get refresh token using tokenService
        const refreshToken = await tokenService.getRefreshToken()

        if (refreshToken) {
          // Attempt to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          if (response.data && response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data

            // Update tokens with tokenService
            await tokenService.setAuthToken(accessToken)
            await tokenService.setRefreshToken(newRefreshToken)

            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return axios(originalRequest)
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
      }

      // If refresh failed or no refresh token, clear tokens
      await tokenService.clearTokens()

      // You'll need to handle navigation to login screen here
      // This would depend on your navigation setup
    }

    return Promise.reject(error)
  }
)

export default api
export { getStorageItem, setStorageItem, removeStorageItem }
