// components/ScreenLayout.tsx
import React, { ReactNode } from "react";
import { View, StyleSheet, ViewProps } from "react-native";

type ScreenLayoutProps = ViewProps & {
  children: ReactNode;
};

export default function ScreenLayout({
  children,
  style,
  ...props
}: ScreenLayoutProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
});
