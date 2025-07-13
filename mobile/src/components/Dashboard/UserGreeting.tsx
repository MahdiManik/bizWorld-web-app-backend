import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { useRouter } from 'expo-router'

type UserGreetingProps = {
  name: string
  subtitle?: string
  avater?: string
  onNotificationPress?: () => void
  onProfilePress?: () => void
}

export const UserGreeting = ({
  name,
  subtitle,
  avater,
  onNotificationPress,
  onProfilePress,
}: UserGreetingProps) => {
  const router = useRouter()

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress()
    } else {
      router.push('/account-settings')
    }
  }
  return (
    <View style={tw`flex-row justify-between items-center`}>
      <TouchableOpacity
        style={tw`flex-row items-center`}
        onPress={handleProfilePress}>
        {avater ? (
          <Image
            source={{ uri: avater }}
            style={tw`w-10 h-10 rounded-full mr-3`}
            resizeMode="cover"
          />
        ) : (
          <View
            style={tw`bg-gray-200 w-10 h-10 rounded-full items-center justify-center mr-3`}>
            <Feather name="user" size={20} color="#4B5563" />
          </View>
        )}
      </TouchableOpacity>
      <View>
        <Text style={tw`text-gray-800 font-bold text-lg`}>Hi, {name}</Text>

        {subtitle && <Text style={tw`text-gray-500`}>{subtitle}</Text>}
      </View>
      {onNotificationPress && (
        <TouchableOpacity onPress={onNotificationPress}>
          <Feather name="bell" size={24} color="#1E3A8A" />
        </TouchableOpacity>
      )}
    </View>
  )
}
