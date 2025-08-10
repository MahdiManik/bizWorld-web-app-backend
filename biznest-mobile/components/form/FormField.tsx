import React from 'react';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import Input from '@/components/ui/input';

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChangeText' | 'onBlur' | 'error'> {
  control: Control<TFieldValues>;
  name: TName;
  placeholder?: string;
  label?: string;
  rules?: object;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export default function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  placeholder,
  label,
  rules = {},
  secureTextEntry = false,
  keyboardType = 'default',
  ...inputProps
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          placeholder={placeholder || label}
          value={value || ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          {...inputProps}
        />
      )}
    />
  );
}