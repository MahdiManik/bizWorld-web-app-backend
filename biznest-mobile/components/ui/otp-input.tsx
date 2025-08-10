import colors from '@/constants/colors';
import { ReactNode } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import { TextInputProps } from 'react-native-paper';

interface ITextInput extends TextInputProps {
  containerClassName?: string;
  variant?: 'default' | 'outlined';
  endIcon?: ReactNode;
  error?: boolean;
  helperText?: string;
  onFilled?: (text: string) => void;
}

const OTPInput = ({
  variant = 'default',
  containerClassName,
  helperText,
  error = false,
  className,
  secureTextEntry = false,
  ...props
}: ITextInput) => {
  return (
    <OtpInput
      numberOfDigits={4}
      focusColor="green"
      autoFocus={false}
      hideStick={true}
      placeholder=""
      blurOnFilled={true}
      disabled={false}
      type="numeric"
      secureTextEntry={false}
      focusStickBlinkingDuration={500}
      onFocus={() => {}}
      onBlur={() => {}}
      onTextChange={props.onChangeText}
      onFilled={(text) => props.onFilled?.(text)}
      textInputProps={{
        accessibilityLabel: 'One-Time Password',
      }}
      theme={{
        pinCodeContainerStyle: {
          borderWidth: 2,
          borderColor: colors.border[10],
          width: 60,
          height: 60,
          backgroundColor: colors.gray.lightest,
        },
        focusedPinCodeContainerStyle: {
          borderWidth: 2,
          borderColor: colors.primary,
          width: 60,
          height: 60,
        },
        filledPinCodeContainerStyle: {
          borderWidth: 2,
          borderColor: colors.primary,
          width: 60,
          height: 60,
        },
        pinCodeTextStyle: {
          fontSize: 18,
        },
      }}
    />
  );
};
export default OTPInput;
