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
import DeleteAccountIcon from '@/assets/svgs/account-setting/DeleteAccountIcon';
import { useDeleteAccount } from '@/feature/(auth)/hooks/useAuth';

const DeleteAccountModal = () => {
  const { mutate: handleDeleteAccount } = useDeleteAccount();
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
              <Text className="mb-8 text-center font-roboto600 text-xl text-title">
                Delete Account
              </Text>
              <DeleteAccountIcon />

              {/* Description */}
              <Text className="my-8 text-center font-roboto400 text-base leading-6 text-description-text">
                Are you sure you want to delete your account? This action is
                permanent and cannot be undone.
              </Text>

              {/* Buttons */}
              <View className="flex-row gap-3">
                <Button
                  title="Cancel"
                  onPress={() => router.back()}
                  variant="outline"
                  fullWidth
                  className="flex-1"
                />
                <Button
                  title="Allow"
                  onPress={() => handleDeleteAccount()}
                  variant="primary"
                  fullWidth
                  className="flex-1 bg-red text-white"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DeleteAccountModal;
