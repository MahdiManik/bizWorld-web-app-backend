import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import AutoReplyToggle from './AutoReplyToggle';
import ServiceToggleCard from './ServiceToggleCard';
import Button from '@/components/ui/button';
import { useRouter } from 'expo-router';

const AutoReply = () => {
  const router = useRouter();
  const [isAutoReplyEnabled, setIsAutoReplyEnabled] = useState(false);
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header title="Auto Reply" showBackButton />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-1 p-4">
            <View className="">
              {/* Auto Reply Header */}
              <Text className="mb-2 font-roboto600 text-lg text-title">
                Auto Reply
              </Text>
              <Text className="mb-6 font-roboto400 text-xs text-placeholder">
                Configure automatic responses for client inquiries
              </Text>

              {/* Auto Reply Toggle */}
              <View className="rounded-lg border-[0.5px] border-stroke-border bg-white px-4 pt-3 shadow-sm">
                <AutoReplyToggle
                  title="Enable auto reply"
                  description=""
                  value={isAutoReplyEnabled}
                  onValueChange={setIsAutoReplyEnabled}
                />
              </View>

              {/* Auto Message Section with toggle */}
              {isAutoReplyEnabled && (
                <>
                  <View className="rounded-lg border-[0.5px] border-stroke-border bg-white p-4 mt-4 shadow-sm">
                    <Text className="font-roboto500 text-sm text-title">
                      Auto Message
                    </Text>
                    <View className="rounded-lg border-[0.5px] border-stroke-border bg-gray-white p-4 mt-4">
                      <Text className="font-roboto400 text-xs text-description-text ">
                        Thank you for your inquiry! I&apos;m currently unavailable but will review your message and get back to you within 24 hours. For urgent matters, please call my office at (555) 123-4567.
                      </Text>
                    </View>
                  </View>

                  {/* Service Toggle Card */}
                  <View>
                    <ServiceToggleCard />
                  </View>
                </>
              )}

            </View>
            <View className="mt-20 flex-row items-center gap-4 justify-center my-8">
              <Button
                title="Preview"
                variant='outline'
                onPress={() => { router.push('/(modal)/auto-reply-preview') }}
                fullWidth
                className='w-full flex-1'
              />
              <Button
                title="Save Setting"
                variant='primary'
                onPress={() => { }}
                fullWidth
                className='w-full flex-1'
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AutoReply;
