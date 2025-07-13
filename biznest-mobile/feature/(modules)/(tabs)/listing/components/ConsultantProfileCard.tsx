import { Text, Image, TouchableOpacity } from "react-native";
import { ConsultantProfileProps } from "../types/typs";

export const ConsultantProfile = ({
  id,
  name,
  image,
  onPress,
}: ConsultantProfileProps) => {
  return (
    <TouchableOpacity className="items-center" onPress={onPress}>
      <Image
        source={{ uri: image }}
        className="w-16 h-16 rounded-full mb-1"
        resizeMode="cover"
      />
      <Text className="text-gray-800 text-sm text-center">{name}</Text>
    </TouchableOpacity>
  );
};
