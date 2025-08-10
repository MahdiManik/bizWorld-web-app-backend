import { View } from 'react-native';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/button';
import { ForgetPassFormData, forgetPassSchema } from '../types/forget-pss';
import { useForgotPassword } from '@/feature/(auth)/hooks/useAuth';

const ForgetPassForm = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgetPassFormData>({
        resolver: zodResolver(forgetPassSchema),
        defaultValues: {
            email: '',
        },
    });

    const { mutate: forgotPassword, isPending } = useForgotPassword();

    const handleForgetPass = (data: ForgetPassFormData) => {
        forgotPassword(data.email);
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

            </View>

            <View className="mt-20">
                {/* Login button */}
                <Button
                    title={isPending ? 'Sending...' : 'Submit'}
                    onPress={handleSubmit(handleForgetPass)}
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

export default ForgetPassForm;
