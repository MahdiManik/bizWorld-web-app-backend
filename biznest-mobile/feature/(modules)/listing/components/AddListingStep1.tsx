import { View, Text } from 'react-native';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Input from '@/components/ui/input';
import DropDown from '@/components/ui/drop-down';
import RadioButton from '@/components/ui/radio-button';
import { Divider } from 'react-native-paper';
import Button from '@/components/ui/button';
import { AddListingFormData } from '../types/add-listing.types';
import ImageInput from '@/components/ui/image-input';

interface AddListingStep1Props {
  onNext: () => void;
}

const AddListingStep1: React.FC<AddListingStep1Props> = ({ onNext }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AddListingFormData>();

  return (
    <View className="gap-4">
      <Text className="font-roboto600 text-xl text-title">
        General Information
      </Text>
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">Listing Title</Text>
        <Controller
          control={control}
          name="step1.title"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Enter Listing Title"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              error={errors.step1?.title?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">
          Location / Country
        </Text>
        <Controller
          control={control}
          name="step1.location"
          render={({ field: { onChange, value } }) => (
            <DropDown
              data={[
                { label: 'Bangladesh', value: 'Bangladesh' },
                { label: 'China', value: 'China' },
                { label: 'Singapore', value: 'Singapore' },
                { label: 'Thailand', value: 'Thailand' },
                { label: 'Myanmar', value: 'Myanmar' },
              ]}
              value={value}
              onChange={onChange}
              placeholder="Country"
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">
          Tags / Categories
        </Text>
        <Controller
          control={control}
          name="step1.category"
          render={({ field: { onChange, value } }) => (
            <DropDown
              data={[
                { value: 'E-commerce', label: 'E-commerce' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Technology', label: 'Technology' },
                { value: 'Education', label: 'Education' },
                {
                  value: 'Media & Entertainment',
                  label: 'Media & Entertainment',
                },
                { value: 'Insurance', label: 'Insurance' },
                {
                  value: 'Marketing & Advertising',
                  label: 'Marketing & Advertising',
                },
                { value: 'Manufacturing', label: 'Manufacturing' },
                { value: 'Food & Beverage', label: 'Food & Beverage' },
                { value: 'Healthcare', label: 'Healthcare' },
                { value: 'Business Strategy', label: 'Business Strategy' },
                { value: 'Operations', label: 'Operations' },
              ]}
              value={value}
              onChange={onChange}
              placeholder="Business Strategy"
            />
          )}
        />
      </View>
      <Controller
        control={control}
        name="step1.thumbnail"
        render={({ field: { onChange, value } }) => (
          <ImageInput
            label="Thumbnail / Cover Image"
            placeholder="Select a file to upload"
            value={value || ''}
            onChange={onChange}
          />
        )}
      />

      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">Listing Type</Text>
        <Controller
          control={control}
          name="step1.isPrivate"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row gap-4">
              <View className="flex-1">
                <RadioButton
                  value={value === true}
                  onPress={() => onChange(true)}
                  label="Private"
                />
              </View>
              <View className="flex-1">
                <RadioButton
                  value={value === false}
                  onPress={() => onChange(false)}
                  label="Public"
                />
              </View>
            </View>
          )}
        />
      </View>
      <Divider />

      <Text className="font-roboto600 text-xl text-title">
        Investment Opportunity
      </Text>
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">Asking Price</Text>
        <Controller
          control={control}
          name="step1.askingPrice"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Enter Investment Amount"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              leftIcon={
                <Text className="font-roboto600 text-sm text-black">$</Text>
              }
              error={errors.step1?.askingPrice?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">
          Equity Offered
        </Text>
        <Controller
          control={control}
          name="step1.equityOffered"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Enter Equity Percentage"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              leftIcon={
                <Text className="font-roboto600 text-sm text-black">%</Text>
              }
              error={errors.step1?.equityOffered?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">
          Revenue (Annual)
        </Text>
        <Controller
          control={control}
          name="step1.annualRevenue"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Enter Minimum Investment"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              leftIcon={
                <Text className="font-roboto600 text-sm text-black">$</Text>
              }
              error={errors.step1?.annualRevenue?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">Profit Margin</Text>
        <Controller
          control={control}
          name="step1.profitMargin"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Enter Expected ROI"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              leftIcon={
                <Text className="font-roboto600 text-sm text-black">%</Text>
              }
              error={errors.step1?.profitMargin?.message}
            />
          )}
        />
      </View>
      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">Growth Rate</Text>
        <Controller
          control={control}
          name="step1.growthRate"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Enter Projected Growth"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              leftIcon={
                <Text className="font-roboto600 text-sm text-black">YoY %</Text>
              }
              error={errors.step1?.growthRate?.message}
            />
          )}
        />
      </View>
      <View className="mb-20 flex-row justify-end">
        <Button title="Next" onPress={onNext} />
      </View>
    </View>
  );
};

export default AddListingStep1;
