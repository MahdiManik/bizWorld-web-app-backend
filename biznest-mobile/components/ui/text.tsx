import cn from "@/lib/utils";
import { Text as RNText, TextProps } from "react-native";

export const Text = ({ children, className, style, ...rest }: TextProps) => {
  return (
    <RNText
      style={[{ includeFontPadding: false }, style]}
      className={cn(`text-default text-lg font-roboto400`, className)}
      {...rest}
      allowFontScaling
    >
      {children}
    </RNText>
  );
};
