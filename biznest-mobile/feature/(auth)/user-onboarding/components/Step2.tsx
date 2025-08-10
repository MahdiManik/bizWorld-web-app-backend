import { View, Text } from 'react-native';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Input from '@/components/ui/input';
import RadioButton from '@/components/ui/radio-button';
import FileInput from '@/components/ui/file-input';
import Button from '@/components/ui/button';
import { UserOnboardingFormData } from '../types/user-onboarding.types';
import DropDown from '@/components/ui/drop-down';
import { industryOptions } from './IndustryExpertiesData';

interface Step2Props {
  onSubmit: () => void;
}

const Step2: React.FC<Step2Props> = ({ onSubmit }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<UserOnboardingFormData>();
  return (
    <View className="gap-2">
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">
          Company name *
        </Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Enter company name"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">Industry *</Text>
        <Controller
          control={control}
          name="industry"
          render={({ field: { onChange, value } }) => (
            <DropDown
              data={industryOptions}
              value={value}
              onChange={(val) => {
                onChange(val);
              }}
              placeholder="Select industry"
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">Location *</Text>
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Enter company location"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              error={errors.location?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">Company Size *</Text>
        <Controller
          control={control}
          name="companySize"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Enter number of employees"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              error={errors.location?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">
          Company Status
        </Text>
        <Controller
          control={control}
          name="companyStatus"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row gap-4">
              <RadioButton
                value={value === true}
                onPress={() => onChange(true)}
                label="Active"
              />
              <RadioButton
                value={value === false}
                onPress={() => onChange(false)}
                label="Closing"
              />
            </View>
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">Revenue *</Text>
        <Controller
          control={control}
          name="revenue"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Enter company's annual revenue"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              error={errors.revenue?.message}
            />
          )}
        />
      </View>
      <Controller
        control={control}
        name="companyDocument"
        render={({ field: { onChange, value } }) => (
          <FileInput
            label="Upload Document"
            placeholder="Select a file to upload"
            value={value}
            onChange={onChange}
          />
        )}
      />
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Enter description"
              className="bg-white"
              multiline
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <Button title="Submit" onPress={onSubmit} className="my-10" fullWidth />
    </View>
  );
};

export default Step2;
