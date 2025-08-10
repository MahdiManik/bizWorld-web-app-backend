import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';

import RegisterForm from './RegisterForm';
import Button from '@/components/ui/button';
import { Feather } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { router } from 'expo-router';

const Register = () => {
  return (
    <AuthLayout>
      <Button
        variant="ghost"
        className="p-0! flex-row items-center justify-start"
        icon={<Feather name="chevron-left" size={20} color={colors.primary} />}
        title="Return to Sign in"
        onPress={() => {
          router.back();
        }}
        size="none"
      />
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
