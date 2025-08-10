import { View, Text } from 'react-native';
import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/button';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import colors from '@/constants/colors';
import OtpEnterForm from './OtpEnterForm';

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
                    Enter Authentication Code
                </Text>
                <Text className="text-title text-sm">
                    A four-digit PIN has been sent to your email (example@gmail.com). Enter the PIN below to reset your password.
                </Text>
            </View>
            <OtpEnterForm />
        </AuthLayout>
    );
};

export default VerifyOtp;
