import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import NotiIcon from '@/assets/svgs/home/NotiIcon';
import AddServiceForm from './add-service/AddServiceForm';

const EditService = () => {
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-gray-white"
      >
        <Header
          title="Edit Service"
          showBackButton
          rightComponent={
            <TouchableOpacity>
              <NotiIcon />
            </TouchableOpacity>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView
            className="px-4"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <AddServiceForm type="edit" />
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditService;
