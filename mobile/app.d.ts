/// <reference types="nativewind/types" />
/// <reference types="react" />
/// <reference types="react-native" />

// Include global typings
import 'react-native-gesture-handler';
import 'react-native-safe-area-context';
import '@react-navigation/native';
import '@react-navigation/native-stack';
import '@react-navigation/bottom-tabs';
import 'expo-status-bar';
import 'expo-font';
import 'expo-splash-screen';
import 'expo-secure-store';

// This file enables TypeScript to recognize the className prop from NativeWind
declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface TouchableHighlightProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  // Custom props for lists without conflicting with existing definitions
  interface FlatListClassName {
    className?: string;
  }
  interface SectionListClassName {
    className?: string;
  }
}

// Add typings for common modules used in the project
declare module '@expo/vector-icons' {
  export const Feather: any;
  export const FontAwesome: any;
  export const Ionicons: any;
  export const MaterialIcons: any;
  export const MaterialCommunityIcons: any;
}

// Extend global to allow require for loading assets
declare global {
  interface NodeRequire {
    (id: string): any;
  }
}
