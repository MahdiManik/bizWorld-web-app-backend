import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import {
  NavigationGuard,
  NavigationGuardResult,
} from '@/services/navigation.guard'

interface UseNavigationGuardOptions {
  guardType: 'login' | 'signup' | 'onboarding' | 'protected'
  redirectOnFail?: boolean
  showLoading?: boolean
}

interface UseNavigationGuardReturn {
  canAccess: boolean
  isLoading: boolean
  redirectReason?: string
}

export function useNavigationGuard({
  guardType,
  redirectOnFail = true,
  showLoading = true,
}: UseNavigationGuardOptions): UseNavigationGuardReturn {
  const [canAccess, setCanAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(showLoading)
  const [redirectReason, setRedirectReason] = useState<string>()
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const checkAccess = async () => {
      try {
        setIsLoading(true)
        let result: NavigationGuardResult

        switch (guardType) {
          case 'login':
            result = await NavigationGuard.canAccessLogin()
            break
          case 'signup':
            result = await NavigationGuard.canAccessSignup()
            break
          case 'onboarding':
            result = await NavigationGuard.canAccessOnboarding()
            break
          default:
            result = { canAccess: true }
        }

        if (!isMounted) return

        setCanAccess(result.canAccess)
        setRedirectReason(result.reason)

        // Redirect if access is denied and redirectOnFail is true
        if (!result.canAccess && redirectOnFail && result.redirectTo) {
          console.log(
            `Navigation Guard: Redirecting to ${result.redirectTo} - ${result.reason}`
          )
          router.replace(result.redirectTo as any)
        }
      } catch (error) {
        console.error('Navigation guard error:', error)
        if (isMounted) {
          setCanAccess(false)
          if (redirectOnFail) {
            router.replace('/login' as any)
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    checkAccess()

    return () => {
      isMounted = false
    }
  }, [guardType, redirectOnFail, router])

  return {
    canAccess,
    isLoading,
    redirectReason,
  }
}

// Specific hooks for common use cases
export function useLoginGuard() {
  return useNavigationGuard({ guardType: 'login' })
}

export function useSignupGuard() {
  return useNavigationGuard({ guardType: 'signup' })
}

export function useOnboardingGuard() {
  return useNavigationGuard({ guardType: 'onboarding' })
}

export function useProtectedPageGuard() {
  return useNavigationGuard({ guardType: 'protected' })
}
