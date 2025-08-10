import { Stack } from 'expo-router';

export default function ConsultantsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="consultants-request/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="suggestions/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="your-consultants/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="edit-profile-info/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="send-requests/index"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
