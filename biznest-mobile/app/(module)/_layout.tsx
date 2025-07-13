import { Stack } from "expo-router";
import { Redirect } from "expo-router";

export default function ModuleLayout() {
  // const isLoggedIn = false;

  // if (!isLoggedIn) {
  //   return <Redirect href="/(auth)/login" />;
  // }

  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="more-menu"
        options={{
          presentation: "transparentModal",
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "rgba(33, 33, 33, 0.75)" },
        }}
      />
    </Stack>
  );
}
