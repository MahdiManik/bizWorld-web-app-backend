import { View, Text } from 'react-native';
import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/button';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import colors from '@/constants/colors';
import VerifyOtpForm from './VerifyOtpForm';

const VerifyOtp = () => {
  return (
    <AuthLayout>
      <Button
        variant="ghost"
        className="p-0! flex-row items-center justify-start"
        icon={<Feather name="chevron-left" size={20} color={colors.primary} />}
        title="Back"
        onPress={() => {
          router.back();
        }}
        size="none"
      />
      <View>
        <Text className="text-title mb-2 font-roboto600 text-sm font-semibold">
          Account Authentication
        </Text>
        <Text className="text-title text-sm">
          A four-digit PIN has been sent to your email (example@gmail.com).
          Input the code to validate your account creation.
        </Text>
      </View>
      <VerifyOtpForm />
    </AuthLayout>
  );
};

export default VerifyOtp;
