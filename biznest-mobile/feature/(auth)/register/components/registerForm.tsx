import { View } from 'react-native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/button';
import FormField from '@/components/form/FormField';
import { useRegister } from '../../hooks/useAuth';
import { RegisterFormData, registerSchema } from '../types/register';

const RegisterForm = () => {
  const { mutate: register, isPending } = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleRegister = (data: RegisterFormData) => {
    register({ fullName: data.name, email: data.email, password: data.password });
  };

  return (
    <View>
      <View className="mb-5 gap-3">
        <FormField
          control={control}
          name="name"
          placeholder="Full Name"
        />

        <FormField
          control={control}
          name="email"
          placeholder="Email"
          keyboardType="email-address"
        />

        <FormField
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry
        />
      </View>

      <View className="mt-20">
        <Button
          title="Sign Up"
          onPress={handleSubmit(handleRegister)}
          variant="primary"
          size="large"
          fullWidth
          className="mb-4"
          disabled={isPending}
        />
      </View>
    </View>
  );
};

export default RegisterForm;
