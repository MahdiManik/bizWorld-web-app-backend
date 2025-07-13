import React, { forwardRef } from "react";
import { Platform, TextInputProps, TouchableOpacity, View } from "react-native";
import { Divider, TextInput as PTextInput } from "react-native-paper";
import {
  DropdownInputProps,
  DropdownItemProps,
  DropdownProps,
  Dropdown as PDropdown,
} from "react-native-paper-dropdown";

import { Text } from "./text";
import cn from "@/lib/utils";

import TextInput from "./input";
import colors from "@/constants/Colors";

export interface IDropdown extends Partial<DropdownProps> {
  data?: DropdownProps["options"];
  onChange: DropdownProps["onSelect"];
  helperText?: string;
  asCurrency?: boolean;
  inputStyle?: TextInputProps["style"];
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
          className={cn("px-4 py-2.5 flex-row gap-3 items-center")}
          onPress={() => {
            if (onSelect && option?.value) {
              onSelect(option.value);
            }
            if (toggleMenu) {
              toggleMenu();
            }
          }}
        >
          <Text
            className={cn(
              "text-base",
              {
                "text-primary": value === option?.value,
                "text-subtle": value !== option?.value,
              }
            )}
          >
            {option.label}
          </Text>
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
      <View>
        {label && (
          <Text className="text-base font-Urbanist600 text-primary mb-1">
            {label}
          </Text>
        )}
        <TextInput
          variant="default"
          placeholder={placeholder}
          value={selectedLabel}
          rightIcon={rightIcon}
          disabled={disabled}
          multiline={multiline}
          inputStyle={[inputStyle, { fontSize: 14, paddingTop: 0, height: 48 }]}
          error={error ? "Invalid selection" : undefined}
        />
      </View>
    );
  };

  return (
    <PDropdown
      ref={ref}
      options={data || options || []}
      hideMenuHeader
      menuUpIcon={
        <PTextInput.Icon size={18} color={colors.gray[500]} icon="chevron-up" />
      }
      menuDownIcon={
        <PTextInput.Icon
          size={18}
          color={colors.gray[500]}
          icon="chevron-down"
        />
      }
      onSelect={onChange}
      value={value}
      menuContentStyle={{
        backgroundColor: "white",
        marginTop: Platform.OS === "ios" ? 68 : 45,
        ...menuContentStyle,
      }}
      CustomDropdownItem={CustomDropdownItem}
      CustomDropdownInput={CustomDropdownInput}
      {...rest}
    />
  );
};

export default forwardRef(Dropdown);
