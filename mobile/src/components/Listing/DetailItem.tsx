import type { ReactNode } from 'react'
import { View, Text } from 'react-native'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

type DetailItemProps = {
  icon: ReactNode
  label: string
  value: string | ReactNode
}

export const DetailItem = ({ icon, label, value }: DetailItemProps) => {
  return (
    <View style={tw`flex-row items-center py-4`}>
      <View style={tw`mr-3`}>{icon}</View>
      <Text
        style={[
          tw`w-1/2 text-sm font-medium`,
          { color: colors.secondary[300] },
        ]}>
        {label}
      </Text>
      {typeof value === 'string' ? (
        <Text
          style={[
            tw`flex-1 text-base font-semibold`,
            { color: colors.primary[50] },
          ]}>
          {value}
        </Text>
      ) : (
        <View style={tw`flex-1`}>{value}</View>
      )}
    </View>
  )
}
