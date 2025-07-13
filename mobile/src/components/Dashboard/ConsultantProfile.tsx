import { Text, Image, TouchableOpacity } from 'react-native'
import tw from '@/lib/tailwind'

type ConsultantProfileProps = {
  id: string
  name: string
  image: string
  onPress: () => void
}

export const ConsultantProfile = ({
  id,
  name,
  image,
  onPress,
}: ConsultantProfileProps) => {
  return (
    <TouchableOpacity style={tw`items-center`} onPress={onPress}>
      <Image
        source={{ uri: image }}
        style={tw`w-16 h-16 rounded-full mb-1`}
        resizeMode="cover"
      />
      <Text style={tw`text-gray-800 text-sm text-center`}>{name}</Text>
    </TouchableOpacity>
  )
}
