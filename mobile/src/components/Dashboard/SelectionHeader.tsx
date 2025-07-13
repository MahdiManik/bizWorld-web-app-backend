import { View, Text, TouchableOpacity } from "react-native";
import tw from "@/lib/tailwind";

type SectionHeaderProps = {
  title: string;
  onViewAll?: () => void;
};

export const SectionHeader = ({ title, onViewAll }: SectionHeaderProps) => {
  return (
    <View style={tw`flex-row justify-between items-center mb-3`}>
      <Text style={tw`text-gray-800 font-bold text-lg`}>{title}</Text>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Text style={tw`text-blue-900 font-medium`}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
