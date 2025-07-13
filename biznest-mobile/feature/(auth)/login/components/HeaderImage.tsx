import { View, Image } from "react-native";

type HeaderImageProps = {
  size?: "small" | "medium" | "large";
};

export const HeaderImage = ({ size = "large" }: HeaderImageProps) => {
  const sizeStyles = {
    small: `w-20 h-20`,
    medium: `w-32 h-32`,
    large: `w-64 h-64`,
  };

  return (
    <View className="items-center justify-center mb-6">
      <View className="p-2">
        <Image
          source={require("../../../../assets/images/auth-img.png")}
          className={sizeStyles[size]}
          resizeMode="contain"
          accessibilityLabel="Business analytics illustration"
        />
      </View>
    </View>
  );
};
