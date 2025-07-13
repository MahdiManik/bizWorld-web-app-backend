/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { decodeToken } from '@/services/auth.service'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export interface AuthUser {
  id: number
  email?: string
  fullName?: string
  status?: string
  // add anything else your token exposes
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
}

interface AuthContextValue extends AuthState {
  /** call after successful login */
  signIn: (token: string, userData?: Partial<AuthUser>) => Promise<void>
  /** clear AsyncStorage + state */
  signOut: () => Promise<void>
  /** force reload from storage (optional) */
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const AUTH_TOKEN_KEY = 'authToken'
const USER_DATA_KEY = 'userData'

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
    error: null,
  })

  const loadFromStorage = useCallback(async () => {
    try {
      const [token, storedUser] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_DATA_KEY),
      ])

      if (!token) {
        setState((s) => ({ ...s, loading: false }))
        return
      }

      let user: AuthUser | null = null

      // Prefer stored userData when present & parseable
      if (storedUser) {
        try {
          user = JSON.parse(storedUser)
        } catch (err) {
          console.warn('Failed to parse stored userData:', err)
        }
      }

      // Fallback: decode token to extract at least the id
      if (!user) {
        const decoded: any = decodeToken(token)
        if (decoded?.id) {
          user = { id: Number(decoded.id) }
        }
      }

      setState({ user, token, loading: false, error: null })
    } catch (e: any) {
      console.error('AuthProvider: failed to load storage', e)
      setState({ user: null, token: null, loading: false, error: e.message })
    }
  }, [])

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  const signIn = useCallback(
    async (token: string, partialUser?: Partial<AuthUser>) => {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token)
      if (partialUser) {
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(partialUser))
      }
      // derive user from token if not supplied
      let user: AuthUser | null = null
      if (partialUser) user = partialUser as AuthUser
      else {
        const decoded: any = decodeToken(token)
        if (decoded?.id) user = { id: Number(decoded.id) }
      }
      setState({ user, token, loading: false, error: null })
    },
    []
  )

  const signOut = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_DATA_KEY),
    ])
    setState({ user: null, token: null, loading: false, error: null })
  }, [])

  const refresh = loadFromStorage

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signIn, signOut, refresh }),
    [state, signIn, signOut, refresh]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
