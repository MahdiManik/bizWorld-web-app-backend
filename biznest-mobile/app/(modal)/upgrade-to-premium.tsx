import React from 'react';
import {
    View,
    Text,
    Modal,
    StatusBar,
    TouchableWithoutFeedback,
} from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/button';
import ListingSuccessIcon from '@/assets/svgs/listing/ListingSuccessIcon';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OnboardingSuccessModal = () => {
    const handleLatter = () => {
        router.back();
    };

    const handlePremium = () => {
        router.replace('/(module)/(a-root)/account-settings/subscriptions')
    }

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
                            <View className="flex items-center justify-center mb-4 w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#FBCF47] to-[#F79800] text-center">
                                <MaterialCommunityIcons name="crown-outline" size={50} color="white" />
                            </View>
                            {/* Title */}
                            <Text className="mb-4 text-center font-roboto600 text-xl text-title">
                                Premium Required
                            </Text>

                            {/* Description */}
                            <Text className="mb-8 text-center font-roboto400 text-base leading-6 text-description-text">
                                <Text className="mb-8 text-center font-roboto400 text-base leading-6 text-description-text">
                                   You need a premium account to message other investors.
                                </Text>
                            </Text>

                            {/* Buttons */}
                            <Button
                                title="Upgrade to Premium"
                                onPress={handlePremium}
                                variant="primary"
                                fullWidth
                                className='mb-4'
                            />

                            <Button
                                title="Maybe Later"
                                onPress={handleLatter}
                                variant="text"
                                fullWidth
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default OnboardingSuccessModal;
