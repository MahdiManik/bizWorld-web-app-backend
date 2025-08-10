import React from 'react';
import {
  View,
  Text,
  Modal,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/button';
import {
  useCreateInvestorListing,
  useUpdateInvestorStatus,
} from '@/feature/(modules)/listing/hooks/useListing';
import useSession from '@/store/session';

const InvestorAccessModal = () => {
  const { user } = useSession();
  const documentId = user?.documentId || user?.id || '';
  const { businessOwner, listing } = useLocalSearchParams();
  const { mutateAsync } = useCreateInvestorListing();
  const { mutateAsync: updateStatus } = useUpdateInvestorStatus();
  const handleAllow = async () => {
    try {
      await mutateAsync({
        businessOwner: businessOwner?.toString() || '',
        interestedUsers: documentId?.toString(),
        investStatus: 'Pending',
        listing: listing?.toString() || '',
      });
      await updateStatus({
        id: user?.id?.toString() || '',
      });
      router.replace('/listings');
    } catch (error) {
      console.error('Error creating investor listing:', error);
    }
  };

  const handleNotNow = () => {
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
            <View className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              {/* Title */}
              <Text className="mb-4 text-center font-roboto600 text-xl text-gray-900">
                Allow Investor Access?
              </Text>

              {/* Description */}
              <Text className="mb-8 text-center font-roboto400 text-base leading-6 text-gray-700">
                To explore and invest in other business listings, we need your
                permission to enable investor features.
              </Text>

              {/* Buttons */}
              <View className="flex-row gap-3">
                <Button
                  title="Not Now"
                  onPress={handleNotNow}
                  variant="outline"
                  fullWidth
                  className="flex-1"
                />
                <Button
                  title="Allow"
                  onPress={handleAllow}
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

export default InvestorAccessModal;
