import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import ConsultantApplicationForm from './ConsultantApplicationForm';

const ConsultantApplication = () => {
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header title="Consultant Application" showBackButton />
        <KeyboardAvoidingView
          className="px-6"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView className="my-5 h-full w-full">
            <Text className="mb-5 font-roboto600 text-xl text-title">
              Professional Information
            </Text>
            <ConsultantApplicationForm />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default ConsultantApplication;
