import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tailwind";

type FloatingActionButtonProps = {
  onPress: () => void;
  icon?: string;
};

export const FloatingActionButton = ({
  onPress,
  icon = "plus",
}: FloatingActionButtonProps) => {
  return (
    <TouchableOpacity
      style={tw`absolute bottom-20 right-4 bg-blue-900 w-14 h-14 rounded-full items-center justify-center shadow-lg z-10`}
      onPress={onPress}
    >
      <Feather name={icon} size={24} color="white" />
    </TouchableOpacity>
  );
};
