import colors from '@/constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import React from 'react';
import { TextProps, View } from 'react-native';
import { Text } from '../ui/text';

interface Props extends TextProps {
  children: string;
  error?: boolean;
  showInfoIcon?: boolean;
}

const defaultStyles = 'text-gray-700 leading-4 text-[12px]';
export default function FormHelperText({
  children,
  className,
  error = false,
  showInfoIcon = false,
  ...rest
}: Props) {
  return (
    children && (
      <View className="flex-row items-center gap-1">
        {showInfoIcon && (
          <MaterialCommunityIcons
            name="information-outline"
            size={18}
            color={colors.red}
          />
        )}
        <Text
          className={`${defaultStyles} ${className} ${
            error ? '!text-red' : '!text-subtle'
          }`}
          {...rest}
        >
          {children}
        </Text>
      </View>
    )
  );
}
