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

const ConsultantApplicationSuccessModal = () => {
  const handleAllow = () => {
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
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-full max-w-sm flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-xl">
              <ListingSuccessIcon />
              {/* Title */}
              <Text className="my-4 text-center font-roboto600 text-xl text-title">
                Application Submitted!
              </Text>

              {/* Description */}
              <Text className="mb-8 text-center font-roboto400 text-base leading-6 text-description-text">
                You&apos;ve successfully submitted your application. Our team
                will review and will verify your account in 1-3 working days.
              </Text>

              {/* Buttons */}
              <Button
                title="Back to Account Setting"
                onPress={handleAllow}
                variant="primary"
                fullWidth
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConsultantApplicationSuccessModal;
