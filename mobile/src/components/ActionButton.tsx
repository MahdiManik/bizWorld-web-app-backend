import { colors } from '@/constants/colors'
import tw from '@/lib/tailwind'
import React from 'react'
import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native'

type ActionButtonProps = {
  label: string
  variant?: 'accept' | 'reject' | 'rejection'
  onPress: (event: GestureResponderEvent) => void
  style?: ViewStyle
}

const baseStyle = 'py-2 rounded-md self-start'

const textStyles = {
  accept: [tw`px-4 text-center text-sm font-semibold text-white`],
  reject: [
    tw`px-4 text-center text-sm font-semibold`,
    { color: colors.primary.DEFAULT },
  ],
  rejection: [tw`px-4 text-center text-sm font-semibold text-white`],
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  variant = 'accept',
  onPress,
  style,
}) => {
  // Combine Tailwind layout + dynamic color style
  const buttonStyle: (ViewStyle | object)[] = [
    tw`${baseStyle}`,
    variant === 'reject'
      ? {
          borderWidth: 1,
          borderColor: colors.red2,
          backgroundColor: '#ffffff',
        }
      : variant === 'accept'
        ? { backgroundColor: colors.primary.DEFAULT }
        : { backgroundColor: colors.red2 },
  ]

  return (
    <TouchableOpacity style={[buttonStyle, style]} onPress={onPress}>
      <Text style={[...textStyles[variant]]}>{label}</Text>
    </TouchableOpacity>
  )
}

export default ActionButton
