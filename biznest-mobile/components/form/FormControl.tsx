import React from "react";
import { View, ViewProps } from "react-native";

export interface IFormControl extends ViewProps {}
export default function FormControl({
  children,
  className,
  ...rest
}: IFormControl) {
  return (
    <View className={`${className}`} {...rest}>
      {children}
    </View>
  );
}
