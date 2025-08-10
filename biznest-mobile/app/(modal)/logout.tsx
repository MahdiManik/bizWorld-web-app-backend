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
import LogoutIcon from '@/assets/svgs/account-setting/LogoutIcon';
import { useLogout } from '@/feature/(auth)/hooks/useAuth';

const LogoutModal = () => {
  const logoutMutation = useLogout();
  const handleLogout = () => {
    logoutMutation.mutate();
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
              <Text className="mb-8 text-center font-roboto600 text-xl text-title">
                Log Out
              </Text>
              <LogoutIcon />

              {/* Description */}
              <Text className="my-8 text-center font-roboto400 text-base leading-6 text-description-text">
                Are you sure you want to log out?
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
                  title="Logout"
                  onPress={handleLogout}
                  variant="primary"
                  fullWidth
                  className="flex-1"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LogoutModal;
