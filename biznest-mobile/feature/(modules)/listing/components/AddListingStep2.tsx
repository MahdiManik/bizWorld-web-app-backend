import { View, Text, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { BarChart } from 'react-native-chart-kit';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { AddListingFormData } from '../types/add-listing.types';

interface AddListingStep2Props {
  onNext: () => void;
  onPrev: () => void;
}

const AddListingStep2: React.FC<AddListingStep2Props> = ({
  onNext,
  onPrev,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AddListingFormData>();

  const screenWidth = Dimensions.get('window').width;

  // Watch all step2 values for the chart
  const step2Values = useWatch({
    control,
    name: 'step2',
  });

  const chartData = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: [
          parseFloat(step2Values?.jan || '0'),
          parseFloat(step2Values?.feb || '0'),
          parseFloat(step2Values?.mar || '0'),
          parseFloat(step2Values?.apr || '0'),
          parseFloat(step2Values?.may || '0'),
          parseFloat(step2Values?.jun || '0'),
          parseFloat(step2Values?.jul || '0'),
          parseFloat(step2Values?.aug || '0'),
          parseFloat(step2Values?.sep || '0'),
          parseFloat(step2Values?.oct || '0'),
          parseFloat(step2Values?.nov || '0'),
          parseFloat(step2Values?.dec || '0'),
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: () => `#4B83E5`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4B83E5',
    },
  };

  return (
    <View className="gap-4">
      <Text className="font-roboto600 text-xl text-title">
        Revenue Breakdown
      </Text>

      <View className="gap-2">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 8 }}
        >
          <BarChart
            data={chartData}
            width={screenWidth * 2}
            height={180}
            chartConfig={chartConfig}
            style={{
              borderRadius: 16,
            }}
            yAxisLabel="$"
            yAxisSuffix="k"
            fromZero
          />
        </ScrollView>
      </View>
      <View className="flex-row gap-4">
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">Jan</Text>
          <Controller
            control={control}
            name="step2.jan"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.jan?.message}
              />
            )}
          />
        </View>
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">Feb</Text>
          <Controller
            control={control}
            name="step2.feb"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.feb?.message}
              />
            )}
          />
        </View>
      </View>
      <View className="flex-row gap-4">
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">Mar</Text>
          <Controller
            control={control}
            name="step2.mar"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.mar?.message}
              />
            )}
          />
        </View>
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">Apr</Text>
          <Controller
            control={control}
            name="step2.apr"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.apr?.message}
              />
            )}
          />
        </View>
      </View>
      <View className="flex-row gap-4">
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">May</Text>
          <Controller
            control={control}
            name="step2.may"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.may?.message}
              />
            )}
          />
        </View>
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">Jun</Text>
          <Controller
            control={control}
            name="step2.jun"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.jun?.message}
              />
            )}
          />
        </View>
      </View>
      <View className="flex-row gap-4">
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">Jul</Text>
          <Controller
            control={control}
            name="step2.jul"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.jul?.message}
              />
            )}
          />
        </View>
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">Aug</Text>
          <Controller
            control={control}
            name="step2.aug"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.aug?.message}
              />
            )}
          />
        </View>
      </View>
      <View className="flex-row gap-4">
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">Sep</Text>
          <Controller
            control={control}
            name="step2.sep"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.sep?.message}
              />
            )}
          />
        </View>
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">Oct</Text>
          <Controller
            control={control}
            name="step2.oct"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.oct?.message}
              />
            )}
          />
        </View>
      </View>
      <View className="flex-row gap-4">
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">Nov</Text>
          <Controller
            control={control}
            name="step2.nov"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.nov?.message}
              />
            )}
          />
        </View>
        <View className="flex-1 gap-2">
          <Text className="font-roboto500 text-sm text-title">Dec</Text>
          <Controller
            control={control}
            name="step2.dec"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="0"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                leftIcon={
                  <Text className="font-roboto600 text-sm text-black">$</Text>
                }
                error={errors.step2?.dec?.message}
              />
            )}
          />
        </View>
      </View>

      <View className="gap-2">
        <Text className="font-roboto500 text-sm text-title">EBITDA</Text>
        <Controller
          control={control}
          name="step2.ebitda"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="0"
              className="bg-white"
              value={value}
              onChangeText={onChange}
              leftIcon={
                <Text className="font-roboto600 text-sm text-black">$</Text>
              }
              error={errors.step2?.ebitda?.message}
            />
          )}
        />
      </View>
      <View className="mb-20 flex flex-row justify-between">
        <Button title="Previous" onPress={onPrev} variant="outline" />
        <Button title="Next" onPress={onNext} />
      </View>
    </View>
  );
};

export default AddListingStep2;
