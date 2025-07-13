import React from "react";
import { Stack } from "expo-router/stack";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login/index" />
      <Stack.Screen name="register/index" />
      <Stack.Screen name="register-verify-otp/index" />
      <Stack.Screen name="forget-pass/index" />
      <Stack.Screen name="otp-verify/index" />
      <Stack.Screen name="reset-pass/index" />
      <Stack.Screen name="onboarding/index" />
      <Stack.Screen name="onboarding-two/index" />
    </Stack>
  );
};

export default AuthLayout;
