import { Stack } from 'expo-router';

export default function AccountSettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="change-password/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="company-info/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="company-info/edit-company-info/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="notification/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="personal-info/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="personal-info/edit-personal-info/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="subscriptions/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="subscriptions/plan/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="subscriptions/pro/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="consultant-application/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="services/index" options={{ headerShown: false }} />

      <Stack.Screen
        name="services/add-service/index"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="services/edit-service/index"
        options={{ headerShown: false }}
      />

      <Stack.Screen name="auto-reply/index" options={{ headerShown: false }} />

      <Stack.Screen
        name="payment-settings/index"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
