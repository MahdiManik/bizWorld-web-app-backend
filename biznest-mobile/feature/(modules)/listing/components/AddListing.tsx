import { TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import AddListingForm from './AddListingForm';

const AddListing = () => {
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-white"
      >
        <Header
          title="Add New Listing"
          showBackButton
          rightComponent={
            <TouchableOpacity>
              <NotiIcon />
            </TouchableOpacity>
          }
        />
        <KeyboardAvoidingView
          className="py-4"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <AddListingForm type="create" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default AddListing;
