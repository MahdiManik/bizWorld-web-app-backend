import React, { forwardRef } from 'react';
import { TextInputProps, TouchableOpacity, View } from 'react-native';
import { Divider, TextInput as PTextInput } from 'react-native-paper';
import {
  DropdownInputProps,
  DropdownItemProps,
  DropdownProps,
  Dropdown as PDropdown,
} from 'react-native-paper-dropdown';
import { Text } from './text';
import cn from '@/lib/utils';
import PaperTextInput from './paper-input';
import colors from '@/constants/colors';
import { Feather } from '@expo/vector-icons';

export interface IDropdown extends Partial<DropdownProps> {
  data?: DropdownProps['options'];
  onChange: DropdownProps['onSelect'];
  helperText?: string;
  asCurrency?: boolean;
  inputStyle?: TextInputProps['style'];
  multiline?: boolean;
}

const Dropdown: React.ForwardRefRenderFunction<any, IDropdown> = (
  {
    options,
    data,
    helperText,
    multiline,
    value,
    onChange,
    asCurrency,
    onSelect,
    menuContentStyle,
    inputStyle,
    ...rest
  },
  ref
) => {
  const CustomDropdownItem = ({
    width,
    option,
    value,
    onSelect,
    toggleMenu,
    isLast,
  }: DropdownItemProps) => {
    return (
      <>
        <TouchableOpacity
          style={{ width }}
          className={cn(
            'flex-row items-center gap-3 p-3',
            value === option?.value ? 'bg-[#E6F0F8]' : 'bg-white'
          )}
          onPress={() => {
            if (onSelect) {
              onSelect(option?.value);
            }
            toggleMenu();
          }}
        >
          {value === option?.value ? (
            <Feather name="check" size={16} color={colors.primary} />
          ) : (
            <View className="w-4" />
          )}

          <Text
            className={cn(
              'font-roboto400 text-sm',
              value === option?.value ? 'text-primary' : 'text-subtle'
            )}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      </>
    );
  };
  const CustomDropdownInput = ({
    placeholder,
    selectedLabel,
    rightIcon,
  }: DropdownInputProps) => {
    return (
      <PaperTextInput
        mode="outlined"
        placeholder={placeholder}
        value={selectedLabel}
        right={rightIcon}
        multiline={multiline}
        style={[
          inputStyle,
          {
            fontSize: 14,
            paddingTop: 0,
            backgroundColor: 'white',
            height: 46,
          },
        ]}
        helperText={helperText}
      />
    );
  };

  return (
    <PDropdown
      ref={ref}
      options={data || options || []}
      hideMenuHeader
      menuUpIcon={
        <PTextInput.Icon size={18} color={colors.subtle} icon="chevron-up" />
      }
      menuDownIcon={
        <PTextInput.Icon size={18} color={colors.subtle} icon="chevron-down" />
      }
      onSelect={onChange}
      value={value}
      menuContentStyle={{
        backgroundColor: 'white',
        paddingVertical: 8,
        maxHeight: 200,
        marginTop: 44,
        ...menuContentStyle,
      }}
      CustomDropdownItem={CustomDropdownItem}
      CustomDropdownInput={CustomDropdownInput}
      {...rest}
    />
  );
};

export default forwardRef(Dropdown);
