import { View, TextInput, TouchableOpacity, Image } from 'react-native'
import { Feather } from '@expo/vector-icons'
import tw from '@/lib/tailwind'
import { colors } from '@/constants/colors'

type SearchInputProps = {
  value: string
  onChangeText: (text: string) => void
  onFilterPress?: () => void
  placeholder?: string
}

export const SearchInput = ({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search...',
}: SearchInputProps) => {
  return (
    <View style={tw`py-2`}>
      <View
        style={tw`flex-row items-center bg-gray-100 rounded-lg px-4 py-1 relative`}>
        <Feather name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={tw`flex-1 ml-2 mr-8 text-gray-800 py-2 px-2 focus:outline-none`}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
        />

        {onFilterPress && (
          <>
            <View
              style={tw`absolute right-10 top-2 bottom-2 w-[1px] bg-gray-300`}
            />
            <TouchableOpacity
              onPress={onFilterPress}
              style={tw`absolute right-3 top-0 bottom-0 justify-center`}>
              <Feather
                name="sliders"
                size={20}
                color={colors.primary.DEFAULT}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}
