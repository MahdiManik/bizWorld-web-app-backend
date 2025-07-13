import React from 'react'
import { Stack } from 'expo-router/stack'
import { View } from 'react-native'
import tw from '@/lib/tailwind'
import { OnboardingProvider } from '@/contexts/OnboardingContexts'

const AuthLayout = () => {
  return (
    <OnboardingProvider>
      <View style={tw`flex-1`}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Authentication screens */}
          <Stack.Screen name="login/index" />
          <Stack.Screen name="sign-up/index" />
          <Stack.Screen name="verify-otp/index" />
          <Stack.Screen name="forget-pass/index" />
          <Stack.Screen name="otp-enter/index" />
          <Stack.Screen name="reset-pass/index" />

          {/* Onboarding screens */}
          <Stack.Screen name="onboarding/index" />
          <Stack.Screen name="onboarding-two/index" />
        </Stack>
      </View>
    </OnboardingProvider>
  )
}

export default AuthLayout
