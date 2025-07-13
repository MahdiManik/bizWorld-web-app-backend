import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function saveSecret(key: string, value: string) {
  try {
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.setItemAsync(key, value)
    } else {
      await AsyncStorage.setItem(key, value)
    }
  } catch (e) {
    console.warn('SecureStore failed, falling back to AsyncStorage', e)
    await AsyncStorage.setItem(key, value)
  }
}
