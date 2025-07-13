import { View, Text } from 'react-native'
import tw from '@/lib/tailwind'

type StatCardProps = {
  label: string
  value: number | string
}

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <View style={tw`rounded-lg border border-gray-200 px-4 py-2 flex-1 mx-2`}>
      <Text style={tw`text-gray-500 text-sm mb-1`}>{label}</Text>
      <Text style={tw`text-gray-800 text-xl font-bold`}>{value}</Text>
    </View>
  )
}
