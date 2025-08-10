import colors from '@/constants/colors';
import cn from '@/lib/utils';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Eye Icon Components using Expo Vector Icons
const EyeIcon = ({ size = 20, color = '#6B7280' }) => (
  <MaterialIcons name="visibility" size={size} color={color} />
);

const EyeSlashIcon = ({ size = 20, color = '#6B7280' }) => (
  <MaterialIcons name="visibility-off" size={size} color={color} />
);

export interface InputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  variant?: 'default' | 'compact' | 'password';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'email' | 'password' | 'name' | 'tel' | 'postal-code';
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
  inputStyle?: any;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  className,
  value,
  onChangeText,
  onBlur,
  onFocus,
  variant = 'default',
  size = 'medium',
  disabled = false,
  error,
  label,
  required = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete = 'off',
  maxLength,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerClasses = () => {
    return cn(
      'rounded-xl border-2 border-border-10 flex-row items-center ',
      className,
      Platform.OS === 'ios' ? 'px-4 py-3' : 'px-3',

      // Variant-based styling
      {
        'w-[148px]': variant === 'compact',
        'w-full': variant === 'default' || variant === 'password',
      },

      // State-based styling
      {
        'bg-gray-100 opacity-50': disabled,
        'border-red': !disabled && error,
        'border-primary': !disabled && !error && isFocused,
        'border-gray-300 ': !disabled && !error && !isFocused,
      }
    );
  };

  const getTextClasses = () => {
    return cn('flex-1 text-base', {
      'text-gray-400': disabled,
      'text-gray-900': !disabled && error,
      'text-gray-600': !disabled && !error,
    });
  };

  const getPlaceholderTextColor = () => {
    if (disabled) return colors.placeholder;
    return colors.placeholder;
  };

  const shouldShowPasswordToggle = variant === 'password' || secureTextEntry;
  const isSecureEntry = shouldShowPasswordToggle && !isPasswordVisible;

  return (
    <View style={style}>
      {label && (
        <View className="mb-2 flex-row items-center">
          <Text className="text-sm font-medium text-gray-700">{label}</Text>
          {required && <Text className="text-red-500 ml-1">*</Text>}
        </View>
      )}

      <View className={getContainerClasses()}>
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <TextInput
          className={getTextClasses()}
          placeholder={placeholder}
          placeholderTextColor={getPlaceholderTextColor()}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecureEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          style={inputStyle}
        />

        {shouldShowPasswordToggle && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="ml-3 px-1"
            disabled={disabled}
          >
            {isPasswordVisible ? (
              <EyeIcon size={20} color={colors.title} />
            ) : (
              <EyeSlashIcon size={20} color={colors.title} />
            )}
          </TouchableOpacity>
        )}

        {rightIcon && !shouldShowPasswordToggle && (
          <View className="ml-3">{rightIcon}</View>
        )}
      </View>

      {error && <Text className="mt-1 text-sm text-red">{error}</Text>}
    </View>
  );
};

export default Input;
