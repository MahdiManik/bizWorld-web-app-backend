import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import EditProfileInfoForm from './EditProfileInfoForm';
import { useLocalSearchParams } from 'expo-router';

const EditProfileInfo = () => {
  const { consultantName } = useLocalSearchParams();

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-white"
      >
        <Header showBackButton title="Edit Profile Info" />
        <ScrollView contentContainerClassName="flex-1 p-4">
          <View className="rounded-lg border border-stroke-border bg-gray-white p-4">
            <Text className="font-roboto500 text-base text-title">
              Request Consultation with {consultantName}
            </Text>
            <EditProfileInfoForm />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditProfileInfo;
