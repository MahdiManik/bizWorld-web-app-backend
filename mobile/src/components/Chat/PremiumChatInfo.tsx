import { colors } from '@/constants/colors'
import tw from '@/lib/tailwind'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export const PremiumChatInfo = () => {
  const router = useRouter()

  const handleUpgradeNow = () => {
    router.push('/account-settings/subscription/upgrade-pro')
  }

  return (
    <View style={tw`mb-8`}>
      <Image
        source={require('../../../assets/images/chat-img.png')}
        style={tw`w-full h-80`}
        resizeMode="contain"
      />
      <View style={tw`text-center flex-1`}>
        <Text
          style={[
            tw`text-base font-semibold text-center px-2 mb-2`,
            { color: colors.black },
          ]}>
          Go premium to unlock startup access and start chatting with sellers.
        </Text>
        <Text
          style={[
            tw`text-sm text-center px-2 mb-4`,
            { color: colors.primary['50'] },
          ]}>
          A Premium account is required to chat with sellers.
        </Text>
        <TouchableOpacity onPress={handleUpgradeNow} style={tw`w-full`}>
          <Text
            style={[
              tw`text-base font-semibold text-center px-2 py-2 rounded-lg mb-2`,
              {
                color: colors.white,
                backgroundColor: colors.primary.DEFAULT,
              },
            ]}>
            Upgrade Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
