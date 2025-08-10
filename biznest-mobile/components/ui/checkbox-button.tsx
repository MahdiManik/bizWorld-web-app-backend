import colors from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, PressableProps } from 'react-native';

interface CheckboxProps extends PressableProps {
  checked: boolean;
  children: ReactNode;
  onPress: () => void;
  iconClassName?: string;
  color?: string;
  size?: number;
}

const CheckboxButton = ({
  color = 'black',
  children,
  iconClassName,
  checked,
  className,
  size = 24,
  ...rest
}: CheckboxProps) => {
  return (
    <Pressable className={`flex-row items-start gap-2 ${className}`} {...rest}>
      <MaterialIcons
        className={iconClassName}
        name={checked ? 'check-box' : 'check-box-outline-blank'}
        size={size}
        color={checked ? color : colors.stroke.border}
      />
      {children}
    </Pressable>
  );
};

export default CheckboxButton;
