import api from '../lib/api'
import { AxiosError } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Define interfaces for API responses
interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface OtpVerificationResponse {
  userId: string
  registrationToken: string
  userStatus: string
  role?: number
  token?: string
  jwt?: string // Add jwt property for backend compatibility
  message?: string
}

interface LoginResponse {
  userId: string
  email: string
  fullName?: string
  token: string
  role?: number
  userStatus?: string
}

interface RegisterOptions {
  fullName?: string
  phone?: string
  role?: number
}
interface StrapiRole {
  id: number
  name: string
  type: string
}
interface RegisterResult {
  success: boolean
  requiresEmailConfirmation?: boolean
  token?: string
  user?: {
    id: string
    email: string
    fullName?: string
    userStatus?: string
    role?: StrapiRole
  }
  registrationToken?: string
  message?: string
}

export class AuthService {
  async register(
    email: string,
    password: string,
    username?: string,
    extra: RegisterOptions = {}
  ): Promise<RegisterResult> {
    try {
      // 1️⃣ Normalise e‑mail and username
      const normalizedEmail = email.toLowerCase()
      const normalizedUsername = (
        username ?? normalizedEmail.split('@')[0]
      ).toLowerCase()

      // 2️⃣ Compose payload for Strapi
      const payload = {
        email: normalizedEmail,
        username: normalizedUsername,
        password,
        ...extra,
      }

      const { data } = await api.post('/auth/local/register', payload)

      // ── grab everything Strapi may return ──────────────────────────
      const { jwt, user, registrationToken } = data // 🔹

      // ── Persist JWT immediately (email‑confirmation OFF) ──────────
      if (jwt) {
        await AsyncStorage.setItem('authToken', jwt)
        console.log(
          'DEBUG – decoded token after registration:',
          JSON.stringify(decodeToken(jwt), null, 2)
        )
      }

      // ── NEW: store the registrationToken for later OTP call ──────
      if (registrationToken) {
        this.setRegistrationToken(registrationToken) // 🔹
      }

      // ── Build the return object ──────────────────────────────────
      return {
        success: true,
        message:
          data.message ??
          (jwt
            ? 'Registration successful'
            : 'Registration successful. Please verify your email.'),
        requiresEmailConfirmation: !jwt, // true when jwt is undefined
        user: user
          ? {
              id: user.id.toString(),
              email: user.email,
              fullName: user.fullName,
              userStatus: user.userStatus,
              role: user.role, // keep full role object
            }
          : undefined,
        token: jwt,
        registrationToken, // 🔹 expose to caller too
      }
    } catch (error) {
      // 4️⃣ Same error‑handling pattern as the rest of AuthService
      if ((error as AxiosError).response) {
        const axiosErr = error as AxiosError<any>
        const status = axiosErr.response?.status
        const msg = axiosErr.response?.data?.message || ''

        switch (status) {
          case 400:
            throw new Error(msg || 'Invalid registration data')
          case 404:
            throw new Error('Requested resource not found')
          case 409:
            throw new Error('Email or username already taken')
          default:
            throw new Error(msg || 'Registration failed')
        }
      }

      if ((error as Error).message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.')
      }

      throw new Error('Something went wrong. Please try again later.')
    }
  }

  /**
   * Request password reset by sending OTP to email
   * @param email User email
   * @returns Success message if OTP is sent
   */
  async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Normalize email to lowercase to match backend storage
      const normalizedEmail = email.toLowerCase()

      console.log('Requesting password reset for:', { normalizedEmail })

      const response = await api.post<ApiResponse<{ success: boolean }>>(
        '/auth/forgot-password',
        { email: normalizedEmail }
      )

      return {
        success: true,
        message: response.data.message || 'Reset code sent to your email',
      }
    } catch (error) {
      // Handle common error cases
      if ((error as AxiosError).response) {
        const axiosError = error as AxiosError<any>

        if (axiosError.response?.status === 404) {
          throw new Error('Email not found. Please register first.')
        } else {
          throw new Error(
            axiosError.response?.data?.message || 'Failed to send reset code'
          )
        }
      } else if ((error as Error).message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.')
      } else {
        throw new Error('Something went wrong. Please try again later.')
      }
    }
  }

  /**
   * Verify OTP code for password reset
   * @param email User email
   * @param otp OTP code received via email
21essage if OTP is verified
   */
  async verifyOtp(
    email: string,
    otp: string
  ): Promise<{
    success: boolean
    verified: boolean
    jwt?: string
    user?: any
    code?: string
    message?: string
  }> {
    try {
      // Normalize email to lowercase to match backend storage
      const normalizedEmail = email.toLowerCase()

      console.log('Verifying OTP with:', { normalizedEmail, otp })

      const response = await api.post<
        ApiResponse<{
          jwt?: string
          user?: any
          code?: string
          message?: string
        }>
      >('/auth/verify-otp', { email: normalizedEmail, otp })

      console.log('OTP verification response:', response.data)

      // Check if verification was successful by looking for jwt and user
      const isVerified = !!(response.data.data.jwt && response.data.data.user)

      return {
        success: true,
        verified: isVerified,
        jwt: response.data.data.jwt,
        user: response.data.data.user,
        code: response.data.data.code,
        message: response.data.data.message,
      }
    } catch (error) {
      console.error('OTP verification error:', error)

      // Handle common error cases
      if ((error as AxiosError).response) {
        const axiosError = error as AxiosError<any>
        console.log('Error response:', axiosError?.response?.data)

        if (axiosError.response?.status === 400) {
          throw new Error('Invalid or expired OTP. Please try again.')
        } else {
          throw new Error(
            axiosError.response?.data?.message || 'OTP verification failed'
          )
        }
      } else if ((error as Error).message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.')
      } else {
        throw new Error('Something went wrong. Please try again later.')
      }
    }
  }

  /**
   * Reset password after OTP verification
   * @param password New password
   * @param passwordConfirmation Password confirmation (must match password)
   * @param code JWT token received from OTP verification
   * @returns Success message if password is reset
   */
  async resetPassword(
    password: string,
    passwordConfirmation: string,
    code: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Resetting password with code:', {
        password: '***',
        passwordConfirmation: '***',
        code,
      })

      const response = await api.post<ApiResponse<any>>(
        '/auth/reset-password',
        {
          password,
          passwordConfirmation,
          code,
        }
      )

      console.log('Reset password response:', response.data)

      return {
        success: true,
        message: response.data.message || 'Password reset successful',
      }
    } catch (error) {
      console.error('Reset password error:', error)

      // Handle common error cases
      if ((error as AxiosError).response) {
        const axiosError = error as AxiosError<any>
        console.log('Error response:', axiosError?.response?.data)

        if (axiosError.response?.status === 400) {
          throw new Error('Invalid or expired reset code. Please try again.')
        } else if (axiosError.response?.status === 404) {
          throw new Error('User not found.')
        } else {
          throw new Error(
            axiosError.response?.data?.message || 'Failed to reset password'
          )
        }
      } else if ((error as Error).message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.')
      } else {
        throw new Error('Something went wrong. Please try again later.')
      }
    }
  }

  /**
   * Login a user with email and password
   * @param email User email
   * @param password User password
   * @returns User data and token upon successful login
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/local', {
        identifier: email,
        password,
      })

      console.log('Login response:', response.data)

      // The backend returns { jwt, user } structure
      const { jwt, user } = response.data

      // Store the auth token for future requests
      if (jwt) {
        await AsyncStorage.setItem('authToken', jwt)

        // Log the decoded token to see what user info is available
        const decodedToken = decodeToken(jwt)
        console.log(
          'DEBUG - Decoded token after login:',
          JSON.stringify(decodedToken, null, 2)
        )
      }

      // Store complete user data for getCurrentUser function
      if (user) {
        const userData = {
          id: user.id.toString(),
          email: user.email,
          fullName: user.fullName || '',
          status: user.userStatus || '',
          role: user.role?.id || user.role || null,
        }
        await AsyncStorage.setItem('userData', JSON.stringify(userData))
        console.log('DEBUG - Stored user data:', userData)
      }

      // Map the backend response to the expected LoginResponse format
      return {
        userId: user.id.toString(),
        email: user.email,
        fullName: user.fullName,
        token: jwt,
        role: user.role.id,
        userStatus: user.userStatus,
      }
    } catch (error) {
      // Enhanced error handling
      if ((error as AxiosError).response) {
        const axiosError = error as AxiosError<any>
        const errorMessage = axiosError.response?.data?.message || ''
        console.log('Login error response:', axiosError.response?.data)

        if (axiosError.response?.status === 401) {
          // Handle specific error messages from backend
          if (errorMessage.includes('Account not approved')) {
            throw new Error(
              'Your account is pending approval by the administrator.'
            )
          } else if (errorMessage.includes('Account not confirmed')) {
            throw new Error(
              'Please verify your account by completing the OTP verification.'
            )
          } else {
            throw new Error('Invalid email or password')
          }
        } else if (axiosError.response?.status === 404) {
          throw new Error('User not found. Please register first.')
        } else {
          throw new Error(errorMessage || 'Login failed')
        }
      } else if ((error as Error).message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.')
      } else {
        throw new Error('Something went wrong. Please try again later.')
      }
    }
  }

  // Store the registration token from the registration response
  private registrationToken: string | null = null

  /**
   * Set the registration token after successful registration
   * @param token The registration token received from the registration response
   */
  setRegistrationToken(token: string) {
    this.registrationToken = token
  }

  /**
   * Get the stored registration token
   * @returns The stored registration token or null if not set
   */
  getRegistrationToken(): string | null {
    return this.registrationToken
  }

  /**
   * Verify OTP for user registration
   * @param otp OTP code received via email
   * @returns User data upon successful verification
   */
  /**
   * Verify the OTP the user received by e‑mail and finish registration.
   * Requires that `this.registrationToken` was set during `register()`.
   */
  async verifyOtpRegister(otp: string): Promise<OtpVerificationResponse> {
    if (!this.registrationToken) {
      throw new Error('No registration token found. Please register first.')
    }

    try {
      /* ───────────── call backend ───────────── */
      const { data } = await api.post('/auth/complete-registration', {
        registrationToken: this.registrationToken,
        otp,
      })
      console.log('Raw API response:', data)

      /* ───────────── normalise response shape ───────────── */
      const payload = data?.data ? data.data : data

      /* ───────────── build return object ───────────── */
      return {
        userId: payload.user?.id?.toString() ?? '',
        registrationToken: this.registrationToken,
        userStatus: payload.user?.userStatus,
        role: payload.user?.role?.id,
        token: payload.token ?? payload.jwt, // still exposed if caller wants it
        jwt: payload.jwt ?? payload.token, // same field, different name
        message: payload.message ?? 'Verification successful',
      }
    } catch (error) {
      /* ───────────── error handling ───────────── */
      if ((error as AxiosError).response) {
        const axiosErr = error as AxiosError<any>
        const status = axiosErr.response?.status
        const msg =
          axiosErr.response?.data?.message || 'OTP verification failed'

        switch (status) {
          case 400:
            throw new Error(msg || 'Invalid or expired OTP')
          case 404:
            throw new Error(
              'No registration data found. Please register again.'
            )
          case 409:
            throw new Error('This email is already registered.')
          default:
            throw new Error(msg)
        }
      }
      if ((error as Error).message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.')
      }
      throw new Error('Something went wrong. Please try again later.')
    }
  }

  /**
   * Resend OTP for registration or password reset
   * @param email User email
   * @param type Type of OTP (signup or reset)
   */
  async resendOtp(
    email: string,
    type: 'signup' | 'reset' = 'signup'
  ): Promise<void> {
    try {
      await api.post('/auth/resend-otp', {
        email,
        purpose: type === 'signup' ? 'registration' : 'password_reset',
      })
    } catch (error) {
      // Handle API errors
      if ((error as AxiosError).response) {
        const axiosError = error as AxiosError<any>
        throw new Error(
          axiosError.response?.data?.message || 'Failed to resend OTP'
        )
      } else if ((error as Error).message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.')
      } else {
        throw new Error('Something went wrong. Please try again later.')
      }
    }
  }

  // Change user password
  private async getUserInfo(): Promise<{ id: string; email: string }> {
    const token = await AsyncStorage.getItem('authToken')
    if (!token) {
      throw new Error('Authorization token not found. Please log in again.')
    }

    const decodedToken = decodeToken(token)
    if (!decodedToken || !decodedToken.id || !decodedToken.email) {
      throw new Error('User information not found. Please log in again.')
    }

    return { id: decodedToken.id, email: decodedToken.email }
  }

  // Validates the current password by attempting to login
  private async validatePassword(
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      await api.post<ApiResponse<LoginResponse>>('/auth/login', {
        email,
        password,
      })
      return true
    } catch (error) {
      console.log('Password validation failed:', error)
      return false
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { id, email } = await this.getUserInfo()

      const isPasswordValid = await this.validatePassword(
        email,
        currentPassword
      )

      if (!isPasswordValid) {
        throw new Error('Current password is incorrect')
      }

      const response = await api.post<ApiResponse<any>>(
        '/users/change-password',
        { id, email, password: newPassword }
      )

      return {
        success: true,
        message: response.data.message || 'Password changed successfully',
      }
    } catch (error) {
      console.error('Change password error:', error)

      if (
        error instanceof Error &&
        error.message === 'Current password is incorrect'
      ) {
        throw error
      }

      if ((error as AxiosError).response) {
        const axiosError = error as AxiosError<any>
        const errorMsg =
          axiosError.response?.data?.message || 'Failed to change password'
        throw new Error(errorMsg)
      }

      throw error
    }
  }
}

export const authService = new AuthService()

/**
 * Decode a JWT token
 * @param token JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Get the current user ID from the stored JWT token
 * @returns User ID string or null if not found
 */
export const getCurrentUserId = async (): Promise<number | null> => {
  try {
    const token = await AsyncStorage.getItem('authToken')

    if (!token) {
      console.warn('No auth token found in AsyncStorage')
      return null
    }

    const decodedToken = decodeToken(token)
    if (!decodedToken || !decodedToken.id) {
      console.warn('Could not extract user ID from token')
      return null
    }

    return decodedToken.id
  } catch (error) {
    console.error('Error getting current user ID:', error)
    return null
  }
}

/**
 * Get the current user information from stored user data
 * @returns User information or null if not found
 */
export const getCurrentUser = async () => {
  try {
    // First try to get stored user data
    const storedUserData = await AsyncStorage.getItem('userData')
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData)
        console.log('DEBUG - Retrieved stored user data:', userData)
        return userData
      } catch (parseError) {
        console.warn('Failed to parse stored user data:', parseError)
      }
    }

    // Fallback: Check if we have a valid auth token
    const token = await AsyncStorage.getItem('authToken')
    if (!token) {
      console.warn('No auth token or user data found in AsyncStorage')
      return null
    }

    const decodedToken = decodeToken(token)
    console.log(
      'DEBUG - Full decoded token (fallback):',
      JSON.stringify(decodedToken, null, 2)
    )

    if (!decodedToken || !decodedToken.id) {
      console.warn('Could not decode token or extract user ID')
      return null
    }

    // Return minimal user info from token as fallback
    const userInfo = {
      id: decodedToken.id.toString(),
      email: '',
      fullName: '',
      status: '',
    }

    console.log('DEBUG - Extracted user info (fallback):', userInfo)
    return userInfo
  } catch (error) {
    console.error('Error getting current user information:', error)
    return null
  }
}
