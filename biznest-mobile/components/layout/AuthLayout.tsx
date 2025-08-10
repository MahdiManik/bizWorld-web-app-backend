import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
} from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import AuthLayoutIcon from '@/assets/svgs/auth/AuthLayoutIcon';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        className="px-10"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="h-full w-full">
          <View className="h-full w-full gap-5 pt-6">
            <View className="mt-4 w-full items-center gap-6">
              <AuthLayoutIcon />
            </View>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthLayout;
