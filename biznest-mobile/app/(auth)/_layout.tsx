import React from 'react';
import { Stack } from 'expo-router/stack';
import { useIsLoggedIn } from '@/feature/(auth)/hooks/useAuth';
import { Redirect } from 'expo-router';

const AuthLayout = () => {
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn) {
    return <Redirect href="/(module)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login/index" />
      <Stack.Screen name="register/index" />
      <Stack.Screen name="verify-otp/index" />
      <Stack.Screen name="user-onboarding/index" />
      <Stack.Screen name="forget-pass/index" />
      <Stack.Screen name="otp-enter/index" />
      <Stack.Screen name="reset-pass/index" />
    </Stack>
  );
};

export default AuthLayout;
