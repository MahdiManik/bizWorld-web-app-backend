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
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSession from '@/store/session';
import { TOKEN_KEY, USER_DATA_KEY } from '@/services/authServices';

const OnboardingSuccessModal = () => {
  const handleLogin = async  () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
    await AsyncStorage.removeItem('session');
    useSession.setState({ user: null, isLoggedIn: false });
    router.replace('/(auth)/login');
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
                Onboarding Complete!
              </Text>

              {/* Description */}
              <Text className="mb-8 text-center font-roboto400 text-base leading-6 text-description-text">
                Thank you for completing your registration. Your account is
                pending admin approval.We&apos;ll notify you once it&apos;s
                activated.
              </Text>

              {/* Buttons */}
              <Button
                title="Back to Sign In"
                onPress={handleLogin}
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

export default OnboardingSuccessModal;
