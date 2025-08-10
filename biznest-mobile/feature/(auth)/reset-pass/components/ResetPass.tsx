import { View, Text } from 'react-native';
import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import ResetPassForm from './ResetPassForm';


const Login = () => {
    return (
        <AuthLayout>
            <View>
                <Text className="mb-2 text-4xl font-bold text-primary">Reset Password</Text>
                <Text className="text-sm text-primary-50">
                    Please enter your new password twice to reset.
                </Text>
            </View>
            <ResetPassForm />
        </AuthLayout>
    );
};

export default Login;
