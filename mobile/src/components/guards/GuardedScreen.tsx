import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

interface GuardedScreenProps {
  children: React.ReactNode
  isLoading: boolean
  canAccess: boolean
  loadingText?: string
  accessDeniedText?: string
}

export function GuardedScreen({
  children,
  isLoading,
  canAccess,
  loadingText = 'Checking access...',
  accessDeniedText = 'Access denied. Redirecting...'
}: GuardedScreenProps) {
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={tw`mt-4 text-gray-600 text-center`}>{loadingText}</Text>
      </View>
    )
  }

  if (!canAccess) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={tw`mt-4 text-gray-600 text-center`}>{accessDeniedText}</Text>
      </View>
    )
  }

  return <>{children}</>
}
