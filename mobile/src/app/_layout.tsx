import { Stack } from 'expo-router/stack'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import '../../global.css'
import 'react-native-reanimated'
import { Provider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { View } from 'react-native'
import tw from '@/lib/tailwind'

// Temporary context providers until you create the actual ones
const ProductProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)
const CartProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  // Using simple font loading approach - letting RN Paper use system fonts

  const loaded = true // Skip font loading check since we're not loading custom fonts

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })

  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <ProductProvider>
              <CartProvider>
                <BottomSheetModalProvider>
                  <View style={tw`flex-1`}>
                    <Stack
                      screenOptions={{ headerShown: false }}
                      initialRouteName="(auth)">
                      <Stack.Screen name="(auth)" />
                      <Stack.Screen name="(tabs)" />
                    </Stack>
                  </View>
                  <Toast />
                </BottomSheetModalProvider>
              </CartProvider>
            </ProductProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Provider>
  )
}
