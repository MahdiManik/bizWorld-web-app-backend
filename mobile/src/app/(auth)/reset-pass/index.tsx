'use client'

import React, { useState } from 'react'
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
import { Input } from '@/components/auth/Input'
import { Button } from '@/components/auth/Button'
import { HeaderImage } from '@/components/auth/HeaderImage'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { authService } from '@/services/auth.service'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/utils/toast'

// Define password validation schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .refine(
        (val) => /[A-Z]/.test(val),
        'Password must contain at least one uppercase letter'
      )
      .refine(
        (val) => /[0-9]/.test(val),
        'Password must contain at least one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Path of the error
  })

type ResetPasswordFormData = z.infer<typeof passwordSchema>

export default function ResetPasswordScreen() {
  const router = useRouter()
  const params = useSearchParams()
  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    // Reset error state and set loading
    setSuccess(false)
    setLoading(true)

    try {
      // Call the API to reset the password
      const result = await authService.resetPassword(
        data.password,
        data.confirmPassword,
        params.get('code') || ''
      )

      if (result.success) {
        // Show success message
        setSuccess(true)

        // Show success toast
        toast.show('Password reset successfully!', {
          type: 'success',
          placement: 'top',
          duration: 4000,
        })

        // Navigate to login after a delay
        setTimeout(() => {
          router.replace('/(auth)/login')
        }, 2000)
      }
    } catch (error) {
      // Handle API errors
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to reset password. Please try again.'

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
                onPress={() => router.replace('/otp-enter')}>
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
              Reset Password
            </Text>
            <Text style={tw`text-gray-600 mb-6`}>
              Create a new password for your account
            </Text>

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="New Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Confirm New Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            {success && (
              <View style={tw`bg-green-100 p-3 rounded-lg mb-4 mt-4`}>
                <Text style={tw`text-green-800`}>
                  Password reset successful! Redirecting to login...
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom section with button */}
        <View style={tw`mb-12`}>
          <Button
            title="Reset Password"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            variant="primary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
