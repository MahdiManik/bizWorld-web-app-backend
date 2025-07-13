import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router/stack'

const TabLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="(root-layout)/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="dashboard/index" options={{ headerShown: false }} />
    </Stack>
  )
}

export default TabLayout
