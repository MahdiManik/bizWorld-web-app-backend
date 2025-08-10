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

export interface FilterFormData {
  industries: string[];
  businessName: string;
}

interface InvestorFilterModalProps {
  onApply: (filters: FilterFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<FilterFormData>;
  snapPoints?: string[];
  index?: number;
  onChange?: (index: number) => void;
  businessNameOptions?: { label: string; value: string }[];
}

const InvestorFilterModal = forwardRef<
  BottomSheetModal,
  InvestorFilterModalProps
>(
  (
    {
      onApply,
      onCancel,
      initialData,
      snapPoints = ['55%', '90%'],
      index = 0,
      onChange,
      businessNameOptions = [],
    },
    ref
  ) => {
    const { control, handleSubmit, watch, setValue } = useForm<FilterFormData>({
      defaultValues: {
        industries: initialData?.industries || [],
        businessName: initialData?.businessName || '',
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
    const businessName = businessNameOptions || [];

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

            {/* Business Name Section */}
            <View className="mb-6">
              <Text className="mb-4 font-roboto600 text-base text-title">
                Business Name
              </Text>
              <Controller
                control={control}
                name="businessName"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    placeholder="Filter by business name"
                    options={businessName}
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

InvestorFilterModal.displayName = 'InvestorFilterModal';

export default InvestorFilterModal;
