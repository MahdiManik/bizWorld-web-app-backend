import colors from "@/constants/colors";
import cn from "@/lib/utils";
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Eye Icon Components using Expo Vector Icons
const EyeIcon = ({ size = 20, color = "#6B7280" }) => (
  <MaterialIcons name="visibility" size={size} color={color} />
);

const EyeSlashIcon = ({ size = 20, color = "#6B7280" }) => (
  <MaterialIcons name="visibility-off" size={size} color={color} />
);

export interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  variant?: "default" | "compact" | "password";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad";
  type?: "text" | "select" | "radio" | "file" | "tag" | "image" | "phone";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "off" | "email" | "password" | "name" | "tel" | "postal-code";
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
  inputStyle?: any;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  variant = "default",
  size = "medium",
  disabled = false,
  error,
  label,
  required = false,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete = "off",
  maxLength,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerClasses = () => {
    return cn(
      "rounded-lg border-2 flex-row items-center focus:none",

      // Size-based styling
      {
        "px-3 py-2": size === "small",
        "px-4 py-3": size === "medium",
        "px-4 py-4": size === "large",
      },

      // Variant-based styling
      {
        "w-[148px]": variant === "compact",
        "w-full": variant === "default" || variant === "password",
      },

      // State-based styling
      {
        "bg-gray-100 opacity-50": disabled,
        "border-red-500 bg-white": !disabled && error,
        "border-blue-500 bg-white": !disabled && !error && isFocused,
        "border-gray-300 bg-white": !disabled && !error && !isFocused,
      }
    );
  };

  const getTextClasses = () => {
    return cn("flex-1 text-base", {
      "text-gray-400": disabled,
      "text-gray-900": !disabled && error,
      "text-gray-600": !disabled && !error,
    });
  };

  const getPlaceholderTextColor = () => {
    if (disabled) return colors.gray[400];
    return colors.gray[500];
  };

  const shouldShowPasswordToggle = variant === "password" || secureTextEntry;
  const isSecureEntry = shouldShowPasswordToggle && !isPasswordVisible;

  return (
    <View style={style}>
      {label && (
        <View className="mb-2 flex-row items-center">
          <Text className="text-sm font-medium text-gray-700">{label}</Text>
          {required && <Text className="ml-1 text-red-500">*</Text>}
        </View>
      )}

      <View className={getContainerClasses()}>
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <TextInput
          className={getTextClasses()}
          placeholder={placeholder}
          placeholderTextColor={getPlaceholderTextColor()}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecureEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          style={[
            inputStyle,
            {
              outlineStyle: "none",
              outlineWidth: 0,
              outlineColor: "transparent",
              outlineOffset: 0,
              WebkitAppearance: "none",
              WebkitTapHighlightColor: "transparent",
            },
          ]}
        />

        {shouldShowPasswordToggle && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="ml-3 p-1"
            disabled={disabled}
          >
            {isPasswordVisible ? (
              <EyeSlashIcon size={20} color={colors.gray[500]} />
            ) : (
              <EyeIcon size={20} color={colors.gray[500]} />
            )}
          </TouchableOpacity>
        )}

        {rightIcon && !shouldShowPasswordToggle && (
          <View className="ml-3">{rightIcon}</View>
        )}
      </View>

      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};

export default Input;
