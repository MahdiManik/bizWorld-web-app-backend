import { View, Text } from 'react-native';
import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import LoginForm from './LoginForm';

const Login = () => {
  return (
    <AuthLayout>
      <View>
        <Text className="mb-2 text-4xl font-bold text-primary">Welcome</Text>
        <Text className="text-sm text-primary-50">
          Elevate your career with our all-in-one business guide and networking
          app.
        </Text>
      </View>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
