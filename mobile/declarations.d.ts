// Custom declarations for TypeScript to understand React Native imports
declare module 'react-native' {
  export * from 'react-native/types';
  export const TextInput: any;
  export const TouchableOpacity: any;
  export const Image: any;
  export const View: any;
  export const Text: any;
  export const ScrollView: any;
  export const SafeAreaView: any;
  export const FlatList: any;
  export const Pressable: any;
  export const Button: any;
  export const StyleSheet: any;
}

// Add other module declarations as needed
declare module '*.jpg';
declare module '*.png';
