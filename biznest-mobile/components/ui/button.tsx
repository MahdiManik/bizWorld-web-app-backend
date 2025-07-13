import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "text";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  textClassName = "",
}) => {
  const getButtonClasses = () => {
    let classes = "rounded-lg items-center";

    // Full width handling - if fullWidth, we want justify-center, otherwise we want natural sizing
    if (fullWidth) {
      classes += " w-full justify-center";
    } else {
      classes += " self-start";
    }

    // Direction based on icon position
    if (iconPosition === "right") {
      classes += " flex-row-reverse";
    } else {
      classes += " flex-row";
    }

    // Size classes - text variant has minimal padding
    if (variant === "text") {
      switch (size) {
        case "small":
          classes += " px-0 py-0";
          break;
        case "medium":
          classes += " px-0 py-1";
          break;
        case "large":
          classes += " px-0 py-1";
          break;
      }
    } else {
      switch (size) {
        case "small":
          classes += " px-3 py-1.5";
          break;
        case "medium":
          classes += " px-4 py-2";
          break;
        case "large":
          classes += " px-6 py-3";
          break;
      }
    }

    // Disabled state
    if (disabled) {
      classes += " opacity-30";
    }

    // Variant classes
    switch (variant) {
      case "primary":
        classes += " bg-primary";
        break;
      case "secondary":
        classes += " bg-secondary";
        break;
      case "outline":
        classes += " bg-transparent border border-primary";
        break;
      case "ghost":
        classes += " bg-transparent";
        break;
      case "danger":
        classes += " bg-transparent border border-red-600";
        break;
      case "success":
        classes += " bg-green-500";
        break;
      case "text":
        classes += " bg-transparent";
        break;
    }

    return classes;
  };

  const getTextClasses = () => {
    let classes = "font-medium";

    // Size classes
    switch (size) {
      case "small":
        classes += " text-sm";
        break;
      case "medium":
        classes += " text-base";
        break;
      case "large":
        classes += " text-lg";
        break;
    }

    // Variant text colors
    switch (variant) {
      case "primary":
        classes += " text-white";
        break;
      case "secondary":
        classes += " text-white";
        break;
      case "outline":
        classes += " text-primary";
        break;
      case "ghost":
        classes += " text-link";
        break;
      case "danger":
        classes += " text-red-600";
        break;
      case "success":
        classes += " text-white";
        break;
      case "text":
        classes += " text-gray-700";
        break;
    }

    return classes;
  };

  const getIconSpacing = () => {
    if (!title) return "";

    switch (size) {
      case "small":
        return iconPosition === "right" ? "ml-1" : "mr-1";
      case "medium":
        return iconPosition === "right" ? "ml-2" : "mr-2";
      case "large":
        return iconPosition === "right" ? "ml-2" : "mr-2";
      default:
        return iconPosition === "right" ? "ml-2" : "mr-2";
    }
  };

  return (
    <TouchableOpacity
      className={`${getButtonClasses()} ${className}`}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && iconPosition === "left" && (
        <View className={getIconSpacing()}>{icon}</View>
      )}

      {title && (
        <Text className={`${getTextClasses()} ${textClassName}`}>{title}</Text>
      )}

      {icon && iconPosition === "right" && (
        <View className={getIconSpacing()}>{icon}</View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
