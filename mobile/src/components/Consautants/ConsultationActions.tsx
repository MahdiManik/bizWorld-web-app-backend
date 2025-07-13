import { TouchableOpacity, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

interface ConsultationActionCardProps {
  onPress: () => void
}

export default function ConsultationActionCard({
  onPress,
}: ConsultationActionCardProps) {
  return (
    <View style={tw`flex-row items-center justify-between bg-white w-full`}>
      <TouchableOpacity
        style={[
          tw`rounded-lg px-4 py-3 items-center mr-1 w-full flex-1`,
          { backgroundColor: colors.primary.DEFAULT },
        ]}
        onPress={onPress}
        activeOpacity={0.7}>
        <View style={tw`items-center`}>
          <Ionicons
            name="bulb-outline"
            size={28}
            color={colors.white}
            style={tw`mb-2`}
          />
          <Text
            style={[
              tw`font-semibold text-sm text-center`,
              { color: colors.white },
            ]}>
            Request Consultants
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          tw`rounded-lg px-4 py-3 items-center ml-1 bg-gray-200 w-full flex-1`,
          { backgroudColor: colors.gray[200] },
        ]}
        onPress={onPress}
        activeOpacity={0.7}>
        <View style={tw`items-center`}>
          <Ionicons
            name="chatbox-ellipses-outline"
            size={28}
            color={colors.primary.DEFAULT}
            style={tw`mb-2`}
          />
          <Text
            style={[
              tw`font-semibold text-sm text-center`,
              { color: colors.primary.DEFAULT },
            ]}>
            View Responses
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
