import { View, Text } from 'react-native';
import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import ForgetPassForm from './ForgetPassForm';
import Button from '@/components/ui/button';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';


const ForgetPass = () => {
    const router = useRouter();
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
            <View>
                <Text className="mb-2 text-4xl font-bold text-title">Forgot Password?</Text>
                <Text className="text-sm text-description">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </Text>
            </View>
            <ForgetPassForm />
        </AuthLayout>
    );
};

export default ForgetPass;