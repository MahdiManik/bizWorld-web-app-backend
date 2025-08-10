import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import Input from '@/components/ui/input';
import CountryDropdown from '@/components/ui/country-drop-down';
import DropDown from '@/components/ui/drop-down';
import MultiSelectDropDown from '@/components/ui/multi-select-drop-down';
import FileInput from '@/components/ui/file-input';
import Button from '@/components/ui/button';
import {
  editPersonalInfoSchema,
  EditPersonalInfoFormData,
} from '../types/edit-personal-info.types';
import { useEditPersonalInfo } from '../hooks/useEditPersonalInfo';
import { User } from '@/services/authServices';
import { fileUpload } from '@/lib/fileUpload';
import { expertiseOptions, industryOptions } from '@/feature/(auth)/user-onboarding/components/IndustryExpertiesData';
import { useImagePicker } from '../hooks/useImagePicker';

interface EditPersonalInfoFormProps {
  profile: EditPersonalInfoFormData;
  user: User;
}

const EditPersonalInfoForm = ({ profile, user }: EditPersonalInfoFormProps) => {
  const { mutateAsync, isPending } = useEditPersonalInfo();
  const { selectedImage, selectedImageId, pickImage } = useImagePicker();

  const methods = useForm<EditPersonalInfoFormData>({
    resolver: zodResolver(editPersonalInfoSchema),
    defaultValues: {
      documentId: profile?.documentId,
      fullName: user?.fullName || '',
      email: user?.email || '',
      image: profile?.image?.url,
      phonePrefix: profile?.phonePrefix || '',
      phone: profile?.phone || '',
      professionalHeadline: profile?.professionalHeadline || '',
      industrySpecialization: profile?.industrySpecialization || '',
      areasOfExpertise: Array.isArray(profile?.areasOfExpertise)
        ? profile.areasOfExpertise
        : [],
      portfolioLink: profile?.portfolioLink || '',
      document: profile?.document?.id && profile?.document?.url
        ? {
          uri: profile?.document?.url,
          name: profile?.document?.name,
          type: profile?.document?.mimeType,
        }
        : null,
      introduction: profile?.introduction || '',
    },
  });

  const { control, handleSubmit, formState: { errors } } = methods;

  const onSubmit: SubmitHandler<EditPersonalInfoFormData> = async (formData) => {
    let documentId = profile?.document?.id || null;

    if (formData.document && formData.document.uri && formData.document.uri !== profile?.document?.url) {
      const { uri, file } = formData.document;
      console.log('Uploading document:', { uri, file });
      const uploadPayload = {
        uri,
        file
      };

      const uploaded = await fileUpload(uploadPayload);
      documentId = uploaded;
    }

    const payload: EditPersonalInfoFormData = {
      ...formData,
      areasOfExpertise: formData.areasOfExpertise,
    };

    if (selectedImageId) {
      payload.image = selectedImageId;
    } else if (profile?.image?.id) {
      payload.image = profile.image.id;
    }

    if (documentId) {
      payload.document = documentId;
    }

    delete (payload as any).documentId;

    await mutateAsync({
      data: {
        ...payload,
        fullName: formData.fullName,
        email: formData.email,
      },
      id: profile?.documentId,
      userId: user?.id,
    });
  };

  return (
    <View className="my-10">
      <View className="gap-4 rounded-lg border-[0.5px] border-stroke-border bg-white p-4">
        <View className="flex-col items-center">
          <TouchableOpacity onPress={pickImage} className="relative">
            <View className="h-20 w-20 overflow-hidden rounded-full shadow-lg">
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage.uri }
                    : profile?.image?.url
                      ? { uri: profile?.image?.url }
                      : require('@/assets/images/consultants.png')
                }
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </View>
            <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary">
              <MaterialIcons name="edit" size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 gap-2">
            <Text className="font-roboto400 text-sm text-title">
              Full Name *
            </Text>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Enter full name"
                  className="bg-white"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors?.fullName?.message}
                />
              )}
            />
          </View>

        </View>
        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">Email *</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter email address"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors?.email?.message}
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
                <CountryDropdown value={value || ''} onChange={onChange} />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Phone No"
                  style={{ flex: 1 }}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  error={errors?.phone?.message}
                />
              )}
            />
          </View>
        </View>
        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">
            Professional Headline *
          </Text>
          <Controller
            control={control}
            name="professionalHeadline"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter professional headline"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors?.professionalHeadline?.message}
              />
            )}
          />
        </View>
        <View className="flex-1 gap-2">
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
                onChange={onChange}
                placeholder="Select industry specialization"
              />
            )}
          />
        </View>
        <View className="flex-1 gap-2">
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
        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">
            Portfolio Link *
          </Text>
          <Controller
            control={control}
            name="portfolioLink"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter portfolio URL"
                className="bg-white"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="default"
                autoCapitalize="none"
                error={errors?.portfolioLink?.message}
              />
            )}
          />
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
        <View className="flex-1 gap-2">
          <Text className="font-roboto400 text-sm text-title">
            Introduce Yourself
          </Text>
          <Controller
            control={control}
            name="introduction"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Tell us about yourself"
                className="bg-white"
                multiline
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </View>
      </View>
      <View className="my-4 flex-row gap-2">
        <Button
          title="Cancel"
          onPress={() => router.back()}
          className="flex-1 justify-center"
          variant="outline"
          fullWidth
        />
        <Button
          title="Save Changes"
          onPress={handleSubmit(
            onSubmit,
            (err) => {
              console.log("❌ Validation Errors:", err);
              Alert.alert("Validation Failed", "Please fix all required fields.");
            }
          )}
          className="flex-1 justify-center"
          fullWidth
          disabled={isPending}
        />
      </View>
    </View>
  );
};

export default EditPersonalInfoForm;
