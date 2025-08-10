import Feather from '@expo/vector-icons/Feather';
import { ReactNode, useCallback, useState } from 'react';
import { View } from 'react-native';
import { TextInput as PTextInput, TextInputProps } from 'react-native-paper';
import FormControl from '../form/FormControl';
import FormHelperText from '../form/FormHelperText';
import fonts from '@/constants/fonts';
import colors from '@/constants/colors';

interface ITextInput extends TextInputProps {
  containerClassName?: string;
  endIcon?: ReactNode;
  error?: boolean;
  helperText?: string;
}

const PaperTextInput = ({
  containerClassName,
  helperText,
  error = false,
  className,
  ...props
}: ITextInput) => {
  const [showPassword, setShowPassword] = useState<boolean>(
    props.secureTextEntry || false
  );

  const toggleShowPassword = useCallback(() => {
    setShowPassword((s) => !s);
  }, []);

  return (
    <FormControl className={containerClassName}>
      <PTextInput
        cursorColor={colors.primary}
        style={{
          includeFontPadding: false,
          fontSize: 14,
          fontFamily: fonts.Roboto400,
          borderRadius: 8,
        }}
        textAlignVertical={props?.multiline ? 'top' : 'auto'}
        {...props}
        className={className}
        outlineStyle={{ borderWidth: 2, borderRadius: 8 }}
        textColor={colors.black}
        outlineColor={colors.stroke.border}
        theme={{ colors: { background: 'white', text: 'red' } }}
        error={error}
        secureTextEntry={showPassword}
        right={
          props?.secureTextEntry ? (
            <PTextInput.Icon
              onPress={toggleShowPassword}
              icon={showPassword ? 'eye-off' : 'eye'}
              color="#757575"
            />
          ) : (
            props?.right
          )
        }
      />
      {helperText && (
        <View className="mt-1.5 flex-row items-start gap-1">
          <Feather
            name="info"
            size={10}
            color={colors.red}
            className="mt-[2px]"
          />
          <FormHelperText className="font-Poppins400 text-[10px]" error={error}>
            {helperText}
          </FormHelperText>
        </View>
      )}
    </FormControl>
  );
};

export default PaperTextInput;
