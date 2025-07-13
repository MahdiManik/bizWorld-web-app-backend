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
import { Input } from '@/components/auth/Input'
import { Button } from '@/components/auth/Button'
import { HeaderImage } from '@/components/auth/HeaderImage'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from '@/services/auth.service'
import { useLoginGuard } from '@/hooks/useNavigationGuard'
import { GuardedScreen } from '@/components/guards/GuardedScreen'
import toast from '@/lib/toast-notifications-web'

// Define validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Use navigation guard for login page
  const { canAccess, isLoading, redirectReason } = useLoginGuard()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true)

    try {
      // Call the login API
      console.log('Attempting login with:', data.email)
      const userData = await authService.login(data.email, data.password)
      console.log('Login successful!', userData)

      // Small delay before navigation to ensure state is updated
      setTimeout(() => {
        // Navigate to dashboard on success
        toast.show('Login successful!', {
          type: 'success',
          placement: 'top',
          duration: 4000,
        })
        router.replace('/dashboard')
      }, 100)
    } catch (error) {
      console.error('Login error:', error)
      // Handle login errors
    } finally {
      setLoading(false)
    }
  }

  // If redirectReason exists, we could show it to the user
  if (!canAccess && redirectReason) {
    console.log('Login access denied:', redirectReason)
  }

  return (
    <GuardedScreen isLoading={isLoading} canAccess={canAccess}>
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <ScrollView
          contentContainerStyle={tw`flex-grow pt-4 justify-between px-6`}>
          <View>
            {/* Top section with image */}
            <HeaderImage size="large" />
            {/* Middle section with inputs */}
            <View style={tw`flex-1 justify-center`}>
              <View style={tw`mb-6`}>
                <Text style={tw`text-3xl font-bold text-gray-800 mb-2`}>
                  Welcome
                </Text>
                <Text style={tw`text-gray-600`}>
                  Elevate your career with our all-in-one business guide and
                  networking app.
                </Text>
              </View>
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

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={errors.password?.message}
                  />
                )}
              />

              <TouchableOpacity
                style={tw`self-end mb-12`}
                onPress={() => router.push('/forget-pass')}>
                <Text
                  style={{ color: colors.primary.DEFAULT, fontWeight: '500' }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom section with button */}
          <View style={tw`mb-12`}>
            <Button
              title="Login"
              onPress={handleSubmit(handleLogin)}
              loading={loading}
              variant="primary"
            />

            <View style={tw`flex-row justify-center mt-6`}>
              <Text style={tw`text-gray-600`}>
                Don&apos;t have an account?{' '}
              </Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text
                    style={{
                      color: colors.primary.DEFAULT,
                      fontWeight: '500',
                    }}>
                    Sign up here
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GuardedScreen>
  )
}
