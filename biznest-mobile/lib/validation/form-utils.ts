import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const getErrorMessage = <T extends FieldValues>(
  form: UseFormReturn<T>,
  name: FieldPath<T>
): string | undefined => {
  return form.formState.errors[name]?.message as string | undefined;
};

export const createFormField = <T extends FieldValues>(
  form: UseFormReturn<T>,
  name: FieldPath<T>
) => ({
  value: form.watch(name),
  onChangeText: (value: string) => form.setValue(name, value as any),
  onBlur: () => form.trigger(name),
  error: getErrorMessage(form, name),
});

export const validateForm = async <T extends FieldValues>(
  form: UseFormReturn<T>
): Promise<boolean> => {
  const isValid = await form.trigger();
  return isValid;
};