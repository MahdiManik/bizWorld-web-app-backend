import { View, Text, Alert } from 'react-native';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { router } from 'expo-router';
import DropDown from '@/components/ui/drop-down';
import ImageInput from '@/components/ui/image-input';
import {
  AddServiceFormData,
  addServiceSchema,
} from '../../types/service.types';
import { useCreateConsultantService, useUpdateConsultantService } from '../../hooks/useService';
import { fileUpload } from '@/lib/fileUpload';
import useSession from '@/store/session';
import { Service } from '../../types/service';

interface AddServiceFormProp {
  type: 'create' | 'edit';
  service?: Service;
}
const AddServiceForm = ({ type, service }: AddServiceFormProp) => {
  const { user } = useSession();
  const createServiceMutation = useCreateConsultantService();
  const updateServiceMutation = useUpdateConsultantService();
  const [originalThumbnail, setOriginalThumbnail] = React.useState(service?.coverImage?.id || null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddServiceFormData>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      serviceTitle: service?.title || '',
      description: service?.description || '',
      hourlyRate: service?.hourlyRate?.toString() || '',
      sessionDuration: service?.sessionDuration || '1 hour',
      category: service?.tag || 'Technology',
      thumbnail: service?.coverImage ? {
        uri: service.coverImage.url || '',
        name: service.coverImage.name || 'image',
        id: service.coverImage.id,
      } : undefined,
    },
  });

  const sessionDurationOptions = [
    { label: '30 minutes', value: '30 minutes' },
    { label: '1 hour', value: '1 hour' },
    { label: '1.5 hours', value: '1.5 hours' },
    { label: '2 hours', value: '2 hours' },
    { label: '3 hours', value: '3 hours' },
  ];

  const categoryOptions = [
    { label: 'Technology', value: 'Technology' },
    { label: 'Business Strategy', value: 'Business Strategy' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Legal', value: 'Legal' },
    { label: 'Design', value: 'Design' },
  ];

  const onSubmit = async (data: AddServiceFormData) => {
    try {
      if (!user?.documentId) {
        Alert.alert('Error', 'User not found. Please login again.');
        return;
      }

      let coverImageId = originalThumbnail;

      // Check if thumbnail has changed and upload if necessary
      const thumbnailChanged = type === 'create' || 
        (data.thumbnail && !data.thumbnail.id) || 
        (data.thumbnail?.id !== originalThumbnail);

      if (data.thumbnail && thumbnailChanged) {
        const uploadedId = await fileUpload(data.thumbnail);
        if (!uploadedId) {
          Alert.alert('Error', 'Failed to upload thumbnail image.');
          return;
        }
        coverImageId = uploadedId;
      }

      // Prepare service data
      const serviceData = {
        title: data.serviceTitle,
        description: data.description,
        hourlyRate: parseFloat(data.hourlyRate),
        sessionDuration: data.sessionDuration,
        tag: data.category.toLowerCase(),
        ...(type === 'create' && { consultant: user.documentId }),
        ...(coverImageId && { coverImage: coverImageId }),
      };

      if (type === 'create') {
        await createServiceMutation.mutateAsync(serviceData);
        Alert.alert('Success', 'Service created successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        if (!service?.documentId) {
          Alert.alert('Error', 'Service not found.');
          return;
        }
        await updateServiceMutation.mutateAsync({
          id: service.documentId,
          data: serviceData,
        });
        Alert.alert('Success', 'Service updated successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error(`Error ${type === 'create' ? 'creating' : 'updating'} service:`, error);
      Alert.alert('Error', `Failed to ${type === 'create' ? 'create' : 'update'} service. Please try again.`);
    }
  };

  return (
    <View className="my-4 flex-col justify-center">
      <Text className="mb-6 font-roboto600 text-lg text-title">
        {type === 'create' ? 'Create Service' : 'Edit Service'}
      </Text>

      <View className="flex-col justify-center gap-4 bg-gray-white">
        {/* Service Title */}
        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">
            Service Title <Text className="text-red-500">*</Text>
          </Text>
          <Controller
            control={control}
            name="serviceTitle"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter service title"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors?.serviceTitle?.message}
              />
            )}
          />
        </View>

        {/* Description */}
        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">
            Description <Text className="text-red-500">*</Text>
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Describe what this service includes..."
                className="bg-white"
                multiline
                numberOfLines={4}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors?.description?.message}
              />
            )}
          />
        </View>

        {/* Hourly Rate */}
        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">
            Hourly Rate ($) <Text className="text-red-500">*</Text>
          </Text>
          <Controller
            control={control}
            name="hourlyRate"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="e.g, 150"
                className="bg-white"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors?.hourlyRate?.message}
              />
            )}
          />
        </View>

        {/* Session Duration */}
        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">
            Session Duration
          </Text>
          <Controller
            control={control}
            name="sessionDuration"
            render={({ field: { onChange, value } }) => (
              <DropDown
                options={sessionDurationOptions}
                value={value}
                onChange={onChange}
                placeholder="Select duration"
              />
            )}
          />
        </View>

        {/* Tags / Categories */}
        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">
            Tags / Categories
          </Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <DropDown
                options={categoryOptions}
                value={value}
                onChange={onChange}
                placeholder="Select category"
              />
            )}
          />
        </View>

        {/* Thumbnail / Cover Image */}
        <Controller
          control={control}
          name="thumbnail"
          render={({ field: { onChange, value } }) => (
            <ImageInput
              label="Thumbnail / Cover Image"
              placeholder="Choose File"
              value={value || ''}
              onChange={onChange}
            />
          )}
        />
      </View>

      {/* Create Service Button */}
      <View className="my-6">
        <Button
          title={type === 'create' ? 'Create service' : 'Update service'}
          onPress={handleSubmit(onSubmit)}
          fullWidth
          disabled={isSubmitting || createServiceMutation.isPending || updateServiceMutation.isPending}
        />
      </View>
    </View>
  );
};

export default AddServiceForm;
