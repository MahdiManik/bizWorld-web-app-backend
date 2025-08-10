import React, { useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    StatusBar,
    TouchableWithoutFeedback,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/button';
import ListingSuccessIcon from '@/assets/svgs/listing/ListingSuccessIcon';
import { FontAwesome6 } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import PaperTextInput from '@/components/ui/paper-input';
import { Controller, useForm } from 'react-hook-form';
import { useUpdateInterestStatus } from '@/feature/(modules)/investor/hooks/useInvestor';
import { useUserId } from '@/feature/(auth)/hooks/useAuth';

const ListingSuccessModal = () => {
    const { id } = useLocalSearchParams();
    const userId = useUserId();
    const investorId = Array.isArray(id) ? id[0] : id;

    const { control, handleSubmit } = useForm({
        defaultValues: {
            remark: '',
        },
    });

    const mutation = useUpdateInterestStatus(Number(userId));

    const handleDecline = (data: { remark: string }) => {
        mutation.mutate({
            id: investorId,
            status: 'Rejected',
            remark: data.remark,
        });
        router.back()
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={() => router.back()}
            statusBarTranslucent
        >
            <StatusBar backgroundColor="rgba(0,0,0,0.6)" barStyle="light-content" />

            {/* Dark overlay background */}
            <TouchableWithoutFeedback onPress={() => router.back()}>
                <View className="flex-1 items-center justify-center bg-modal_overlay bg-opacity-60 px-6">
                    {/* Modal content */}
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View className="w-full max-w-sm flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-xl">

                            {/* Title */}
                            <Text className="my-4 text-center font-roboto600 text-xl text-title">
                                Decline Investor Request
                            </Text>

                            <Text className='mb-6 mt-2 p-4 bg-secondary2 rounded-xl'>
                                <FontAwesome6 name="person-circle-xmark" size={36} color="red" />
                            </Text>

                            {/* Description */}
                            <Text className="mb-8 text-center font-roboto400 text-base leading-6 text-description-text">
                                Are you sure you want to reject this request? Please provide a reason for rejection.
                            </Text>

                            <View className="w-full max-w-sm my-4">
                                <Controller
                                    control={control}
                                    name="remark"
                                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                        <PaperTextInput
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            error={!!error}
                                            helperText={error?.message}
                                            multiline
                                            numberOfLines={3}
                                        />
                                    )}
                                />

                                {/* Buttons */}
                                <View className="flex-row gap-3 mt-6">
                                    <Button
                                        title="Cancel"
                                        onPress={handleCancel}
                                        variant="outline"
                                        fullWidth
                                        className="flex-1"
                                    />
                                    <Button
                                        title="Decline"
                                        onPress={handleSubmit(handleDecline)}
                                        variant="primary"
                                        fullWidth
                                        className="flex-1 bg-reed"
                                    />

                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ListingSuccessModal;
