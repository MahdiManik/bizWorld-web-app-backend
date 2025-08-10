import { View } from 'react-native';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/button';
import { ResetPassFormData, resetPassSchema } from '../types/reset-pass';
import { useResetPassword } from '../../hooks/useAuth';

const ResetPassForm = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPassFormData>({
        resolver: zodResolver(resetPassSchema),
        defaultValues: {
            password: '',
            passwordConfirmation: '',
        },
    });

    const { mutate: resetPassword, isPending } = useResetPassword();

    const handleResetPass = (data: ResetPassFormData) => {
        resetPassword(data, {
            onError: (error) => {
                console.log(error)
            }
        });
    };

    return (
        <View>
            {/* Form Fields */}
            <View className="mb-5 gap-3">
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

                <Controller
                    control={control}
                    name="passwordConfirmation"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder="Confirm new password"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry
                            error={errors.passwordConfirmation?.message}
                        />
                    )}
                />


            </View>

            <View className="mt-20">
                {/* Login button */}
                <Button
                    title={isPending ? 'Resetting...' : 'Reset Password'}
                    onPress={handleSubmit(handleResetPass)}
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

export default ResetPassForm;
