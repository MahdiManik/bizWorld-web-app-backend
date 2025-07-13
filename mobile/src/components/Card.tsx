import React, { ReactNode } from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: "default" | "outline" | "elevated";
}

const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  style,
  ...rest
}) => {
  let cardClasses = "rounded-lg p-4 ";

  switch (variant) {
    case "outline":
      cardClasses += "border border-gray-200 bg-white";
      break;
    case "elevated":
      cardClasses += "bg-white shadow-md";
      break;
    case "default":
    default:
      cardClasses += "bg-white border border-gray-100";
      break;
  }

  return (
    <View className={cardClasses} {...rest}>
      {children}
    </View>
  );
};

export default Card;
