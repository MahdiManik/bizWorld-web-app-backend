'use client'

import { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSearchParams } from 'expo-router/build/hooks'
import { Feather } from '@expo/vector-icons'
import { OTPInput } from '@/components/auth/OTPInput'
import { Button } from '@/components/auth/Button'
import { HeaderImage } from '@/components/auth/HeaderImage'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { useAuthStore } from '@/store/useAuthStore'

export default function VerifyOTPScreen() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') || undefined
  const type = params.get('type') || 'signup'

  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Get auth state and actions from store
  const isLoading = useAuthStore((state) => state.isLoading)
  const verifyOtp = useAuthStore((state) => state.verifyOtp)
  const setAuthError = useAuthStore((state) => state.setError)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleVerifyOTP = async () => {
    // Reset error
    setAuthError(null)

    if (otp.length !== 4) {
      setAuthError('Please enter a valid 4-digit code')
      return
    }

    try {
      const { success, requiresConfirmation } = await verifyOtp(otp)

      if (success) {
        if (requiresConfirmation) {
          router.replace('/onboarding')
        } else {
          // Navigate based on verification type
          if (type === 'reset') {
            router.replace('/onboarding')
          } else {
            router.replace('/onboarding')
          }
        }
      } else {
        // Error is already set in the store by verifyOtp action
        console.error('OTP verification failed')
      }
    } catch (error) {
      console.error('Unexpected error during OTP verification:', error)
      setAuthError('An unexpected error occurred. Please try again.')
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    try {
      // Reset timer and disable resend button
      setTimeLeft(60)
      setCanResend(false)
      setAuthError(null)

      // TODO: Implement resend OTP functionality in the store if needed
      // For now, just show success message
      Alert.alert(
        'Verification Code Sent',
        'A new verification code has been sent to your email.'
      )

      // Start the countdown
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      console.error('Resend OTP error:', error)
      setAuthError('Failed to resend code. Please try again.')
    }
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={tw`flex-grow px-6 pt-4 justify-between`}>
        <View>
          {/* Top section with image */}
          <HeaderImage />
          {/* Middle section with content */}
          <View style={tw`flex-1 justify-center mb-8`}>
            <View style={tw`mb-6 mt-2`}>
              <TouchableOpacity
                style={tw`flex-row items-center`}
                onPress={() => {
                  console.log('Back button pressed')
                  // First try regular back navigation
                  try {
                    router.replace('/sign-up')
                  } catch (e) {
                    console.error('Error using router.back():', e)
                    // Fallback: Navigate to sign-up screen directly
                    if (type === 'reset') {
                      router.replace('/forgot-password')
                    } else {
                      router.replace('/sign-up')
                    }
                  }
                }}
                activeOpacity={0.7}>
                <Feather
                  name="chevron-left"
                  size={20}
                  color={colors.primary.DEFAULT}
                />
                <Text style={{ color: colors.primary.DEFAULT, marginLeft: 4 }}>
                  Back
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>
              {type === 'reset' ? 'Password Reset' : 'Account Authentication'}
            </Text>
            <Text style={tw`text-gray-600 mb-6`}>
              A four-digit PIN has been sent to your email ({email}). Input the
              code to validate your{' '}
              {type === 'reset' ? 'password reset' : 'account creation'}.
            </Text>

            <OTPInput
              length={4}
              onComplete={setOtp}
              // error={authError || undefined}
            />
          </View>
        </View>

        {/* Bottom section with button */}
        <View style={tw`mb-12`}>
          <Button
            title={isLoading ? 'Verifying...' : 'Verify Account'}
            onPress={handleVerifyOTP}
            variant="primary"
            loading={isLoading}
            disabled={isLoading || otp.length !== 4}
          />

          <View style={tw`flex-row justify-between items-center mt-6`}>
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={!canResend || isLoading}
              style={[
                tw`py-2 px-4 rounded-lg flex-row items-center justify-center`,
                canResend && !isLoading ? tw`bg-primary` : tw`bg-gray-300`,
              ]}>
              <Feather
                name="refresh-cw"
                size={16}
                color={canResend && !isLoading ? 'white' : colors.gray[500]}
                style={tw`mr-2`}
              />
              <Text
                style={[
                  tw`text-sm font-medium`,
                  canResend && !isLoading ? tw`text-white` : tw`text-gray-500`,
                ]}>
                {isLoading ? 'Sending...' : 'Resend Code'}
              </Text>
            </TouchableOpacity>
            {!canResend && <Text style={tw`text-gray-500`}>{timeLeft}s</Text>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
