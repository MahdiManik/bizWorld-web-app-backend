import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/button';
import { LoginFormData, loginSchema } from '../types/login';
import { useLogin } from '../../hooks/useAuth';

const LoginForm = () => {
  const { mutate: login } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = (data: LoginFormData) => {
    login(data);
  };

  return (
    <View>
      {/* Form Fields */}
      <View className="mb-5 gap-3">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        <View className="w-full flex-row justify-end">
          <Button
            title="Forgot Password?"
            onPress={() => router.push('/(auth)/forget-pass')}
            variant="text"
            textClassName="text-primary"
          />
        </View>
      </View>

      <View className="mt-20">
        {/* Login button */}
        <Button
          title="Login"
          onPress={handleSubmit(handleLogin)}
          variant="primary"
          size="large"
          fullWidth
          className="mb-4"
        />

        {/* Sign up link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600">Don&apos;t have an account? </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="font-semibold text-primary">Sign up here</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default LoginForm;
