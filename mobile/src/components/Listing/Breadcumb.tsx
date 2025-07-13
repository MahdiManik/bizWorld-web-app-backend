import { View, Text, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"
import tw from "@/lib/tailwind"

type BreadcrumbProps = {
  title: string
  onBackPress: () => void
}

export const Breadcrumb = ({ title, onBackPress }: BreadcrumbProps) => {
  return (
    <View style={tw`flex-row items-center p-4 bg-blue-900`}>
      <TouchableOpacity onPress={onBackPress} style={tw`flex-row items-center`}>
        <Feather name="chevron-left" size={24} color="white" />
        <Text style={tw`text-white font-medium ml-2`}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}
