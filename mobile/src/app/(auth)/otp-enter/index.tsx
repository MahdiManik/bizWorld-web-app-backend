'use client'

import { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSearchParams } from 'expo-router/build/hooks'
import { Feather } from '@expo/vector-icons'
import { OTPInput } from '@/components/auth/OTPInput'
import { Button } from '@/components/auth/Button'
import { HeaderImage } from '@/components/auth/HeaderImage'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { authService } from '@/services/auth.service'
import { useForm } from 'react-hook-form'
import { useToast } from '@/utils/toast'

export default function VerifyOTPScreen() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') || ''
  // const flow = params.get('flow') || 'reset-password'
  const toast = useToast()

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [canResend, setCanResend] = useState(false)

  // Use React Hook Form for future expansion
  const { handleSubmit } = useForm()

  useEffect(() => {
    // Only start the timer if we're not already able to resend
    if (!canResend) {
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
    }
  }, [canResend])

  const onSubmit = async () => {
    // Reset states
    setApiError('')
    setSuccess(false)

    if (otp.length !== 4) {
      setApiError('Please enter a valid 4-digit code')
      return
    }

    setLoading(true)

    try {
      // Call the verification API
      const result = await authService.verifyOtp(email, otp)

      if (result.verified) {
        // Show success state briefly
        setSuccess(true)

        // Show toast notification
        toast.show('OTP verified successfully', {
          type: 'success',
          placement: 'top',
          duration: 4000,
        })

        // Navigate to reset password screen
        setTimeout(() => {
          // Pass email and code as URL parameters
          const params = new URLSearchParams({
            email: email,
            code: result.code || ''
          })
          router.push(`/reset-pass?${params.toString()}`)
        }, 1000)
      } else {
        setApiError('Verification failed. Please try again.')
        toast.show('Verification failed. Please try again.', {
          type: 'danger',
          placement: 'top',
          duration: 4000,
        })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Invalid verification code. Please try again.'

      setApiError(errorMessage)
      toast.show(errorMessage, {
        type: 'danger',
        placement: 'top',
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    setLoading(true)
    setApiError('')

    try {
      // Call the resend OTP API with the purpose parameter
      await authService.resendOtp(email, 'reset')

      // Reset timer
      setTimeLeft(30)
      setCanResend(false)

      // Show success toast
      toast.show('Verification code resent', {
        type: 'success',
        placement: 'top',
        duration: 4000,
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to resend code. Please try again.'

      setApiError(errorMessage)
      toast.show(errorMessage, {
        type: 'danger',
        placement: 'top',
        duration: 4000,
      })
    } finally {
      setLoading(false)
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
                onPress={() => router.push('/forget-pass')}>
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
              Account Authentication
            </Text>

            <OTPInput length={4} onComplete={setOtp} error={apiError} />

            {success && (
              <View style={tw`bg-green-100 p-3 rounded-lg mb-4 mt-4`}>
                <Text style={tw`text-green-800`}>Verification successful!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom section with button */}
        <View style={tw`mb-12`}>
          <Button
            title="Verify Code"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            variant="primary"
          />

          <View style={tw`flex-row justify-between items-center mt-6`}>
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={!canResend || loading}>
              <Text
                style={[
                  canResend
                    ? { color: colors.primary.DEFAULT }
                    : tw`text-gray-400`,
                ]}>
                Did not receive code?{' '}
                <Text style={tw`font-medium`}>Send again</Text>
              </Text>
            </TouchableOpacity>
            {!canResend && <Text style={tw`text-gray-500`}>{timeLeft}s</Text>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
