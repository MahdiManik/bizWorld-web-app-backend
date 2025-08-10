import React from 'react';
import { TextProps } from 'react-native';
import { Text } from '../ui/text';

interface IFormLabel extends TextProps {
  children: string;
  error?: boolean;
}
export default function FormLabel({
  children,
  className,
  error,
  ...rest
}: IFormLabel) {
  return (
    <Text
      className={`text-gray-700 ${className} ${error ? '!text-red-900' : ''}`}
      {...rest}
    >
      {children}
    </Text>
  );
}
