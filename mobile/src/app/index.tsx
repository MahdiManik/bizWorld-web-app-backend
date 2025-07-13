import { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Redirect } from 'expo-router'
import { NavigationGuard } from '@/services/navigation.guard'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

export default function Index() {
  const [redirectRoute, setRedirectRoute] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const determineRoute = async () => {
      try {
        const route = await NavigationGuard.getRedirectRoute()
        setRedirectRoute(route)
      } catch (error) {
        console.error('Error determining route:', error)
        setRedirectRoute('/(auth)/login')
      } finally {
        setIsLoading(false)
      }
    }

    determineRoute()
  }, [])

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    )
  }

  if (redirectRoute) {
    return <Redirect href={redirectRoute as any} />
  }

  // Fallback
  return <Redirect href="/(auth)/login" />
}
