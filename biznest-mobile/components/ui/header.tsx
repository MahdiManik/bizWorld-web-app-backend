import React, { ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import cn from '@/lib/utils';
import { Entypo } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  textClassName?: string;
  textColor?: string;
  centered?: boolean;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  showBackButton?: boolean;
  leftText?: string;
  rightText?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  textClassName = 'font-Urbanist600',
  textColor = 'white',
  centered = false,
  leftComponent,
  rightComponent,
  showBackButton = false,
  leftText,
  rightText,
  onLeftPress,
  onRightPress,
  onBackPress,
}) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  const hasRightContent = rightComponent || rightText;

  const hasLeftActionContent = showBackButton || leftComponent || leftText;

  return (
    <View
      className="w-full flex-row items-center px-4 py-4"
      style={{ backgroundColor: '#002C69' }}
    >
      {hasLeftActionContent && (
        <View className="mr-4">
          {showBackButton && (
            <TouchableOpacity onPress={handleBackPress}>
              <Entypo name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
          )}
          {leftComponent && <View>{leftComponent}</View>}
          {leftText && (
            <TouchableOpacity onPress={onLeftPress}>
              <Text className="font-Urbanist600 text-base text-white">
                {leftText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {centered ? (
        <View className="flex-1 items-center">
          {showBackButton ? (
            <TouchableOpacity onPress={handleBackPress}>
              <Text
                className={cn(`font-roboto600 text-lg`, textClassName)}
                style={{ color: textColor }}
              >
                {title}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              className={cn(`font-roboto600 text-lg`, textClassName)}
              style={{ color: textColor }}
            >
              {title}
            </Text>
          )}
        </View>
      ) : (
        <View className="flex-1">
          {showBackButton ? (
            <TouchableOpacity onPress={handleBackPress}>
              <Text
                className={cn(`font-roboto600 text-lg`, textClassName)}
                style={{ color: textColor }}
              >
                {title}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              className={cn(`font-roboto600 text-lg`, textClassName)}
              style={{ color: textColor }}
            >
              {title}
            </Text>
          )}
        </View>
      )}

      {hasRightContent && (
        <View className="items-end">
          {rightComponent && <View>{rightComponent}</View>}
          {rightText && (
            <TouchableOpacity onPress={onRightPress}>
              <Text className="font-Urbanist600 text-base text-white">
                {rightText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default Header;
