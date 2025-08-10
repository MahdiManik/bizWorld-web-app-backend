import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Controller, useForm } from 'react-hook-form';
import Input from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/button';
import { ChangePasswordFormData, changePasswordSchema } from './types';
import { useChangePassword } from '@/feature/(auth)/hooks/useAuth';
import Toast from 'react-native-toast-message';

const ChangePassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      passwordConfirmation: '',
    },
  });

  const { mutateAsync } = useChangePassword();

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await mutateAsync({
        currentPassword: data.currentPassword,
        password: data.newPassword,
        passwordConfirmation: data.passwordConfirmation,
      });
      reset();
    } catch (error) {
      console.log(error);
      // Error is already handled by the onError in useChangePassword hook
    }
  };
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header title="ChangePassword" showBackButton />

        <View className="flex-1 my-5 p-4 flex-col justify-between">
          <View className="flex-col justify-center">

            <View className="gap-2 mb-4">
              <Text className="font-roboto400 text-sm text-title">
                Current Password
              </Text>
              <Controller
                control={control}
                name="currentPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="******"
                    className="bg-white"
                    variant="password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors?.currentPassword?.message}
                  />
                )}
              />
            </View>

            <View className="mb-4 gap-2">
              <Text className="font-roboto400 text-sm text-title">
                New Password
              </Text>
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="******"
                    className="bg-white"
                    variant="password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors?.newPassword?.message}
                  />
                )}
              />
            </View>
            {/* <Text className='font-roboto300 text-xs text-red-500 mb-4 mt-1'>Password must be at least 8 characters long</Text> */}

            <View className="gap-2">
              <Text className="font-roboto400 text-sm text-title">
                Confirm Password
              </Text>
              <Controller
                control={control}
                name="passwordConfirmation"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="******"
                    className="bg-white"
                    variant="password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors?.passwordConfirmation?.message}
                  />
                )}
              />
            </View>

          </View>
          <Button
            title="Change Password"
            variant="primary"
            fullWidth
            onPress={handleSubmit(onSubmit, (errors) => {
              if (errors.currentPassword) {
                Toast.show({
                  type: 'error',
                  text1: errors.currentPassword.message,
                });
              }
              if (errors.newPassword) {
                Toast.show({
                  type: 'error',
                  text1: errors.newPassword.message,
                });
              }
              if (errors.passwordConfirmation) {
                Toast.show({
                  type: 'error',
                  text1: errors.passwordConfirmation.message,
                });
              }
            })}
            className="mt-4"
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default ChangePassword;
