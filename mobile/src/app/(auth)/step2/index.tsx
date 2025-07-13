import React from 'react'
import OnboardingStep2 from '@/components/auth/OnboardingStep2'
import { useOnboardingGuard } from '@/hooks/useNavigationGuard'
import { GuardedScreen } from '@/components/guards/GuardedScreen'

export default function OnboardingStep2Screen() {
  // Navigation guard - prevent access if not logged in or already completed
  const { canAccess, isLoading } = useOnboardingGuard()

  return (
    <GuardedScreen
      isLoading={isLoading}
      canAccess={canAccess}
      loadingText="Checking onboarding status..."
      accessDeniedText="Redirecting...">
      <OnboardingStep2 />
    </GuardedScreen>
  )
}
