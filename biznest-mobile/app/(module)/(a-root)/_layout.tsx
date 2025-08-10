import { Stack } from 'expo-router';

export default function ARootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="consultants"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="favourites/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="listing-detail/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="account-settings" options={{ headerShown: false }} />
      <Stack.Screen name="add-listing/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-listing/index"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
