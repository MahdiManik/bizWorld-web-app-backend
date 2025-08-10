import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import cn from '@/lib/utils';

import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';

interface RadioButtonProps {
  label: string;
  value: boolean;
  onPress: () => void;
}
const RadioButton: React.FC<RadioButtonProps> = ({ value, onPress, label }) => {
  return (
    <TouchableOpacity className="flex-row items-center gap-2" onPress={onPress}>
      {value ? (
        <Ionicons name="radio-button-on" size={20} color={colors.primary} />
      ) : (
        <Ionicons
          name="radio-button-off"
          size={20}
          color={colors.placeholder}
        />
      )}
      <Text
        className={cn(
          'font-roboto600 text-sm',
          value ? 'text-primary' : 'text-placeholder'
        )}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default RadioButton;
