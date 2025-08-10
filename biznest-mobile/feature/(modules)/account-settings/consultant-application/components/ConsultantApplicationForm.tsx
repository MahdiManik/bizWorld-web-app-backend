import { View, Text } from 'react-native';
import React from 'react';
import DropDown from '@/components/ui/drop-down';
import FileInput from '@/components/ui/file-input';
import Input from '@/components/ui/input';
import { router } from 'expo-router';
import Button from '@/components/ui/button';

const ConsultantApplicationForm = () => {
  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">
          Area of Expertise *
        </Text>
        <DropDown
          data={[{ label: 'Business Strategy', value: 'Business Strategy' }]}
          value={''}
          onChange={() => {}}
          placeholder="Business Strategy"
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">
          Years of Experience *
        </Text>
        <DropDown
          data={[{ label: 'Business Strategy', value: 'Business Strategy' }]}
          value={''}
          onChange={() => {}}
          placeholder="Business Strategy"
        />
      </View>

      <FileInput
        label="Upload Resume/CV *"
        placeholder="Select a file to upload"
        value={''}
        onChange={() => {}}
      />
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">Portfolio URL</Text>
        <Input placeholder="myportfolio.com" className="bg-white" />
      </View>

      <View className="border border-[#eeeeee]" />

      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">
          Additional Information
        </Text>
        <Input
          placeholder="Anything else you’d like us to know about your application"
          className="bg-white"
          multiline
        />
      </View>
      <View className="my-14 flex flex-row gap-4">
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          className="flex-1 justify-center"
        />
        <Button
          title="Submit"
          onPress={() => router.push('/consultant-application-success')}
          className="flex-1 justify-center"
        />
      </View>
    </View>
  );
};

export default ConsultantApplicationForm;
