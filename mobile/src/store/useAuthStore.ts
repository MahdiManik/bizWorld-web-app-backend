/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { authService, decodeToken } from '@/services/auth.service'
import { saveSecret } from '@/lib/saveSecure'

/* ─────── Types ─────── */

interface User {
  id: string | number
  email: string
  name?: string
  /** numeric role‑ID in Strapi (e.g. 2 = authenticated user) */
  role: number
  userStatus?: string
}

interface RegisterData {
  email: string
  password: string
  name?: string
}

interface AuthState {
  /* reactive state */
  isAuthenticated: boolean
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null

  /* actions */
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  verifyOtp: (
    otp: string
  ) => Promise<{ success: boolean; requiresConfirmation?: boolean }>
  logout: () => Promise<void>
  setUser: (user: User) => void
  setAuth: (payload: { token: string; user: User }) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

/* ─────── Helper to convert Strapi user -> store user ─────── */
const mapStrapiUserToStoreUser = (u: any): User => ({
  id: u.id,
  email: u.email,
  name: u.fullName,
  role: u.role?.id ?? 2, // default role‑id = 2 (“authenticated”)
  userStatus: u.userStatus,
})

/* ─────── Store ─────── */

export const useAuthStore = create<AuthState>((set, _get) => ({
  /* ---------- state ---------- */
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,

  /* ---------- hydrate persisted session ---------- */
  initialize: async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        SecureStore.getItemAsync('authToken'),
        SecureStore.getItemAsync('user'),
      ])

      if (storedToken && storedUser) {
        set({
          isAuthenticated: true,
          token: storedToken,
          user: JSON.parse(storedUser) as User,
        })
      }
    } catch (e) {
      console.warn('AuthStore: failed to restore session', e)
    }
  },

  /* ---------- login ---------- */
  login: async (email, password) => {
    try {
      const res = await authService.login(email, password)

      const user = mapStrapiUserToStoreUser({
        id: res.userId,
        email: res.email,
        fullName: res.fullName,
        userStatus: res.userStatus,
        role: { id: res.role ?? 2 },
      })

      await SecureStore.setItemAsync('authToken', res.token)
      await SecureStore.setItemAsync('user', JSON.stringify(user))

      set({ isAuthenticated: true, token: res.token, user })
      return true
    } catch (error) {
      console.error('AuthStore login:', error)
      return false
    }
  },

  /* ---------- register ---------- */
  register: async ({ email, password, name }) => {
    set({ isLoading: true, error: null })
    try {
      const result = await authService.register(
        email,
        password,
        undefined, // username auto‑derived inside authService
        { fullName: name }
      )

      // Store registration token from the response if it exists
      if (result.registrationToken) {
        authService.setRegistrationToken(result.registrationToken)
      }

      // If user needs to verify OTP
      if (result.requiresEmailConfirmation || result.registrationToken) {
        set({ isLoading: false })
        return false // Indicates OTP verification is needed
      }

      // User is fully authenticated
      if (result.token && result.user) {
        const user = mapStrapiUserToStoreUser(result.user)
        await SecureStore.setItemAsync('authToken', result.token)
        await SecureStore.setItemAsync('user', JSON.stringify(user))

        set({
          isAuthenticated: true,
          token: result.token,
          user,
          isLoading: false,
        })
        return true
      }

      set({ isLoading: false })
      return false
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed'
      set({ error: errorMessage, isLoading: false })
      console.error('AuthStore register:', error)
      return false
    }
  },

  /* ---------- verify OTP ---------- */
  verifyOtp: async (otp: string) => {
    set({ isLoading: true, error: null })

    try {
      console.log('🔹 AuthStore verifyOtp: Starting with code', otp)

      const res = await authService.verifyOtpRegister(otp)
      console.log('🔹 AuthStore verifyOtp: Raw response:', res)

      const jwt = res.token ?? res.jwt ?? null
      const roleId = res.role ?? 2

      /* If we did get a JWT, decode it for e‑mail / fullName */
      let decoded: any = null
      if (jwt) decoded = decodeToken(jwt)

      const user: User | null = jwt
        ? {
            id: res.userId,
            email: decoded?.email ?? '',
            name: decoded?.fullName ?? decoded?.username ?? '',
            role: roleId,
            userStatus: res.userStatus,
          }
        : null

      /* Persist & update store only when we have auth data */
      if (jwt && user) {
        await saveSecret('authToken', jwt)
        await saveSecret('user', JSON.stringify(user))

        set({
          isAuthenticated: true,
          token: jwt,
          user,
          isLoading: false,
          error: null,
        })
      } else {
        set({ isLoading: false })
      }

      const pending = res.userStatus === 'PENDING'
      return { success: !!jwt, requiresConfirmation: pending }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'OTP verification failed'
      console.error('🔴 AuthStore verifyOtp error:', msg)
      set({ error: msg, isLoading: false })
      return { success: false }
    }
  },

  /* ---------- logout ---------- */
  logout: async () => {
    await SecureStore.deleteItemAsync('authToken')
    await SecureStore.deleteItemAsync('user')
    set({ isAuthenticated: false, user: null, token: null })
  },

  /* ---------- manual user update ---------- */
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  /* ---------- low‑level state injection (e.g. after refresh‑token) ---------- */
  setAuth: ({ token, user }) =>
    set({
      token,
      user,
      isAuthenticated: true,
    }),
}))

// Export default for better compatibility
export default useAuthStore
