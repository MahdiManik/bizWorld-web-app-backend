import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../global.css';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 60 seconds
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <Stack initialRouteName="(auth)">
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(module)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(modal)/investor-access"
                options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                  animation: 'fade',
                }}
              />
              <Stack.Screen
                name="(modal)/listing-success"
                options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                  animation: 'fade',
                }}
              />
              <Stack.Screen
                name="(modal)/onboarding-success"
                options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                  animation: 'fade',
                }}
              />
              <Stack.Screen
                name="(modal)/delete-account"
                options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                  animation: 'fade',
                }}
              />
              <Stack.Screen
                name="(modal)/logout"
                options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                  animation: 'fade',
                }}
              />
              <Stack.Screen
                name="(modal)/consultant-application-success"
                options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                  animation: 'fade',
                }}
              />
              <Stack.Screen
                name="(modal)/apply-consultant"
                options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                  animation: 'fade',
                }}
              />
              <Stack.Screen
                name="(modal)/upgrade-to-premium"
                options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                  animation: 'fade',
                }}
              />
              <Stack.Screen
                name="(modal)/invester-reject"
                options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                  animation: 'fade',
                }}
              />
              <Stack.Screen
                name="(modal)/reset-pass-success"
                options={{
                  presentation: 'transparentModal',
                  headerShown: false,
                  animation: 'fade',
                }}
              />
            </Stack>
            <Toast />
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
