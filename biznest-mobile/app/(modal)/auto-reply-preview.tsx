import React from 'react';
import { View, Modal, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const AutoReplyPreviewModal = () => {
  const handleClose = () => {
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
            <View className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              {/* Title */}
              <Text className="mb-2 text-center font-roboto600 text-lg text-title">
                Auto-Reply Preview
              </Text>

              {/* Subtitle */}
              <Text className="mb-6 text-center font-roboto400 text-sm text-description-text">
                This is how your auto-reply will appear to clients.
              </Text>

              {/* Preview Card */}
              <View className="mb-6 rounded-xl border border-stroke-border bg-gray-white">
                {/* Auto-Reply Header */}
                <View className="mb-3 rounded-t-lg border border-stroke-border bg-lightgray p-4">
                  <Text className="font-roboto500 text-base text-title">
                    Auto-Reply from Your Consultant
                  </Text>
                </View>

                <View className="flex-1 p-4">
                  {/* Message Content */}
                  <Text className="leading-4text-description-text mb-4 font-roboto400 text-xs">
                    Thank you for your inquiry! I&apos;m currently unavailable
                    but will review your message and get back to you within 24
                    hours. For urgent matters, please call my office at (555)
                    123-4567.
                  </Text>

                  {/* Featured Services */}
                  <Text className="mb-3 font-roboto500 text-base text-title">
                    Featured Services:
                  </Text>

                  {/* Service 1 */}
                  <View className="mb-3 rounded-lg bg-white p-3 shadow-sm">
                    <Text className="mb-1 font-roboto500 text-base text-title">
                      Business Strategy Consultation
                    </Text>
                    <Text className="mb-2 font-roboto500 text-xs text-link">
                      $150 / hour
                    </Text>
                    <Text className="font-roboto400 text-xs text-description-text">
                      Comprehensive business strategy review and planning for
                      startups and small businesses.
                    </Text>
                  </View>

                  {/* Service 2 */}
                  <View className="rounded-lg bg-white p-3 shadow-sm">
                    <Text className="mb-1 font-roboto500 text-base text-title">
                      Marketing Plan Development
                    </Text>
                    <Text className="mb-2 font-roboto500 text-xs text-link">
                      $150 / hour
                    </Text>
                    <Text className="font-roboto400 text-sm text-description-text">
                      Create effective marketing strategies tailored to your
                      business goals and target audience.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Close Button */}
              <View className="flex-row items-center justify-end">
                <Button
                  title="Close"
                  onPress={handleClose}
                  variant="outline"
                  className="w-[30%]"
                  fullWidth
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AutoReplyPreviewModal;
