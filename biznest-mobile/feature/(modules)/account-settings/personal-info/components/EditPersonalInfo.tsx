import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import EditPersonalInfoForm from './EditPersonalnfoForm';
import { useGetMe } from '@/feature/(auth)/hooks/useAuth';

const EditPersonalInfo = () => {

  const { data } = useGetMe();
  const user = data?.data;
  const profile = user?.user_profile;
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header title="Edit Personal Info" showBackButton />
        <KeyboardAvoidingView
          className="px-4"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            className="h-full w-full"
            showsVerticalScrollIndicator={false}
          >
            <EditPersonalInfoForm profile={profile} user={user} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default EditPersonalInfo;
