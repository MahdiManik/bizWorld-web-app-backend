import React, { useCallback, forwardRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetFooter,
  BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import Button from '@/components/ui/button';
import Dropdown from '@/components/ui/drop-down';
import Input from '../ui/input';

export interface FilterFormData {
  industries: string[];
  priceMin: string;
  priceMax: string;
  businessType: string;
  investmentType: string;
}

interface ListingFilterModalProps {
  onApply: (filters: FilterFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<FilterFormData>;
  snapPoints?: string[];
  index?: number;
  onChange?: (index: number) => void;
}

const ListingFilterModal = forwardRef<
  BottomSheetModal,
  ListingFilterModalProps
>(
  (
    {
      onApply,
      onCancel,
      initialData,
      snapPoints = ['55%', '90%'],
      index = 0,
      onChange,
    },
    ref
  ) => {
    const { control, handleSubmit, watch, setValue } = useForm<FilterFormData>({
      defaultValues: {
        industries: initialData?.industries || [],
        priceMin: initialData?.priceMin || '',
        priceMax: initialData?.priceMax || '',
        businessType: initialData?.businessType || '',
        investmentType: initialData?.investmentType || '',
      },
    });

    const watchedIndustries = watch('industries');

    const industries = [
      'Finance',
      'Technology',
      'Education',
      'Healthcare',
      'Media & Entertainment',
      'Insurance',
      'Marketing & Advertising',
      'E-commerce',
      'Manufacturing',
      'Food & Beverage',
    ];

    const businessTypes = [
      { label: 'Startup', value: 'startup' },
      { label: 'Small Business', value: 'small_business' },
      { label: 'Enterprise', value: 'enterprise' },
      { label: 'Corporation', value: 'corporation' },
    ];

    const investmentTypes = [
      { label: 'Full Sale', value: 'full_sale' },
      { label: 'Partnership', value: 'partnership' },
      { label: 'Investment', value: 'investment' },
      { label: 'Acquisition', value: 'acquisition' },
    ];

    const toggleIndustry = (industry: string) => {
      const currentIndustries = watchedIndustries || [];
      const newIndustries = currentIndustries.includes(industry)
        ? currentIndustries.filter((item) => item !== industry)
        : [...currentIndustries, industry];
      setValue('industries', newIndustries);
    };

    const selectAllIndustries = () => {
      const currentIndustries = watchedIndustries || [];
      if (currentIndustries.length === industries.length) {
        setValue('industries', []);
      } else {
        setValue('industries', industries);
      }
    };

    const handleFormSubmit = (data: FilterFormData) => {
      onApply(data);
    };

    const isIndustrySelected = (industry: string) =>
      watchedIndustries?.includes(industry) || false;

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.1}
        />
      ),
      []
    );

    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => (
        <BottomSheetFooter {...props}>
          <View className="flex-row justify-between gap-4 bg-white px-5 pb-8 pt-4">
            <View className="flex-1">
              <Button
                title="Cancel"
                onPress={onCancel || (() => {})}
                variant="outline"
                fullWidth
              />
            </View>
            <View className="flex-1">
              <Button
                title="Apply"
                onPress={handleSubmit(handleFormSubmit)}
                fullWidth
              />
            </View>
          </View>
        </BottomSheetFooter>
      ),
      [onCancel, handleSubmit, handleFormSubmit]
    );

    return (
      <BottomSheetModal
        ref={ref}
        backdropComponent={renderBackdrop}
        index={index}
        snapPoints={snapPoints}
        onChange={onChange}
        footerComponent={renderFooter}
      >
        <BottomSheetScrollView className="flex-1 bg-white">
          <View className="p-6">
            {/* Header */}
            <Text className="mb-6 text-center font-roboto600 text-xl text-title">
              Filter
            </Text>

            {/* Industry Section */}
            <View className="mb-6">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-roboto600 text-base text-title">
                  Industry
                </Text>
                <TouchableOpacity onPress={selectAllIndustries}>
                  <Text className="font-roboto500 text-sm text-primary">
                    Select All
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {industries.map((industry) => (
                  <TouchableOpacity
                    key={industry}
                    onPress={() => toggleIndustry(industry)}
                    className={`rounded-full border px-4 py-2 ${
                      isIndustrySelected(industry)
                        ? 'border-primary bg-primary'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <Text
                      className={`font-roboto500 text-sm ${
                        isIndustrySelected(industry)
                          ? 'text-white'
                          : 'text-gray-700'
                      }`}
                    >
                      {industry}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View className="mb-6">
              <Text className="mb-4 font-roboto600 text-base text-title">
                Price Range
              </Text>
              <View className="flex-row gap-3">
                <Controller
                  control={control}
                  name="priceMin"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Min Price"
                      className="bg-white"
                      value={value}
                      onChangeText={onChange}
                      style={{ width: '48%' }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="priceMax"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Max Price"
                      className="bg-white"
                      value={value}
                      onChangeText={onChange}
                      style={{ width: '48%' }}
                    />
                  )}
                />
              </View>
            </View>
            {/* Business Type Section */}
            <View className="mb-6">
              <Text className="mb-4 font-roboto600 text-base text-title">
                Business Type
              </Text>
              <Controller
                control={control}
                name="businessType"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    placeholder="Startup"
                    options={businessTypes}
                    value={value}
                    onChange={(selectedValue) => onChange(selectedValue || '')}
                  />
                )}
              />
            </View>

            {/* Investment Type Section */}
            <View className="mb-8">
              <Text className="mb-4 font-roboto600 text-base text-title">
                Investment Type
              </Text>
              <Controller
                control={control}
                name="investmentType"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    placeholder="Full Sale"
                    options={investmentTypes}
                    value={value}
                    onChange={(selectedValue) => onChange(selectedValue || '')}
                  />
                )}
              />
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

ListingFilterModal.displayName = 'ListingFilterModal';

export default ListingFilterModal;
