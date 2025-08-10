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

import { useUpdateConsultantStatus } from '@/feature/(modules)/consultants/hooks/useConsultant';

const ApplyConsultantModal = () => {
  const { mutateAsync } = useUpdateConsultantStatus();
  const handleAllow = async () => {
    await mutateAsync();
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
              {/* Title */}
              <Text className="my-4 text-center font-roboto600 text-xl text-title">
                Confirm Application
              </Text>

              {/* Description */}
              <Text className="mb-8 text-center font-roboto400 text-base leading-6 text-description-text">
                Are you sure you want to apply as a verified consultant? This
                will submit your application for review.
              </Text>

              {/* Buttons */}
              <View className="w-full flex-row justify-between">
                <Button
                  title="Cancel"
                  onPress={() => router.back()}
                  variant="outline"
                />
                <Button
                  title="Yes, Apply"
                  onPress={handleAllow}
                  variant="primary"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ApplyConsultantModal;
