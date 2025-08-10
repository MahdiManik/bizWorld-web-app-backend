import { View, Text } from 'react-native';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Input from '@/components/ui/input';
import DropDown from '@/components/ui/drop-down';
import CountryDropdown from '@/components/ui/country-drop-down';
import FileInput from '@/components/ui/file-input';
import Button from '@/components/ui/button';
import { UserOnboardingFormData } from '../types/user-onboarding.types';
import MultiSelectDropDown from '@/components/ui/multi-select-drop-down';
import { expertiseOptions, industryOptions } from './IndustryExpertiesData';

interface Step1Props {
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ onNext }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<UserOnboardingFormData>();


  return (
    <View className="gap-2">
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">
          Professional Headline *
        </Text>
        <Controller
          control={control}
          name="professionalHeadline"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Financial Advisor"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              error={errors.professionalHeadline?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">
          Industry Specialization *
        </Text>
        <Controller
          control={control}
          name="industrySpecialization"
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
        <Text className="font-roboto400 text-sm text-title">
          Areas of Expertise *
        </Text>
        <Controller
          control={control}
          name="areasOfExpertise"
          render={({ field: { onChange, value } }) => (
            <MultiSelectDropDown
              data={expertiseOptions}
              value={value}
              onChange={onChange}
              placeholder="Select areas of expertise"
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">
          Portfolio Link *
        </Text>
        <Controller
          control={control}
          name="portfolioLink"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="myportfolio.com"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              error={errors.portfolioLink?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto400 text-sm text-title">Phone No *</Text>
        <View className="w-full flex-row gap-2">
          <Controller
            control={control}
            name="phonePrefix"
            render={({ field: { onChange, value } }) => (
              <CountryDropdown value={value} onChange={onChange} />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Phone No"
                style={{ flex: 1 }}
                value={value}
                onChangeText={onChange}
                error={errors.phone?.message}
              />
            )}
          />
        </View>
      </View>
      <Controller
        control={control}
        name="document"
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
        <Text className="font-roboto400 text-sm text-title">
          Introduce Yourself
        </Text>
        <Controller
          control={control}
          name="introduction"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Tell us about yourself"
              className="bg-white"
              multiline
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <Button title="Next" onPress={onNext} className="my-10" fullWidth />
    </View>
  );
};

export default Step1;
