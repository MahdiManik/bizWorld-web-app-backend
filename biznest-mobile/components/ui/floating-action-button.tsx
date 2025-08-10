import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import cn from '@/lib/utils';

export interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
  className?: string;
  iconSize?: number;
  iconColor?: string;
  bottom?: number;
  right?: number;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'add',
  size = 'medium',
  variant = 'primary',
  disabled = false,
  className,
  iconSize,
  iconColor = 'white',
  bottom = 20,
  right = 20,
}) => {
  const getButtonClasses = () => {
    let classes = 'rounded-full shadow-lg items-center justify-center';

    // Size variants
    switch (size) {
      case 'small':
        classes += ' w-12 h-12';
        break;
      case 'medium':
        classes += ' w-14 h-14';
        break;
      case 'large':
        classes += ' w-16 h-16';
        break;
    }

    // Color variants
    switch (variant) {
      case 'primary':
        classes += ' bg-primary';
        break;
      case 'secondary':
        classes += ' bg-gray-600';
        break;
      case 'success':
        classes += ' bg-green-600';
        break;
      case 'danger':
        classes += ' bg-red-600';
        break;
    }

    // Disabled state
    if (disabled) {
      classes += ' opacity-50';
    }

    return cn(classes, className);
  };

  const getIconSize = () => {
    if (iconSize) return iconSize;

    switch (size) {
      case 'small':
        return 20;
      case 'medium':
        return 24;
      case 'large':
        return 28;
      default:
        return 24;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        position: 'absolute',
        bottom: bottom,
        right: right,
        zIndex: 1000,
      }}
      className={getButtonClasses()}
      activeOpacity={0.8}
    >
      <MaterialIcons name={icon} size={getIconSize()} color={iconColor} />
    </TouchableOpacity>
  );
};

export default FloatingActionButton;
