import { View, Text, TouchableOpacity } from 'react-native'

import tw from '@/lib/tailwind'
import { Feather } from '@expo/vector-icons'
import { colors } from '@/constants/colors'
import { SimpleLineIcons } from '@expo/vector-icons'

type HeaderProps = {
  title: string
  onBackPress?: () => void
  showBackButton?: boolean
  showNotification?: boolean
  onNotificationPress?: () => void
  customLeftIcon?: React.ReactNode
}

export const Header = ({
  title,
  onBackPress,
  showBackButton = false,
  showNotification = true,
  onNotificationPress,
  customLeftIcon,
}: HeaderProps) => {
  return (
    <View
      style={[
        tw`flex-row justify-between items-center px-4 py-5 mb-3`,
        { backgroundColor: colors.primary.DEFAULT },
      ]}>
      <View style={tw`flex-row items-center gap-2`}>
        {customLeftIcon ? (
          customLeftIcon
        ) : showBackButton && onBackPress ? (
          <TouchableOpacity onPress={onBackPress}>
            <SimpleLineIcons name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
        ) : null}
        <Text
          style={[
            tw`text-white font-semibold text-base`,
            showBackButton ? tw`ml-2` : null,
          ]}>
          {title}
        </Text>
      </View>
      {showNotification && (
        <TouchableOpacity onPress={onNotificationPress}>
          <Feather name="bell" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  )
}
