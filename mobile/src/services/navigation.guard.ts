import AsyncStorage from '@react-native-async-storage/async-storage'
import { getCurrentUser, getCurrentUserId } from './auth.service'
import { profileService } from './profile.service'
import { companyService } from './company.service'

export interface NavigationGuardResult {
  canAccess: boolean
  redirectTo?: string
  reason?: string
}

export class NavigationGuard {
  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      // Check for all possible token variations
      const tokens = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('access_token'),
        AsyncStorage.getItem('jwt'),
      ])

      // Any valid token indicates authentication
      const hasToken = tokens.some((token) => !!token)
      const userId = await getCurrentUserId()

      return !!(hasToken && userId)
    } catch (error) {
      console.error('Error checking authentication:', error)
      return false
    }
  }

  /**
   * Check for force navigation flag set during logout from onboarding
   */
  static async hasForceNavigationFlag(): Promise<boolean> {
    try {
      const forceNav = await AsyncStorage.getItem('force_navigation')
      if (forceNav === 'true') {
        // Clear the flag after reading it
        await AsyncStorage.removeItem('force_navigation')
        console.log('Force navigation flag detected and cleared')
        return true
      }
      return false
    } catch (error) {
      console.error('Error checking force navigation flag:', error)
      return false
    }
  }

  /**
   * Check if user has completed profile
   */
  static async hasCompletedProfile(): Promise<boolean> {
    try {
      const profile = await profileService.getUserProfile()
      if (!profile) return false

      // Check if user has basic profile information through user_profile key
      // This is the key used by the backend when populating relations
      console.log('Checking profile completion with data:', profile)
      return !!(
        profile.professionalHeadline &&
        profile.industrySpecialization &&
        profile.id &&
        profile?.document
      )
    } catch (error) {
      console.error('Error checking profile completion:', error)
      return false
    }
  }

  /**
   * Check if user has completed company setup
   */
  static async hasCompletedCompany(): Promise<boolean> {
    try {
      const company = await companyService.getUserCompany()
      if (!company) return false

      // Check if user has company information
      return !!(
        company &&
        company.name &&
        company.industry &&
        company.location &&
        company.id
      )
    } catch (error) {
      console.error('Error checking company completion:', error)
      return false
    }
  }

  /**
   * Check if user has completed onboarding (both profile and company)
   */
  static async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const profile = await profileService.getUserProfile()
      const company = await companyService.getUserCompany()

      if (!profile || !company) return false

      // Direct check for user_profile and company existence
      console.log('Checking onboarding completion with data:', profile)
      console.log('Has profile:', !!profile)
      console.log('Has company:', !!company)

      // Check if both profile and company exist
      return !!(profile && company)
    } catch (error) {
      console.error('Error checking onboarding completion:', error)
      return false
    }
  }

  /**
   * Check if user has pending status
   */
  static async isPendingUser(): Promise<boolean> {
    try {
      const userData = await getCurrentUser()
      if (!userData) return false

      // Check if user status is 'PENDING'
      return userData.status === 'PENDING'
    } catch (error) {
      console.error('Error checking user pending status:', error)
      return false
    }
  }

  /**
   * Guard for login page - determines if user should see login page or be redirected
   */
  static async canAccessLogin(): Promise<NavigationGuardResult> {
    const isAuth = await this.isAuthenticated()
    if (!isAuth) {
      // 1) Not logged in → show login form
      console.log(
        'NAVIGATION GUARD: User not authenticated - allowing login access'
      )
      return { canAccess: true }
    }

    const isPending = await this.isPendingUser()
    if (isPending) {
      // 2) Logged in but still PENDING → show "Account not approved" login form
      console.log(
        'NAVIGATION GUARD: User has pending status - allowing login access'
      )
      return { canAccess: true }
    }

    const hasOnboard = await this.hasCompletedOnboarding()
    if (hasOnboard) {
      // 3) Fully onboarded → skip login, go to dashboard
      console.log(
        'NAVIGATION GUARD: User has completed onboarding - redirecting to dashboard'
      )
      return {
        canAccess: false,
        redirectTo: '/dashboard',
        reason: 'User has completed onboarding',
      }
    }

    // 4) Logged in + APPROVED but missing profile/company → force back to onboarding
    console.log('NAVIGATION GUARD: User needs to complete onboarding')
    return {
      canAccess: false,
      redirectTo: '/onboarding',
      reason: 'User should complete onboarding first',
    }
  }

  /**
   * Guard for signup page - authenticated users should not access
   * (Except for pending users who are allowed to see the login page with a message)
   */
  static async canAccessSignup(): Promise<NavigationGuardResult> {
    const isAuth = await this.isAuthenticated()

    if (isAuth) {
      // Check if user has pending status
      const isPending = await this.isPendingUser()
      if (isPending) {
        // Redirect pending users to login page instead of signup
        return {
          canAccess: false,
          redirectTo: '/login',
          reason:
            'Your account is pending approval. Please wait for activation.',
        }
      }

      const hasOnboarding = await this.hasCompletedOnboarding()
      return {
        canAccess: false,
        redirectTo: hasOnboarding ? '/dashboard' : '/onboarding',
        reason: 'User is already registered and logged in',
      }
    }

    return { canAccess: true }
  }

  /**
   * Guard for onboarding page - completed users should not access
   */
  static async canAccessOnboarding(): Promise<NavigationGuardResult> {
    const isAuth = await this.isAuthenticated()

    if (!isAuth) {
      return {
        canAccess: false,
        redirectTo: '/login',
        reason: 'User must be logged in to access onboarding',
      }
    }

    const hasOnboarding = await this.hasCompletedOnboarding()
    if (hasOnboarding) {
      return {
        canAccess: false,
        redirectTo: '/dashboard',
        reason: 'User has already completed onboarding',
      }
    }

    return { canAccess: true }
  }

  /**
   * Guard for protected pages - requires authentication, completed onboarding, and non-pending status
   */
  static async canAccessProtectedPage(): Promise<NavigationGuardResult> {
    const isAuth = await this.isAuthenticated()
    if (!isAuth) {
      return {
        canAccess: false,
        redirectTo: '/login',
        reason: 'User must be logged in',
      }
    }

    const isPending = await this.isPendingUser()
    if (isPending) {
      return {
        canAccess: false,
        redirectTo: '/login',
        reason: 'Account pending approval. Please try again later.',
      }
    }

    const hasOnboard = await this.hasCompletedOnboarding()
    if (!hasOnboard) {
      return {
        canAccess: false,
        redirectTo: '/onboarding',
        reason: 'User must complete onboarding first',
      }
    }

    return { canAccess: true }
  }

  /**
   * Get the appropriate redirect route for current user state
   */
  static async getRedirectRoute(): Promise<string> {
    const isAuth = await this.isAuthenticated()

    if (!isAuth) {
      return '/login'
    }

    // Pending users should be redirected to login page
    const isPending = await this.isPendingUser()
    if (isPending) {
      // Since they're already authenticated but pending approval,
      // we redirect to login where they'll see a message
      return '/login'
    }

    const hasOnboarding = await this.hasCompletedOnboarding()
    if (!hasOnboarding) {
      return '/onboarding'
    }

    return '/dashboard'
  }
}
