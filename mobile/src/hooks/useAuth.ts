import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const AUTH_TOKEN_KEY = 'authToken'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY)
      setIsAuthenticated(!!token)
    } catch (error) {
      console.error('Error checking auth status:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (token: string) => {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token)
      setIsAuthenticated(true)
      router.replace('/dashboard')
    } catch (error) {
      console.error('Error during login:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY)

      await AsyncStorage.removeItem(AUTH_TOKEN_KEY)

      const tokenAfterRemoval = await AsyncStorage.getItem(AUTH_TOKEN_KEY)

      setIsAuthenticated(false)

      router.replace('/')
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}

export default useAuth
