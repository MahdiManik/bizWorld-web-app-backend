'use client'

import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import Link from 'expo-router/link'
import { Feather } from '@expo/vector-icons'
import { Input } from '@/components/auth/Input'
import { Button } from '@/components/auth/Button'
import { HeaderImage } from '@/components/auth/HeaderImage'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignupGuard } from '@/hooks/useNavigationGuard'
import { GuardedScreen } from '@/components/guards/GuardedScreen'
import { authService } from '@/services/auth.service'
import toast from '@/lib/toast-notifications-web'
import { useAuthStore } from '@/store/useAuthStore'

// Define validation schema using zod
const signupSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Navigation guard - prevent access if already logged in
  const { canAccess, isLoading: guardLoading } = useSignupGuard()

  // Setup form with validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  })

  const handleSignup = async (data: SignupFormData) => {
    try {
      setLoading(true)

      const result = await authService.register(
        data.email,
        data.password,
        undefined,
        {
          fullName: data.fullName,
        }
      )

      if (result.registrationToken) {
        // Registration requires OTP verification - navigate to OTP screen
        router.push(
          `/(auth)/verify-otp?email=${encodeURIComponent(data.email)}&type=signup`
        )
      } else if (result.token && result.user) {
        // User is fully authenticated (no OTP required) - set auth and navigate to home
        const user = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.fullName,
          role: result.user.role?.id || 2, // Extract role ID from StrapiRole object
          userStatus: result.user.userStatus,
        }

        useAuthStore.getState().setAuth({
          token: result.token,
          user,
        })
        router.replace('/(tabs)/home')
      } else {
        // Unexpected response - show error
        toast.show(
          'Registration completed but unable to authenticate. Please try logging in.'
        )
      }
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Registration error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GuardedScreen
      isLoading={guardLoading}
      canAccess={canAccess}
      loadingText="Checking registration status..."
      accessDeniedText="Already registered. Redirecting...">
      <SafeAreaView style={tw`flex-1`}>
        <ScrollView
          contentContainerStyle={tw`flex-grow px-6 pt-4 justify-between bg-white`}>
          <View>
            {/* Top section with image */}
            <HeaderImage />

            {/* Middle section with inputs */}
            <View style={tw`flex-1 justify-center`}>
              <View style={tw`mb-6 mt-2`}>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity style={tw`flex-row items-center`}>
                    <Feather
                      name="chevron-left"
                      size={20}
                      color={colors.primary.DEFAULT}
                    />
                    <Text
                      style={{ color: colors.primary.DEFAULT, marginLeft: 4 }}>
                      Return to Sign in
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>

              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Name"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    error={errors.fullName?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Email"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    error={errors.password?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Bottom section with button */}
          <View style={tw`mb-12`}>
            <Button
              title="Sign Up"
              onPress={handleSubmit(handleSignup)}
              loading={loading}
              variant="primary"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GuardedScreen>
  )
}
