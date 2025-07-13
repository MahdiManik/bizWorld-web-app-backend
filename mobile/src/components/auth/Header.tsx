import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'

type HeaderProps = {
  title?: string
  showBackButton?: boolean
  onBackPress?: () => void
}

export const Header = ({
  title,
  showBackButton = true,
  onBackPress,
}: HeaderProps) => {
  return (
    <View style={tw`flex-row items-center py-4`}>
      {showBackButton && (
        <TouchableOpacity style={tw`p-2 mr-2`} onPress={onBackPress}>
          <Feather name="arrow-left" size={24} color="#1e40af" />
        </TouchableOpacity>
      )}
      {title && <Text style={tw`text-base  text-gray-800`}>{title}</Text>}
    </View>
  )
}
