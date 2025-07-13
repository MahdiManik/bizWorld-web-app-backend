import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import tw from "@/lib/tailwind";
import { colors } from "@/constants/colors";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
  style?: any;
};

export const Button = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}: ButtonProps) => {
  const isPrimary = variant === "primary";
  const backgroundColor = isPrimary ? colors.primary.DEFAULT : "white";
  const textColor = isPrimary ? "white" : colors.primary.DEFAULT;

  return (
    <TouchableOpacity
      style={[
        tw`py-3.5 px-4 rounded-lg items-center justify-center w-full`,
        {
          backgroundColor,
          borderWidth: isPrimary ? 0 : 1,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[tw`font-semibold text-base`, { color: textColor }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
