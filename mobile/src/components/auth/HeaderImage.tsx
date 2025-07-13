import { View, Image } from "react-native";
import tw from "@/lib/tailwind";

type HeaderImageProps = {
  size?: "small" | "medium" | "large";
};

export const HeaderImage = ({ size = "large" }: HeaderImageProps) => {
  const sizeStyles = {
    small: tw`w-20 h-20`,
    medium: tw`w-32 h-32`,
    large: tw`w-64 h-64`,
  };

  return (
    <View style={tw`items-center justify-center mb-6`}>
      <View style={tw`p-2`}>
        <Image
          source={require("../../assets/images/auth-img.png")}
          style={sizeStyles[size]}
          resizeMode="contain"
          accessibilityLabel="Business analytics illustration"
        />
      </View>
    </View>
  );
};
