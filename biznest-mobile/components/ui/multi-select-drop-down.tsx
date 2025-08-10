import React, { forwardRef } from 'react';
import { TextInputProps, TouchableOpacity } from 'react-native';
import { Divider, TextInput as PTextInput } from 'react-native-paper';
import {
  DropdownInputProps,
  MultiSelectDropdownItemProps,
  MultiSelectDropdownProps,
  MultiSelectDropdown as PDropdown,
} from 'react-native-paper-dropdown';
import cn from '@/lib/utils';
import PaperTextInput from './paper-input';
import colors from '@/constants/colors';
import { Text } from './text';
import CheckboxButton from './checkbox-button';

export interface IDropdown extends Partial<MultiSelectDropdownProps> {
  data?: MultiSelectDropdownProps['options'];
  onChange: MultiSelectDropdownProps['onSelect'];
  helperText?: string;
  asCurrency?: boolean;
  inputStyle?: TextInputProps['style'];
}

const Dropdown: React.ForwardRefRenderFunction<any, IDropdown> = (
  {
    options,
    data,
    helperText,
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
    isLast,
  }: MultiSelectDropdownItemProps) => {
    const safeValue = value ?? [];
    const isSelected = safeValue.includes(option?.value);
    return (
      <>
        <TouchableOpacity
          style={{ width }}
          className={cn('flex-row items-center gap-3 px-4 py-2.5')}
          onPress={() => {
            if (onSelect) {
              if (isSelected) {
                onSelect(safeValue.filter((v) => v !== option?.value));
              } else {
                onSelect([...safeValue, option?.value]);
              }
            }
          }}
        >
          <Text
            className={cn(
              'flex-1',
              isSelected ? 'text-primary' : 'text-subtle'
            )}
          >
            {option.label}
          </Text>
          <CheckboxButton
            onPress={() => {
              if (onSelect) {
                if (isSelected) {
                  onSelect(safeValue.filter((v) => v !== option?.value));
                } else {
                  onSelect([...safeValue, option?.value]);
                }
              }
            }}
            checked={!!isSelected}
            size={20}
            color={colors.primary}
            children={null}
          />
        </TouchableOpacity>
        {!isLast && <Divider />}
      </>
    );
  };
  const CustomDropdownInput = ({
    placeholder,
    selectedLabel,
    rightIcon,
    error,
    disabled,
    label,
  }: DropdownInputProps) => {
    return (
      <PaperTextInput
        mode="outlined"
        placeholder={placeholder}
        value={selectedLabel}
        right={rightIcon}
        disabled={disabled}
        style={[inputStyle, { fontSize: 14, paddingTop: 0, height: 40 }]}
        label={label}
        error={error}
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
      value={value ?? []}
      menuContentStyle={{
        backgroundColor: 'white',
        paddingVertical: 8,
        marginTop: 44,
        ...menuContentStyle,
      }}
      CustomMultiSelectDropdownItem={CustomDropdownItem}
      CustomMultiSelectDropdownInput={CustomDropdownInput}
      {...rest}
    />
  );
};

export default forwardRef(Dropdown);
