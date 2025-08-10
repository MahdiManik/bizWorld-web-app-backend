import { useIsLoggedIn } from '@/feature/(auth)/hooks/useAuth';
import { Redirect, Stack } from 'expo-router';

export default function ModuleLayout() {
  const isLoggedIn = useIsLoggedIn();

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="more-menu"
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: 'rgba(33, 33, 33, 0.75)' },
        }}
      />
      <Stack.Screen name="(a-root)" options={{ headerShown: false }} />
    </Stack>
  );
}
