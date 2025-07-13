import 'react-native';

// Extend React Native component props with className
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
  
  // Add more component props as needed
}
