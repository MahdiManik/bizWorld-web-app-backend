import { useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { Input } from '@/components/auth/Input'
import { Button } from '@/components/auth/Button'
import { HeaderImage } from '@/components/auth/HeaderImage'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '@/services/auth.service'
import { useToast } from '@/utils/toast'

// authService is already imported directly

// Define validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export default function ForgetPasswordScreen() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    // Reset state
    setApiError('')
    setSuccess(false)
    setLoading(true)

    try {
      // Call the forgot password API
      await authService.forgotPassword(data.email)

      // Show success message
      setSuccess(true)

      // Show success toast
      toast.show('Reset code sent to your email', {
        type: 'success',
        placement: 'top',
        duration: 4000,
      })

      // Navigate to OTP verification after a delay
      setTimeout(() => {
        // Store email in params to pass to OTP screen
        // Pass email as a URL parameter
        router.push(
          `/(auth)/otp-enter?email=${encodeURIComponent(data.email)}&flow=reset-password`
        )
      }, 2000)
    } catch (error) {
      // Handle specific error
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to send reset code. Please try again.'

      setApiError(errorMessage)

      // Show error toast
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
          <View style={tw`flex-1 justify-center`}>
            <View style={tw`mb-6 mt-2`}>
              <TouchableOpacity
                style={tw`flex-row items-center`}
                onPress={() => router.replace('/login')}>
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
              Forgot Password
            </Text>
            <Text style={tw`text-gray-600 mb-6`}>
              Enter your email address and we&apos;ll send you a code to reset
              your password
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  error={errors.email?.message}
                />
              )}
            />

            {success && (
              <View style={tw`bg-green-100 p-3 rounded-lg mb-4 mt-4`}>
                <Text style={tw`text-green-800`}>
                  Reset code sent to your email
                </Text>
              </View>
            )}

            {apiError && (
              <View style={tw`bg-red-100 p-3 rounded-lg mb-4 mt-4`}>
                <Text style={tw`text-red-800`}>{apiError}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom section with button */}
        <View style={tw`mb-12`}>
          <Button
            title="Send Reset Code"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            variant="primary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
